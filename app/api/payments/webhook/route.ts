import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { fulfillPaidOrder, getAdminSupabase } from '@/lib/payments/addons';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const signature = req.headers.get('x-razorpay-signature') || '';
  const rawBody = await req.text();

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (!signature || sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  if (event?.event === 'payment.captured' || event?.event === 'order.paid') {
    const payment = event?.payload?.payment?.entity;
    const rzpOrderId = payment?.order_id || event?.payload?.order?.entity?.id;
    const rzpPaymentId = payment?.id;

    if (rzpOrderId) {
      const admin = getAdminSupabase();
      if (admin) {
        const { data: order } = await admin
          .from('orders')
          .select('id')
          .eq('razorpay_order_id', rzpOrderId)
          .maybeSingle();

        if (order) {
          await fulfillPaidOrder(order.id, rzpPaymentId);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
