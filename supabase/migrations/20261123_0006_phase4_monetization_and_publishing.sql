-- ==============================================================================
-- PHASE 4: MONETIZATION, PUBLISHING WORKFLOW & INSIGHTS ANALYTICS
-- Run this in Supabase SQL Editor
-- ==============================================================================

-- 1. Ensure invitations schema & resolve legacy conflicts
DO $$
BEGIN
  -- Rename host_id to owner_id if host_id exists and owner_id does not
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'host_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'owner_id') THEN
    ALTER TABLE public.invitations RENAME COLUMN host_id TO owner_id;
  END IF;

  -- Add owner_id if still not present
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'owner_id') THEN
    ALTER TABLE public.invitations ADD COLUMN owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  -- Sync values if both exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'host_id')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'owner_id') THEN
    UPDATE public.invitations SET owner_id = host_id WHERE owner_id IS NULL AND host_id IS NOT NULL;
  END IF;

  -- Relax legacy NOT NULL columns
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'bride_name') THEN
    ALTER TABLE public.invitations ALTER COLUMN bride_name DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'groom_name') THEN
    ALTER TABLE public.invitations ALTER COLUMN groom_name DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'wedding_date') THEN
    ALTER TABLE public.invitations ALTER COLUMN wedding_date DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'location') THEN
    ALTER TABLE public.invitations ALTER COLUMN location DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'venue') THEN
    ALTER TABLE public.invitations ALTER COLUMN venue DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'package_id') THEN
    ALTER TABLE public.invitations ALTER COLUMN package_id DROP NOT NULL;
  END IF;

  -- Add all required Phase 1 - Phase 4 columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'common_code') THEN
    ALTER TABLE public.invitations ADD COLUMN common_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(4), 'hex');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'status') THEN
    ALTER TABLE public.invitations ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'draft_content') THEN
    ALTER TABLE public.invitations ADD COLUMN draft_content JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'published_content') THEN
    ALTER TABLE public.invitations ADD COLUMN published_content JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'package') THEN
    ALTER TABLE public.invitations ADD COLUMN package TEXT NOT NULL DEFAULT 'signature';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'personalized_limit') THEN
    ALTER TABLE public.invitations ADD COLUMN personalized_limit INTEGER NOT NULL DEFAULT 5;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'updates_used') THEN
    ALTER TABLE public.invitations ADD COLUMN updates_used INTEGER NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'published_at') THEN
    ALTER TABLE public.invitations ADD COLUMN published_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'edit_expires_at') THEN
    ALTER TABLE public.invitations ADD COLUMN edit_expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- 2. Update RLS on invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invitations_owner_all" ON public.invitations;
DROP POLICY IF EXISTS "invitations_host_all" ON public.invitations;
DROP POLICY IF EXISTS "Hosts can view own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Hosts can create own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Hosts can update own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Hosts can delete own invitations" ON public.invitations;

CREATE POLICY "invitations_owner_all" ON public.invitations
  FOR ALL
  USING (auth.uid() = owner_id);

-- 3. ORDERS Table (Idempotent creation and schema update)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
  amount_inr INTEGER NOT NULL DEFAULT 1499,
  type TEXT NOT NULL DEFAULT 'package',
  package_id TEXT,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'created',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reconcile orders schema for existing databases (host_id -> user_id, drop legacy constraints)
