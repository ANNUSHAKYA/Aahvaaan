import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/payments/addons';

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization') || '';
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getAdminSupabase();
  if (!admin) {
    return NextResponse.json({ error: 'Service role not configured' }, { status: 500 });
  }

  const nowIso = new Date().toISOString();

  // 1. Lock editing for invitations whose edit window has ended (published stays viewable)
  const { data: lockedRows } = await admin
    .from('invitations')
    .update({ editing_locked: true })
    .lt('edit_window_ends_at', nowIso)
    .eq('editing_locked', false)
    .select('id');

  // 2. Send 7-day expiry reminder emails (once per invitation)
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: expiringRows } = await admin
    .from('invitations')
    .select('id, owner_id, couple_names, edit_window_ends_at')
    .eq('status', 'published')
    .eq('editing_locked', false)
    .is('expiry_reminder_sent_at', null)
    .gt('edit_window_ends_at', nowIso)
    .lte('edit_window_ends_at', sevenDaysFromNow);

  let remindersSent = 0;
  const resendKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'Aahvaaan <onboarding@resend.dev>';

  if (resendKey && expiringRows && expiringRows.length > 0) {
    for (const inv of expiringRows) {
      try {
        const { data: userRes } = await admin.auth.admin.getUserById(inv.owner_id);
        const email = userRes?.user?.email;
        if (!email) continue;

        const couple = (inv.couple_names as { bride?: string; groom?: string }) || {};
        const title = couple.bride && couple.groom ? `${couple.bride} & ${couple.groom}` : 'your invitation';

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            subject: `Editing window closes in 7 days — ${title}`,
            text: `Your editing window for ${title} closes in 7 days. Your published invitation will remain viewable to guests even after editing locks.`,
          }),
        });

        await admin
          .from('invitations')
          .update({ expiry_reminder_sent_at: nowIso })
          .eq('id', inv.id);
        remindersSent += 1;
      } catch {
        // continue with remaining invitations
      }
    }
  }

  return NextResponse.json({
    ok: true,
    lockedCount: lockedRows?.length || 0,
    remindersSent,
  });
}
