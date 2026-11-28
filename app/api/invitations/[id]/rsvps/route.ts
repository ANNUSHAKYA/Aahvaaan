import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invitationId = params.id;

  // Verify ownership
  const { data: inv, error: invErr } = await supabase
    .from('invitations')
    .select('id, owner_id')
    .eq('id', invitationId)
    .eq('owner_id', user.id)
    .single();

  if (invErr || !inv) {
    return NextResponse.json({ error: 'Invitation not found or access denied' }, { status: 403 });
  }

  const { error: delErr } = await supabase
    .from('rsvps')
    .delete()
    .eq('invitation_id', invitationId);

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invitationId = params.id;
  const body = await req.json().catch(() => ({}));
  const digestEnabled = Boolean(body?.rsvp_digest_enabled);

  const { error: upErr } = await supabase
    .from('invitations')
    .update({ rsvp_digest_enabled: digestEnabled })
    .eq('id', invitationId)
    .eq('owner_id', user.id);

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rsvp_digest_enabled: digestEnabled });
}