DO $$
BEGIN
  -- 1. Rename host_id to user_id if host_id exists and user_id does not
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'host_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_id') THEN
    ALTER TABLE public.orders RENAME COLUMN host_id TO user_id;
  END IF;

  -- 2. Add user_id if still not present
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_id') THEN
    ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;

  -- 3. Sync values if both exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'host_id')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_id') THEN
    UPDATE public.orders SET user_id = host_id WHERE user_id IS NULL AND host_id IS NOT NULL;
  END IF;

  -- 4. Ensure invitation_id exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'invitation_id') THEN
    ALTER TABLE public.orders ADD COLUMN invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE;
  END IF;

  -- 5. Ensure amount_inr exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'amount_inr') THEN
    ALTER TABLE public.orders ADD COLUMN amount_inr INTEGER NOT NULL DEFAULT 1499;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'amount') THEN
      UPDATE public.orders SET amount_inr = ROUND(amount)::INTEGER WHERE amount IS NOT NULL;
    END IF;
  END IF;

  -- 6. Ensure type exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'type') THEN
    ALTER TABLE public.orders ADD COLUMN type TEXT NOT NULL DEFAULT 'package';
  END IF;

  -- 7. Ensure package_id exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'package_id') THEN
    ALTER TABLE public.orders ADD COLUMN package_id TEXT;
  END IF;

  -- 8. Ensure Razorpay columns exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'razorpay_order_id') THEN
    ALTER TABLE public.orders ADD COLUMN razorpay_order_id TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'razorpay_payment_id') THEN
    ALTER TABLE public.orders ADD COLUMN razorpay_payment_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'razorpay_signature') THEN
    ALTER TABLE public.orders ADD COLUMN razorpay_signature TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'status') THEN
    ALTER TABLE public.orders ADD COLUMN status TEXT NOT NULL DEFAULT 'created';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'updated_at') THEN
    ALTER TABLE public.orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- 9. Relax all legacy NOT-NULL constraints on orders
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'customer_name') THEN
    ALTER TABLE public.orders ALTER COLUMN customer_name DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'whatsapp') THEN
    ALTER TABLE public.orders ALTER COLUMN whatsapp DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'email') THEN
    ALTER TABLE public.orders ALTER COLUMN email DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'bride_name') THEN
    ALTER TABLE public.orders ALTER COLUMN bride_name DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'groom_name') THEN
    ALTER TABLE public.orders ALTER COLUMN groom_name DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'wedding_date') THEN
    ALTER TABLE public.orders ALTER COLUMN wedding_date DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'amount') THEN
    ALTER TABLE public.orders ALTER COLUMN amount DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'template_id') THEN
    ALTER TABLE public.orders ALTER COLUMN template_id DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'payment_method') THEN
    ALTER TABLE public.orders ALTER COLUMN payment_method DROP NOT NULL;
  END IF;

  -- 10. Drop legacy constraints that might restrict status or package_id
  ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
  ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_package_id_check;
  ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_type_check;

  -- 11. Ensure rsvps has dietary column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rsvps' AND column_name = 'dietary') THEN
    ALTER TABLE public.rsvps ADD COLUMN dietary TEXT DEFAULT 'Standard';
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rsvps' AND column_name = 'dietary_requirements') THEN
      UPDATE public.rsvps SET dietary = dietary_requirements WHERE dietary_requirements IS NOT NULL;
    END IF;
  END IF;

  -- 12. Ensure guests columns exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'guests') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'delivery_status') THEN
      ALTER TABLE public.guests ADD COLUMN delivery_status TEXT NOT NULL DEFAULT 'draft';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'first_viewed_at') THEN
      ALTER TABLE public.guests ADD COLUMN first_viewed_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'last_viewed_at') THEN
      ALTER TABLE public.guests ADD COLUMN last_viewed_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'view_count') THEN
      ALTER TABLE public.guests ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
    END IF;
  END IF;

  -- 13. Ensure views columns exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'views') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'views' AND column_name = 'device_type') THEN
      ALTER TABLE public.views ADD COLUMN device_type TEXT;
    END IF;
  END IF;
END $$;

-- Enable RLS and set user policy on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_user_select" ON public.orders;
DROP POLICY IF EXISTS "Hosts can view own orders" ON public.orders;

CREATE POLICY "orders_user_select" ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4. RPC: PUBLISH INVITATION (Enforces draft -> published copy, 6-month window)
CREATE OR REPLACE FUNCTION public.publish_invitation(p_invitation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv RECORD;
BEGIN
  -- Verify invitation exists and user is owner
  SELECT * INTO v_inv FROM public.invitations WHERE id = p_invitation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found.';
  END IF;

  IF v_inv.owner_id IS DISTINCT FROM auth.uid() AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: You can only publish invitations you own.';
  END IF;

  -- Update to published: copy draft_content to published_content, set 6 month validity
  UPDATE public.invitations
  SET
    status = 'published',
    published_content = draft_content,
    published_at = NOW(),
    edit_expires_at = NOW() + INTERVAL '6 months',
    updates_used = 0
  WHERE id = p_invitation_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Invitation successfully published live.',
    'invitation_id', p_invitation_id,
    'published_at', NOW(),
    'edit_expires_at', NOW() + INTERVAL '6 months',
    'updates_used', 0,
    'max_updates', 3
  );
END;
$$;

