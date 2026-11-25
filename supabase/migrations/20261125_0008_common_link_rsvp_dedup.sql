-- ==============================================================================
-- Migration: 20261125_0008_common_link_rsvp_dedup.sql
-- Goal: Ensure unique constraint on (invitation_id, phone) for idempotent
--       RSVP submissions from common invitation links.
-- ==============================================================================

-- 1. Deduplicate any existing rsvp entries by invitation_id + phone
DELETE FROM public.rsvps a USING (
  SELECT MIN(ctid) as min_ctid, invitation_id, phone
  FROM public.rsvps
  WHERE phone IS NOT NULL AND phone <> ''
  GROUP BY invitation_id, phone
  HAVING COUNT(*) > 1
) b
WHERE a.invitation_id = b.invitation_id
  AND a.phone = b.phone
  AND a.ctid <> b.min_ctid;

-- 2. Ensure UNIQUE constraint exists on public.rsvps(invitation_id, phone)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rsvps_invitation_id_phone_key'
  ) THEN
    ALTER TABLE public.rsvps ADD CONSTRAINT rsvps_invitation_id_phone_key UNIQUE (invitation_id, phone);
  END IF;
END $$;

-- 3. Ensure Index for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_rsvps_invitation_phone_unique 
  ON public.rsvps (invitation_id, phone);

-- 4. Re-verify the submit_guest_rsvp RPC handles upserts cleanly
CREATE OR REPLACE FUNCTION public.submit_guest_rsvp(
  p_invitation_id UUID,
  p_name TEXT,
  p_phone TEXT,
  p_status TEXT,
  p_guest_count INTEGER DEFAULT 1,
  p_dietary TEXT DEFAULT 'Standard',
  p_message TEXT DEFAULT NULL,
  p_guest_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_rsvp_id UUID;
  v_clean_phone TEXT;
  v_inv RECORD;
  v_is_update BOOLEAN := false;
BEGIN
  -- Validate inputs
  IF p_invitation_id IS NULL OR trim(COALESCE(p_name, '')) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Name and invitation are required.');
  END IF;

  v_clean_phone := regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g');
  IF length(v_clean_phone) < 10 THEN
    RETURN jsonb_build_object('success', false, 'error', 'A valid 10-digit mobile number is required.');
  END IF;

  -- Verify invitation exists
  SELECT * INTO v_inv
  FROM public.invitations
  WHERE id = p_invitation_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invitation not found or inactive.');
  END IF;

  -- Check if existing entry exists to flag update
  IF EXISTS (SELECT 1 FROM public.rsvps WHERE invitation_id = p_invitation_id AND phone = v_clean_phone) THEN
    v_is_update := true;
  END IF;

  -- Upsert into rsvps table (identified by invitation_id + phone)
  INSERT INTO public.rsvps (
    invitation_id,
    guest_id,
    name,
    phone,
    status,
    guest_count,
    dietary,
    message,
    created_at,
    updated_at
  ) VALUES (
    p_invitation_id,
    p_guest_id,
    trim(p_name),
    v_clean_phone,
    p_status,
    GREATEST(1, LEAST(COALESCE(p_guest_count, 1), 20)),
    p_dietary,
    trim(p_message),
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
    guest_id = COALESCE(EXCLUDED.guest_id, public.rsvps.guest_id),
    updated_at = now()
  RETURNING id INTO v_rsvp_id;

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
