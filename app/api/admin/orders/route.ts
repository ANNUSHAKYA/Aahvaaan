import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { fulfillPaidOrder, getAdminSupabase } from '@/lib/payments/addons';

const AdminActionSchema = z.object({
  orderId: z.string().uuid(),
  action: z.enum(['mark_paid', 'refund_note']),
  note: z.string().trim().max(300).optional().default(''),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  const adminUserId = process.env.ADMIN_USER_ID;

  if (authErr || !user || !adminUserId || user.id !== adminUserId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = AdminActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid admin request' }, { status: 400 });
  }

  const admin = getAdminSupabase();
  if (!admin) {
    return NextResponse.json({ error: 'Service role not configured' }, { status: 500 });
  }

  const { orderId, action, note } = parsed.data;

  if (action === 'mark_paid') {
    const res = await fulfillPaidOrder(orderId, `manual_${Date.now()}`);
    if (!res.ok) {
      return NextResponse.json({ error: res.error || 'Failed to mark paid' }, { status: 400 });
    }
    if (note) {
      await admin.from('orders').update({ admin_note: note }).eq('id', orderId);
    }
  } else {
    const { error: upErr } = await admin
      .from('orders')
      .update({ admin_note: note || 'Refund noted by admin' })
      .eq('id', orderId);
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }
  }

  await admin.from('admin_audit_logs').insert({
    admin_user_id: user.id,
    order_id: orderId,
    action,
    note: note || null,
  });

  return NextResponse.json({ ok: true });
}