-- 5. RPC: UPDATE PUBLISHED INVITATION (Enforces <= 3 updates and 6-month lock)
CREATE OR REPLACE FUNCTION public.update_published_invitation(p_invitation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv RECORD;
  v_new_updates_used INTEGER;
BEGIN
  -- Verify invitation exists and user is owner
  SELECT * INTO v_inv FROM public.invitations WHERE id = p_invitation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found.';
  END IF;

  IF v_inv.owner_id IS DISTINCT FROM auth.uid() AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: You can only update invitations you own.';
  END IF;

  IF v_inv.status <> 'published' THEN
    RAISE EXCEPTION 'This invitation is still a draft. Please publish it first.';
  END IF;

  -- 1. Enforce 6-month window
  IF v_inv.edit_expires_at IS NOT NULL AND NOW() > v_inv.edit_expires_at THEN
    RAISE EXCEPTION 'The 6-month live editing window has expired. Your invitation remains live and viewable for your guests.';
  END IF;

  -- 2. Enforce maximum 3 updates
  IF v_inv.updates_used >= 3 THEN
    RAISE EXCEPTION 'You have used all 3 allowed live updates for this invitation. Please contact support if urgent changes are needed.';
  END IF;

  v_new_updates_used := COALESCE(v_inv.updates_used, 0) + 1;

  -- 3. Push draft_content to published_content
  UPDATE public.invitations
  SET
    published_content = draft_content,
    updates_used = v_new_updates_used
  WHERE id = p_invitation_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Live changes published successfully.',
    'updates_used', v_new_updates_used,
    'updates_remaining', 3 - v_new_updates_used,
    'edit_expires_at', v_inv.edit_expires_at
  );
END;
$$;

-- 6. RPC: FULFILL INVITATION ORDER (Idempotent payment fulfillment)
CREATE OR REPLACE FUNCTION public.fulfill_invitation_order(
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_razorpay_signature TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_inv RECORD;
  v_new_limit INTEGER;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE razorpay_order_id = p_razorpay_order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found for Razorpay Order ID: %', p_razorpay_order_id;
  END IF;

  -- Mark order as paid
  UPDATE public.orders
  SET
    status = 'paid',
    razorpay_payment_id = p_razorpay_payment_id,
    razorpay_signature = COALESCE(p_razorpay_signature, razorpay_signature),
    updated_at = NOW()
  WHERE id = v_order.id;

  SELECT * INTO v_inv FROM public.invitations WHERE id = v_order.invitation_id;

  -- Fulfill based on order type
  IF v_order.type = 'package' THEN
    -- Map package limits
    v_new_limit := CASE
      WHEN v_order.package_id = 'starter' THEN 5
      WHEN v_order.package_id = 'signature' THEN 25
      WHEN v_order.package_id = 'luxury' THEN 100
      ELSE 25
    END;

    UPDATE public.invitations
    SET
      package = COALESCE(v_order.package_id, 'signature'),
      personalized_limit = GREATEST(COALESCE(personalized_limit, 5), v_new_limit)
    WHERE id = v_order.invitation_id;

  ELSIF v_order.type = 'extra_guests' THEN
    -- Add 50 extra personalized guest links
    v_new_limit := COALESCE(v_inv.personalized_limit, 5) + 50;
    UPDATE public.invitations
    SET personalized_limit = v_new_limit
    WHERE id = v_order.invitation_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order.id,
    'status', 'paid',
    'type', v_order.type,
    'package_id', v_order.package_id,
    'personalized_limit', v_new_limit
  );
END;
$$;

