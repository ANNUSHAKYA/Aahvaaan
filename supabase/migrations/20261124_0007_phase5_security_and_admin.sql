-- ==============================================================================
-- PHASE 5: SECURITY REVIEW, RLS CONFIRMATION, AND ADMIN DASHBOARD SUPPORT
-- Migration: 20261124_0007_phase5_security_and_admin.sql
-- ==============================================================================

-- 1. Ensure `is_admin` column exists on profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- 2. Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Confirm and enforce Row Level Security (RLS) on all core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'invitation_views') THEN
    ALTER TABLE public.invitation_views ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'templates') THEN
    ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 4. Admin RLS Policies for Orders
DROP POLICY IF EXISTS "admins_view_all_orders" ON public.orders;
CREATE POLICY "admins_view_all_orders" ON public.orders
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "admins_update_orders" ON public.orders;
CREATE POLICY "admins_update_orders" ON public.orders
  FOR UPDATE
  USING (public.is_admin());

-- 5. Admin RLS Policies for Profiles
DROP POLICY IF EXISTS "admins_view_all_profiles" ON public.profiles;
CREATE POLICY "admins_view_all_profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "admins_update_profiles" ON public.profiles;
CREATE POLICY "admins_update_profiles" ON public.profiles
  FOR UPDATE
  USING (public.is_admin());

-- 6. Admin RLS Policies for Invitations
DROP POLICY IF EXISTS "admins_view_all_invitations" ON public.invitations;
CREATE POLICY "admins_view_all_invitations" ON public.invitations
  FOR SELECT
  USING (public.is_admin());

-- 7. RSVP Flood Protection / Rate Limiting inside submit_guest_rsvp
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
  v_inv RECORD;
  v_clean_phone TEXT;
  v_rsvp_id UUID;
  v_recent_count INT;
BEGIN
  -- Clean input
  v_clean_phone := regexp_replace(COALESCE(p_phone, ''), '[^0-9+]', '', 'g');

  IF length(v_clean_phone) < 10 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Please enter a valid 10-digit mobile number.');
  END IF;

  -- 1. Rate Limiting Check: Max 5 submissions per phone number per invitation within 10 minutes
  SELECT count(*) INTO v_recent_count
  FROM public.rsvps
  WHERE invitation_id = p_invitation_id
    AND phone = v_clean_phone
    AND updated_at > (now() - interval '10 minutes');

  IF v_recent_count >= 5 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Too many RSVP updates submitted in a short time. Please wait a few minutes before updating again.'
    );
  END IF;

  -- 2. Verify invitation exists
  SELECT * INTO v_inv
  FROM public.invitations
  WHERE id = p_invitation_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invitation not found or inactive.');
  END IF;

  -- 3. Upsert into rsvps table (identified by invitation_id + phone)
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
    'message', 'Your RSVP response has been successfully recorded.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Admin RPC to retrieve platform-wide metrics securely
CREATE OR REPLACE FUNCTION public.get_admin_overview()
RETURNS JSONB AS $$
DECLARE
  v_is_adm BOOLEAN;
  v_total_users INT;
  v_total_invitations INT;
  v_total_orders INT;
  v_total_revenue NUMERIC;
  v_recent_orders JSONB;
  v_recent_users JSONB;
BEGIN
  -- Verify caller is admin
  v_is_adm := public.is_admin();
  IF NOT v_is_adm THEN
    RAISE EXCEPTION 'Unauthorized: Administrator access required.';
  END IF;

  SELECT count(*) INTO v_total_users FROM public.profiles;
  SELECT count(*) INTO v_total_invitations FROM public.invitations;
  SELECT count(*), COALESCE(sum(amount), 0) INTO v_total_orders, v_total_revenue 
  FROM public.orders WHERE status = 'paid';

  -- Last 10 orders
  SELECT COALESCE(jsonb_agg(o), '[]'::jsonb) INTO v_recent_orders
  FROM (
    SELECT id, order_id, amount, currency, status, package_id, created_at
    FROM public.orders
    ORDER BY created_at DESC
    LIMIT 10
  ) o;

  -- Last 10 users
  SELECT COALESCE(jsonb_agg(u), '[]'::jsonb) INTO v_recent_users
  FROM (
    SELECT id, name, email, is_admin, created_at
    FROM public.profiles
    ORDER BY created_at DESC
    LIMIT 10
  ) u;

  RETURN jsonb_build_object(
    'success', true,
    'total_users', v_total_users,
    'total_invitations', v_total_invitations,
    'total_orders', v_total_orders,
    'total_revenue', v_total_revenue,
    'recent_orders', v_recent_orders,
    'recent_users', v_recent_users
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
