import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { fulfillPaidOrder } from '@/lib/payments/addons';

const VerifySchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payment verification payload' }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Payment secret not configured' }, { status: 500 });
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  // Verify ownership of order
  const { data: order } = await supabase
    .from('orders')
    .select('id, owner_id, razorpay_order_id')
    .eq('id', orderId)
    .eq('owner_id', user.id)
    .single();

  if (!order || order.razorpay_order_id !== razorpay_order_id) {
    return NextResponse.json({ error: 'Order mismatch' }, { status: 403 });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const sigBuf = Buffer.from(razorpay_signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const fulfilled = await fulfillPaidOrder(order.id, razorpay_payment_id);
  if (!fulfilled.ok) {
    return NextResponse.json({ error: fulfilled.error || 'Fulfillment failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
