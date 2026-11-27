-- ==============================================================================
-- 20261127_0010_phonepe_and_orders.sql
-- Support for PhonePe QR / UPI payments, UTR verification, and Invoices
-- ==============================================================================

DO $$
BEGIN
  -- 1. Add invoice_id to orders
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'invoice_id') THEN
    ALTER TABLE public.orders ADD COLUMN invoice_id TEXT;
  END IF;

  -- 2. Add payment_method to orders
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'payment_method') THEN
    ALTER TABLE public.orders ADD COLUMN payment_method TEXT DEFAULT 'razorpay';
  END IF;

  -- 3. Add utr_number to orders
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'utr_number') THEN
    ALTER TABLE public.orders ADD COLUMN utr_number TEXT;
  END IF;

  -- 4. Add payer info to orders
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'payer_name') THEN
    ALTER TABLE public.orders ADD COLUMN payer_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'payer_phone') THEN
    ALTER TABLE public.orders ADD COLUMN payer_phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'payer_upi') THEN
    ALTER TABLE public.orders ADD COLUMN payer_upi TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_invoice_id ON public.orders(invoice_id);
CREATE INDEX IF NOT EXISTS idx_orders_utr_number ON public.orders(utr_number);

-- ------------------------------------------------------------------------------
-- RPC: submit_phonepe_payment
-- Called when user pays via PhonePe QR and enters UTR or submits order
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_phonepe_payment(
  p_invitation_id UUID,
  p_invoice_id TEXT,
  p_amount_inr NUMERIC,
  p_package_id TEXT,
  p_utr_number TEXT,
  p_payer_name TEXT DEFAULT NULL,
  p_payer_phone TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_order_id UUID;
  v_invitation RECORD;
BEGIN
  v_user_id := auth.uid();

  -- 1. Create or update order
  INSERT INTO public.orders (
    user_id,
    invitation_id,
    amount_inr,
    type,
    package_id,
    payment_method,
    invoice_id,
    utr_number,
    payer_name,
    payer_phone,
    status
  )
  VALUES (
    v_user_id,
    p_invitation_id,
    p_amount_inr,
    'package',
    COALESCE(p_package_id, 'signature'),
    'phonepe_qr',
    p_invoice_id,
    p_utr_number,
    p_payer_name,
    p_payer_phone,
    'paid'
  )
  RETURNING id INTO v_order_id;

  -- 2. If invitation ID exists, publish/unlock it
  IF p_invitation_id IS NOT NULL THEN
    UPDATE public.invitations
    SET
      status = 'published',
      published_at = COALESCE(published_at, NOW()),
      edit_expires_at = COALESCE(edit_expires_at, NOW() + INTERVAL '180 days'),
      package = COALESCE(p_package_id, package, 'signature')
    WHERE id = p_invitation_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'invoice_id', p_invoice_id,
    'status', 'paid',
    'message', 'Payment recorded successfully! Invitation unlocked.'
  );
END;
$$;
