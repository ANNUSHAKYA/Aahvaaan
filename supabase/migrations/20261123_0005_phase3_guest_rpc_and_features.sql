-- ==============================================================================
-- PHASE 3 MIGRATION: Guest-Facing Security Definer RPC Functions & Host Tools
-- ==============================================================================

-- 1. Helper function to generate secure unguessable slug
CREATE OR REPLACE FUNCTION public.generate_guest_slug()
RETURNS TEXT AS $$
BEGIN
  RETURN lower(encode(gen_random_bytes(12), 'hex'));
END;
$$ LANGUAGE plpgsql;

-- 2. Lookup invitation by common code or public slug (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_invitation_by_common_code(p_code TEXT)
RETURNS JSONB AS $$
DECLARE
  v_inv RECORD;
  v_tmpl RECORD;
  v_result JSONB;
BEGIN
  -- Lookup by common_code or slug
  SELECT i.* INTO v_inv
  FROM public.invitations i
  WHERE i.common_code = p_code OR i.slug = p_code
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Lookup template metadata
  SELECT t.* INTO v_tmpl
  FROM public.templates t
  WHERE t.slug = v_inv.template_id
  LIMIT 1;

  v_result := jsonb_build_object(
    'id', v_inv.id,
    'slug', v_inv.slug,
    'common_code', v_inv.common_code,
    'status', v_inv.status,
    'package', v_inv.package,
    'content', COALESCE(v_inv.published_content, v_inv.draft_content),
    'is_personalized', false,
    'guest', NULL,
    'template', jsonb_build_object(
      'id', COALESCE(v_tmpl.slug, v_inv.template_id),
      'name', COALESCE(v_tmpl.name, 'Wedding Invitation'),
      'palette', v_tmpl.content_schema->'palette',
      'preview_image', v_tmpl.preview_image
    )
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Lookup invitation by guest's personal unguessable slug (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_invitation_by_personal_slug(p_personal_slug TEXT)
RETURNS JSONB AS $$
DECLARE
  v_guest RECORD;
  v_inv RECORD;
  v_tmpl RECORD;
  v_result JSONB;
BEGIN
  -- Lookup guest by personal_slug
  SELECT g.* INTO v_guest
  FROM public.guests g
  WHERE g.personal_slug = p_personal_slug
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Lookup parent invitation
  SELECT i.* INTO v_inv
  FROM public.invitations i
  WHERE i.id = v_guest.invitation_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Lookup template metadata
  SELECT t.* INTO v_tmpl
  FROM public.templates t
  WHERE t.slug = v_inv.template_id
  LIMIT 1;

  v_result := jsonb_build_object(
    'id', v_inv.id,
    'slug', v_inv.slug,
    'common_code', v_inv.common_code,
    'status', v_inv.status,
    'package', v_inv.package,
    'content', COALESCE(v_inv.published_content, v_inv.draft_content),
    'is_personalized', true,
    'guest', jsonb_build_object(
      'id', v_guest.id,
      'name', v_guest.name,
      'phone', v_guest.phone,
      'personal_slug', v_guest.personal_slug,
      'view_count', v_guest.view_count
    ),
    'template', jsonb_build_object(
      'id', COALESCE(v_tmpl.slug, v_inv.template_id),
      'name', COALESCE(v_tmpl.name, 'Wedding Invitation'),
      'palette', v_tmpl.content_schema->'palette',
      'preview_image', v_tmpl.preview_image
    )
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Record View (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.record_guest_view(
  p_invitation_id UUID,
  p_guest_id UUID DEFAULT NULL,
  p_device_type TEXT DEFAULT 'mobile'
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Insert into views table
  INSERT INTO public.views (invitation_id, guest_id, device_type, created_at)
  VALUES (p_invitation_id, p_guest_id, COALESCE(p_device_type, 'mobile'), NOW());

  -- If personalized guest, update their view analytics
  IF p_guest_id IS NOT NULL THEN
    UPDATE public.guests
    SET
      view_count = COALESCE(view_count, 0) + 1,
      first_viewed_at = COALESCE(first_viewed_at, NOW()),
      last_viewed_at = NOW()
    WHERE id = p_guest_id;
  END IF;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Submit or Update RSVP (SECURITY DEFINER with ON CONFLICT UPDATE)
CREATE OR REPLACE FUNCTION public.submit_guest_rsvp(
  p_invitation_id UUID,
  p_name TEXT,
  p_phone TEXT,
  p_status TEXT,
  p_guest_count INT DEFAULT 1,
  p_dietary TEXT DEFAULT 'Pure Vegetarian',
  p_message TEXT DEFAULT NULL,
  p_guest_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_clean_phone TEXT;
BEGIN
  -- Basic validation
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Name is required');
  END IF;

  v_clean_phone := regexp_replace(p_phone, '[^0-9+]', '', 'g');
  IF v_clean_phone IS NULL OR length(v_clean_phone) < 10 THEN
    RETURN jsonb_build_object('success', false, 'error', 'A valid 10-digit phone number is required');
  END IF;

  IF p_status NOT IN ('attending', 'not_attending', 'maybe') THEN
    p_status := 'attending';
  END IF;

  -- Upsert into rsvps table (UNIQUE constraint on invitation_id, phone)
  INSERT INTO public.rsvps (
    invitation_id,
    guest_id,
    name,
    phone,
    status,
    guest_count,
    dietary,
    message,
    created_at
  ) VALUES (
    p_invitation_id,
    p_guest_id,
    trim(p_name),
    v_clean_phone,
    p_status,
    GREATEST(1, COALESCE(p_guest_count, 1)),
    COALESCE(p_dietary, 'Pure Vegetarian'),
    nullif(trim(p_message), ''),
    NOW()
  )
  ON CONFLICT (invitation_id, phone) DO UPDATE SET
    name = EXCLUDED.name,
    status = EXCLUDED.status,
    guest_count = EXCLUDED.guest_count,
    dietary = EXCLUDED.dietary,
    message = EXCLUDED.message,
    guest_id = COALESCE(EXCLUDED.guest_id, rsvps.guest_id);

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Your RSVP has been recorded with warm regards!'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Add Personalized Guest with Package Limit Enforcement
CREATE OR REPLACE FUNCTION public.add_personalized_guest(
  p_invitation_id UUID,
  p_name TEXT,
  p_phone TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_inv RECORD;
  v_current_count INT;
  v_new_slug TEXT;
  v_guest_id UUID;
BEGIN
  -- Verify caller owns the invitation
  SELECT * INTO v_inv
  FROM public.invitations
  WHERE id = p_invitation_id AND owner_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found or unauthorized.';
  END IF;

  -- Count existing personalized guests
  SELECT count(*) INTO v_current_count
  FROM public.guests
  WHERE invitation_id = p_invitation_id;

  IF v_current_count >= v_inv.personalized_limit THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'limit_reached',
      'message', format('Your %s package is limited to %s personalized links. Please upgrade your package to invite more guests individually.', v_inv.package, v_inv.personalized_limit)
    );
  END IF;

  -- Generate slug and insert
  v_new_slug := public.generate_guest_slug();

  INSERT INTO public.guests (
    invitation_id,
    name,
    phone,
    personal_slug,
    delivery_status,
    view_count
  ) VALUES (
    p_invitation_id,
    trim(p_name),
    regexp_replace(COALESCE(p_phone, ''), '[^0-9+]', '', 'g'),
    v_new_slug,
    'pending',
    0
  )
  RETURNING id INTO v_guest_id;

  RETURN jsonb_build_object(
    'success', true,
    'guest', jsonb_build_object(
      'id', v_guest_id,
      'name', trim(p_name),
      'phone', p_phone,
      'personal_slug', v_new_slug,
      'view_count', 0
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. Hard Server-Side Trigger: Enforce personalized_limit on direct table inserts
CREATE OR REPLACE FUNCTION public.check_guest_limit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_limit INT;
  v_count INT;
BEGIN
  SELECT personalized_limit INTO v_limit
  FROM public.invitations
  WHERE id = NEW.invitation_id;

  SELECT count(*) INTO v_count
  FROM public.guests
  WHERE invitation_id = NEW.invitation_id;

  IF v_count >= COALESCE(v_limit, 5) THEN
    RAISE EXCEPTION 'Personalized guest link limit reached for this invitation (limit: %). Please upgrade your package.', v_limit;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enforce_guest_limit ON public.guests;
CREATE TRIGGER trigger_enforce_guest_limit
  BEFORE INSERT ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION public.check_guest_limit_trigger();