-- 7. RPC: GET INVITATION ANALYTICS (Aggregated stats, device breakdown, RSVP summary)
CREATE OR REPLACE FUNCTION public.get_invitation_analytics(p_invitation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv RECORD;
  v_total_views BIGINT := 0;
  v_unique_visitors BIGINT := 0;
  v_mobile_views BIGINT := 0;
  v_desktop_views BIGINT := 0;
  v_tablet_views BIGINT := 0;

  v_rsvp_attending BIGINT := 0;
  v_rsvp_not_attending BIGINT := 0;
  v_rsvp_maybe BIGINT := 0;
  v_total_headcount BIGINT := 0;

  v_dietary_veg BIGINT := 0;
  v_dietary_non_veg BIGINT := 0;
  v_dietary_jain BIGINT := 0;
  v_dietary_other BIGINT := 0;

  v_guest_rows JSONB;
BEGIN
  -- Verify ownership
  SELECT * INTO v_inv FROM public.invitations WHERE id = p_invitation_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found.';
  END IF;

  IF v_inv.owner_id IS DISTINCT FROM auth.uid() AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized to view analytics for this invitation.';
  END IF;

  -- 1. View Metrics
  SELECT COUNT(*) INTO v_total_views FROM public.views WHERE invitation_id = p_invitation_id;

  SELECT COUNT(DISTINCT COALESCE(guest_id::text, id::text)) INTO v_unique_visitors
  FROM public.views WHERE invitation_id = p_invitation_id;

  SELECT COUNT(*) INTO v_mobile_views FROM public.views
  WHERE invitation_id = p_invitation_id AND LOWER(device_type) LIKE '%mobile%';

  SELECT COUNT(*) INTO v_tablet_views FROM public.views
  WHERE invitation_id = p_invitation_id AND LOWER(device_type) LIKE '%tablet%';

  SELECT COUNT(*) INTO v_desktop_views FROM public.views
  WHERE invitation_id = p_invitation_id AND (device_type IS NULL OR (LOWER(device_type) NOT LIKE '%mobile%' AND LOWER(device_type) NOT LIKE '%tablet%'));

  -- 2. RSVP Metrics
  SELECT COUNT(*) INTO v_rsvp_attending FROM public.rsvps WHERE invitation_id = p_invitation_id AND status = 'attending';
  SELECT COUNT(*) INTO v_rsvp_not_attending FROM public.rsvps WHERE invitation_id = p_invitation_id AND status = 'not_attending';
  SELECT COUNT(*) INTO v_rsvp_maybe FROM public.rsvps WHERE invitation_id = p_invitation_id AND status = 'maybe';

  SELECT COALESCE(SUM(guest_count), 0) INTO v_total_headcount FROM public.rsvps
  WHERE invitation_id = p_invitation_id AND status = 'attending';

  -- Dietary breakdown (among attending guests)
  SELECT COUNT(*) INTO v_dietary_veg FROM public.rsvps
  WHERE invitation_id = p_invitation_id AND status = 'attending' AND LOWER(COALESCE(dietary, '')) LIKE '%veg%' AND LOWER(COALESCE(dietary, '')) NOT LIKE '%non%';

  SELECT COUNT(*) INTO v_dietary_non_veg FROM public.rsvps
  WHERE invitation_id = p_invitation_id AND status = 'attending' AND LOWER(COALESCE(dietary, '')) LIKE '%non%';

  SELECT COUNT(*) INTO v_dietary_jain FROM public.rsvps
  WHERE invitation_id = p_invitation_id AND status = 'attending' AND LOWER(COALESCE(dietary, '')) LIKE '%jain%';

  SELECT COUNT(*) INTO v_dietary_other FROM public.rsvps
  WHERE invitation_id = p_invitation_id AND status = 'attending' AND (dietary IS NULL OR dietary = '' OR LOWER(dietary) IN ('none', 'any', 'all'));

  -- 3. Detailed per-guest engagement
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', g.id,
      'name', g.name,
      'phone', g.phone,
      'personal_slug', g.personal_slug,
      'delivery_status', g.delivery_status,
      'first_viewed_at', g.first_viewed_at,
      'last_viewed_at', g.last_viewed_at,
      'view_count', COALESCE(g.view_count, 0),
      'rsvp_status', r.status,
      'guest_count', r.guest_count,
      'dietary', r.dietary,
      'message', r.message
    ) ORDER BY g.first_viewed_at DESC NULLS LAST, g.name ASC
  ), '[]'::jsonb) INTO v_guest_rows
  FROM public.guests g
  LEFT JOIN public.rsvps r ON r.invitation_id = g.invitation_id AND (r.guest_id = g.id OR r.phone = g.phone)
  WHERE g.invitation_id = p_invitation_id;

  RETURN jsonb_build_object(
    'invitation_id', p_invitation_id,
    'status', v_inv.status,
    'package', v_inv.package,
    'published_at', v_inv.published_at,
    'edit_expires_at', v_inv.edit_expires_at,
    'updates_used', COALESCE(v_inv.updates_used, 0),
    'personalized_limit', COALESCE(v_inv.personalized_limit, 5),
    'views', jsonb_build_object(
      'total', v_total_views,
      'unique', v_unique_visitors,
      'devices', jsonb_build_object(
        'mobile', v_mobile_views,
        'desktop', v_desktop_views,
        'tablet', v_tablet_views
      )
    ),
    'rsvps', jsonb_build_object(
      'attending', v_rsvp_attending,
      'not_attending', v_rsvp_not_attending,
      'maybe', v_rsvp_maybe,
      'total_headcount', v_total_headcount,
      'dietary', jsonb_build_object(
        'veg', v_dietary_veg,
        'non_veg', v_dietary_non_veg,
        'jain', v_dietary_jain,
        'other', v_dietary_other
      )
    ),
    'guests', v_guest_rows
  );
END;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.publish_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_published_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fulfill_invitation_order(TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_invitation_analytics(UUID) TO authenticated;
