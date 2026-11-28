import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import siteConfig from '@/lib/siteConfig';
import { fulfillPaidOrder } from '@/lib/payments/addons';

const CreateOrderSchema = z.object({
  invitationId: z.string().uuid(),
  packId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid order request' }, { status: 400 });
  }

  const { invitationId, packId } = parsed.data;
  const allPacks = [...siteConfig.addons.linksPacks, ...siteConfig.addons.updatesPacks];
  const pack = allPacks.find((p) => p.id === packId);
  if (!pack) {
    return NextResponse.json({ error: 'Unknown add-on pack' }, { status: 400 });
  }

  // Verify ownership
  const { data: inv, error: invErr } = await supabase
    .from('invitations')
    .select('id, owner_id')
    .eq('id', invitationId)
    .eq('owner_id', user.id)
    .single();

  if (invErr || !inv) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 403 });
  }

  const paymentsEnabled = process.env.PAYMENTS_ENABLED === 'true';
  const rzpKeyId = process.env.RAZORPAY_KEY_ID;
  const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;

  let razorpayOrderId: string | null = null;

  if (paymentsEnabled && rzpKeyId && rzpKeySecret) {
    const authHeader = Buffer.from(`${rzpKeyId}:${rzpKeySecret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: pack.priceInr * 100,
        currency: 'INR',
        receipt: `${pack.orderType}_${invitationId.slice(0, 8)}_${Date.now()}`,
        notes: {
          invitation_id: invitationId,
          order_type: pack.orderType,
          addon_quantity: String(pack.quantity),
        },
      }),
    });

    const rzpData = await rzpRes.json().catch(() => ({}));
    if (!rzpRes.ok || !rzpData.id) {
      return NextResponse.json(
        { error: rzpData?.error?.description || 'Failed to create Razorpay order' },
        { status: 502 }
      );
    }
    razorpayOrderId = rzpData.id;
  } else {
    razorpayOrderId = `order_test_${Date.now()}`;
  }

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      owner_id: user.id,
      invitation_id: invitationId,
      amount_inr: pack.priceInr,
      status: 'created',
      order_type: pack.orderType,
      addon_quantity: pack.quantity,
      razorpay_order_id: razorpayOrderId,
    })
    .select('id, razorpay_order_id, amount_inr, order_type, addon_quantity')
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: orderErr?.message || 'Failed to record order' }, { status: 500 });
  }

  // Test mode auto-fulfill when PAYMENTS_ENABLED !== 'true'
  if (!paymentsEnabled) {
    const fulfilled = await fulfillPaidOrder(order.id, `pay_test_${Date.now()}`);
    if (!fulfilled.ok) {
      // Fallback if SUPABASE_SERVICE_ROLE_KEY isn't set locally: update via owner RLS
      await supabase
        .from('orders')
        .update({ status: 'paid', razorpay_payment_id: `pay_test_${Date.now()}` })
        .eq('id', order.id)
        .eq('owner_id', user.id);

      const { data: curInv } = await supabase
        .from('invitations')
        .select('extra_named_links, extra_live_updates')
        .eq('id', invitationId)
        .eq('owner_id', user.id)
        .single();

      if (curInv) {
        if (pack.orderType === 'addon_links') {
          await supabase
            .from('invitations')
            .update({ extra_named_links: (curInv.extra_named_links || 0) + pack.quantity })
            .eq('id', invitationId)
            .eq('owner_id', user.id);
        } else {
          await supabase
            .from('invitations')
            .update({ extra_live_updates: (curInv.extra_live_updates || 0) + pack.quantity })
            .eq('id', invitationId)
            .eq('owner_id', user.id);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      testMode: true,
      order,
    });
  }

  return NextResponse.json({
    ok: true,
    testMode: false,
    keyId: rzpKeyId,
    order,
  });
}
