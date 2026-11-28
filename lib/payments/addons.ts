import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createSupabaseAdmin(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fulfillPaidOrder(
  orderId: string,
  razorpayPaymentId?: string | null
): Promise<{ ok: boolean; error?: string }> {
  const admin = getAdminSupabase();
  if (!admin) {
    return { ok: false, error: 'Server service role key not configured' };
  }

  const { data: order, error: fetchErr } = await admin
    .from('orders')
    .select('id, invitation_id, status, order_type, addon_quantity')
    .eq('id', orderId)
    .single();

  if (fetchErr || !order) {
    return { ok: false, error: 'Order not found' };
  }

  // Idempotency: if already paid, do not double-apply addon credits
  if (order.status === 'paid') {
    return { ok: true };
  }

  const { error: updateOrderErr } = await admin
    .from('orders')
    .update({
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId || null,
    })
    .eq('id', order.id)
    .neq('status', 'paid');

  if (updateOrderErr) {
    return { ok: false, error: updateOrderErr.message };
  }

  if (order.invitation_id && order.addon_quantity > 0) {
    const { data: inv } = await admin
      .from('invitations')
      .select('id, extra_named_links, extra_live_updates')
      .eq('id', order.invitation_id)
      .single();

    if (inv) {
      if (order.order_type === 'addon_links') {
        await admin
          .from('invitations')
          .update({ extra_named_links: (inv.extra_named_links || 0) + order.addon_quantity })
          .eq('id', inv.id);
      } else if (order.order_type === 'addon_updates') {
        await admin
          .from('invitations')
          .update({ extra_live_updates: (inv.extra_live_updates || 0) + order.addon_quantity })
          .eq('id', inv.id);
      }
    }
  }

  return { ok: true };
}
