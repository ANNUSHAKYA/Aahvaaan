-- ==============================================================================
-- Migration: 20261127_0009_luxury_upgrade.sql
-- Goal: Upgrade Aahvaaan for luxury Indian wedding features:
--       - Enhanced RSVP (headcount, food pref, stay requirement & details)
--       - Bulk Guest List tags & greetings
--       - Shagun / Blessing Notes table
--       - Live Location module support
-- ==============================================================================

-- 1. Upgrade public.rsvps table
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS stay_required TEXT DEFAULT 'No Stay Needed';
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS stay_details TEXT;
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS events_attending JSONB;

-- 2. Upgrade public.guests table
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS group_tag TEXT DEFAULT 'General';
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS custom_greeting TEXT;
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;

-- 3. Dedicated Shagun & Blessing Notes Table
CREATE TABLE IF NOT EXISTS public.blessings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  relation_city TEXT,
  blessing_note TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for public.blessings
ALTER TABLE public.blessings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blessings' AND policyname = 'Public can read approved blessings'
  ) THEN
    CREATE POLICY "Public can read approved blessings" ON public.blessings
      FOR SELECT USING (is_approved = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blessings' AND policyname = 'Anyone can submit blessing'
  ) THEN
    CREATE POLICY "Anyone can submit blessing" ON public.blessings
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blessings' AND policyname = 'Host can manage blessings'
  ) THEN
    CREATE POLICY "Host can manage blessings" ON public.blessings
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.invitations
          WHERE id = blessings.invitation_id
            AND (owner_id = auth.uid() OR host_id = auth.uid())
        )
      );
  END IF;
END $$;

-- 4. RPC for submitting a blessing note directly
CREATE OR REPLACE FUNCTION public.submit_blessing_note(
  p_invitation_id UUID,
  p_guest_name TEXT,
  p_relation_city TEXT,
  p_blessing_note TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_blessing_id UUID;
BEGIN
  IF p_invitation_id IS NULL OR trim(COALESCE(p_guest_name, '')) = '' OR trim(COALESCE(p_blessing_note, '')) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Name and blessing note are required.');
  END IF;

  INSERT INTO public.blessings (
    invitation_id,
    guest_name,
    relation_city,
    blessing_note,
    created_at
  ) VALUES (
    p_invitation_id,
    trim(p_guest_name),
    trim(p_relation_city),
    trim(p_blessing_note),
    now()
  )
  RETURNING id INTO v_blessing_id;

  RETURN jsonb_build_object(
    'success', true,
    'blessing_id', v_blessing_id,
    'message', 'Your warm blessing has been lovingly recorded!'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Updated submit_guest_rsvp RPC with stay and events support
CREATE OR REPLACE FUNCTION public.submit_guest_rsvp(
  p_invitation_id UUID,
  p_name TEXT,
  p_phone TEXT,
  p_status TEXT,
  p_guest_count INTEGER DEFAULT 1,
  p_dietary TEXT DEFAULT 'Pure Vegetarian',
  p_message TEXT DEFAULT NULL,
  p_guest_id UUID DEFAULT NULL,
  p_stay_required TEXT DEFAULT 'No Stay Needed',
  p_stay_details TEXT DEFAULT NULL,
  p_events_attending JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_rsvp_id UUID;
  v_clean_phone TEXT;
  v_inv RECORD;
  v_is_update BOOLEAN := false;
BEGIN
  IF p_invitation_id IS NULL OR trim(COALESCE(p_name, '')) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Name and invitation are required.');
  END IF;

  v_clean_phone := regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g');
  IF length(v_clean_phone) < 10 THEN
    RETURN jsonb_build_object('success', false, 'error', 'A valid 10-digit mobile number is required.');
  END IF;

  SELECT * INTO v_inv
  FROM public.invitations
  WHERE id = p_invitation_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invitation not found or inactive.');
  END IF;

  IF EXISTS (SELECT 1 FROM public.rsvps WHERE invitation_id = p_invitation_id AND phone = v_clean_phone) THEN
    v_is_update := true;
  END IF;

  INSERT INTO public.rsvps (
    invitation_id,
    guest_id,
    name,
    phone,
    status,
    guest_count,
    dietary,
    message,
    stay_required,
    stay_details,
    events_attending,
    created_at,
    updated_at
  ) VALUES (
    p_invitation_id,
    p_guest_id,
    trim(p_name),
    v_clean_phone,
    p_status,
    GREATEST(1, LEAST(COALESCE(p_guest_count, 1), 30)),
    COALESCE(p_dietary, 'Pure Vegetarian'),
    trim(p_message),
    COALESCE(p_stay_required, 'No Stay Needed'),
    trim(p_stay_details),
    p_events_attending,
    now(),
    now()
  )
  ON CONFLICT (invitation_id, phone) DO UPDATE
  SET
    name = trim(EXCLUDED.name),
    status = EXCLUDED.status,
    guest_count = EXCLUDED.guest_count,
    dietary = EXCLUDED.dietary,
    message = EXCLUDED.message,
    stay_required = EXCLUDED.stay_required,
    stay_details = EXCLUDED.stay_details,
    events_attending = COALESCE(EXCLUDED.events_attending, public.rsvps.events_attending),
    guest_id = COALESCE(EXCLUDED.guest_id, public.rsvps.guest_id),
    updated_at = now()
  RETURNING id INTO v_rsvp_id;

  -- Also save to blessings table if a message was written
  IF trim(COALESCE(p_message, '')) <> '' THEN
    INSERT INTO public.blessings (
      invitation_id,
      guest_name,
      relation_city,
      blessing_note,
      created_at
    ) VALUES (
      p_invitation_id,
      trim(p_name),
      'RSVP Guest',
      trim(p_message),
      now()
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'rsvp_id', v_rsvp_id,
    'status', p_status,
    'is_update', v_is_update,
    'message', CASE 
      WHEN v_is_update THEN 'Welcome back! Your RSVP response has been successfully updated.'
      ELSE 'Your RSVP response has been successfully recorded.'
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
