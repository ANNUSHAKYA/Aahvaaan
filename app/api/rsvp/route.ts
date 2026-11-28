import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const RsvpBodySchema = z.object({
  invitation_slug: z.string().min(1).max(64),
  guest_slug: z.string().max(64).nullable().optional(),
  name: z.string().trim().min(1, 'Please enter your name').max(80),
  attending: z.boolean(),
  party_size: z.number().int().min(1, 'Party size must be at least 1').max(20),
  events_attending: z.array(z.string().max(80)).max(20).optional().default([]),
  meal_preference: z.string().trim().max(60).nullable().optional(),
  message: z.string().trim().max(300, 'Message cannot exceed 300 characters').nullable().optional(),
  website: z.string().optional().default(''), // honeypot
});

function sanitizeText(val: string): string {
  return val.trim().replace(/[<>]/g, '');
}

function getHashedIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const realIp = req.headers.get('x-real-ip') || '';
  const rawIp = forwarded.split(',')[0]?.trim() || realIp.trim() || 'unknown';
  const salt = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 16) || 'aahvaaan-rsvp';
  return crypto.createHash('sha256').update(`${salt}:${rawIp}`).digest('hex');
}

async function maybeNotifyHostViaResend(params: {
  invitationSlug: string;
  guestName: string;
  attending: boolean;
  partySize: number;
  isUpdate: boolean;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!resendKey || !supabaseUrl || !serviceKey) return;

  try {
    const admin = createSupabaseAdmin(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: inv } = await admin
      .from('invitations')
      .select('id, owner_id, couple_names, rsvp_digest_enabled')
      .eq('slug', params.invitationSlug)
      .single();

    // Respect daily digest setting (if enabled, skip instant per-RSVP email)
    if (!inv || inv.rsvp_digest_enabled) return;

    const { data: userRes } = await admin.auth.admin.getUserById(inv.owner_id);
    const hostEmail = userRes?.user?.email;
    if (!hostEmail) return;

    const couple = (inv.couple_names as { bride?: string; groom?: string }) || {};
    const coupleTitle = couple.bride && couple.groom ? `${couple.bride} & ${couple.groom}` : 'Your wedding';
    const statusLabel = params.attending ? `Attending (party of ${params.partySize})` : 'Unable to attend';
    const actionLabel = params.isUpdate ? 'updated their RSVP' : 'sent an RSVP';

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Aahvaaan <onboarding@resend.dev>';
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://aahvaaan.vercel.app'}/dashboard/invitations/${inv.id}/rsvps`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [hostEmail],
        subject: `${params.guestName} ${actionLabel} — ${coupleTitle}`,
        text: [
          `${params.guestName} ${actionLabel} for ${coupleTitle}.`,
          `Status: ${statusLabel}`,
          ``,
          `View all replies: ${dashboardUrl}`,
        ].join('\n'),
      }),
    });
  } catch (err) {
    console.warn('Resend RSVP notification skipped:', err);
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = RsvpBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid RSVP input' },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot check: silently succeed without saving spam
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ ok: true, is_update: false });
  }

  const supabase = createClient();

  // Per-IP rate limit: max 5 submissions per hour per invitation (hashed IP only)
  const ipHash = getHashedIp(req);
  const { data: allowed, error: rlErr } = await supabase.rpc('check_rsvp_rate_limit', {
    p_invitation_slug: data.invitation_slug,
    p_ip_hash: ipHash,
  });

  if (!rlErr && allowed === false) {
    return NextResponse.json(
      { error: 'Too many RSVP attempts from your connection. Please try again in an hour.' },
      { status: 429 }
    );
  }

  const cleanName = sanitizeText(data.name);
  const cleanMessage = data.message ? sanitizeText(data.message) : null;
  const cleanMeal = data.meal_preference ? sanitizeText(data.meal_preference) : null;
  const cleanEvents = (data.events_attending || []).map(sanitizeText).filter(Boolean);

  const { data: rpcResult, error: rpcError } = await supabase.rpc('submit_rsvp', {
    p_invitation_slug: data.invitation_slug,
    p_name: cleanName,
    p_attending: data.attending,
    p_party_size: data.attending ? data.party_size : 1,
    p_message: cleanMessage,
    p_guest_slug: data.guest_slug || null,
    p_events_attending: cleanEvents,
    p_meal_preference: cleanMeal,
  });

  if (rpcError) {
    return NextResponse.json(
      { error: rpcError.message || 'Unable to submit RSVP right now.' },
      { status: 400 }
    );
  }

  const result = rpcResult as { success?: boolean; error?: string; rsvp_id?: string; is_update?: boolean } | null;
  if (!result?.success) {
    return NextResponse.json(
      { error: result?.error || 'Unable to submit RSVP.' },
      { status: 400 }
    );
  }

  // Non-blocking optional Resend notification
  void maybeNotifyHostViaResend({
    invitationSlug: data.invitation_slug,
    guestName: cleanName,
    attending: data.attending,
    partySize: data.attending ? data.party_size : 1,
    isUpdate: Boolean(result.is_update),
  });

  return NextResponse.json({
    ok: true,
    rsvp_id: result.rsvp_id,
    is_update: Boolean(result.is_update),
  });
}
