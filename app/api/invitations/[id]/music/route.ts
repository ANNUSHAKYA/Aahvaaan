import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ALLOWED_AUDIO_TYPES, MAX_AUDIO_SIZE_BYTES } from '@/lib/music/constants';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invitationId = params.id;

  const { data: inv, error: invErr } = await supabase
    .from('invitations')
    .select('id, owner_id, editing_locked')
    .eq('id', invitationId)
    .eq('owner_id', user.id)
    .single();

  if (invErr || !inv) {
    return NextResponse.json({ error: 'Invitation not found or access denied' }, { status: 403 });
  }
  if (inv.editing_locked) {
    return NextResponse.json({ error: 'Editing window has closed.' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const rightsConfirmed = formData.get('rightsConfirmed') === 'true';

  if (!rightsConfirmed) {
    return NextResponse.json(
      { error: 'Please confirm you own or have rights to use this audio recording.' },
      { status: 400 }
    );
  }

  if (!file) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  const extFromName = file.name?.split('.').pop()?.toLowerCase() || '';
  const validExt = ['mp3', 'm4a', 'wav', 'ogg', 'aac'].includes(extFromName);
  if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !validExt) {
    return NextResponse.json(
      { error: 'Supported formats: MP3, M4A, WAV, OGG, or AAC.' },
      { status: 400 }
    );
  }

  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'Audio file must be 10 MB or smaller.' },
      { status: 400 }
    );
  }

  const ext = validExt ? extFromName : 'mp3';
  const safeBase = (file.name || 'custom-music')
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .slice(0, 40) || 'custom-music';
  const storagePath = `${user.id}/${invitationId}/${Date.now()}-${safeBase}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await supabase.storage
    .from('invitation-music')
    .upload(storagePath, buffer, {
      contentType: file.type || 'audio/mpeg',
      upsert: false,
    });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: signedData } = await supabase.storage
    .from('invitation-music')
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

  return NextResponse.json({
    ok: true,
    path: storagePath,
    signedUrl: signedData?.signedUrl || null,
    fileName: file.name,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path } = await req.json().catch(() => ({}));
  if (!path || typeof path !== 'string') {
    return NextResponse.json({ error: 'path required' }, { status: 400 });
  }

  if (!path.startsWith(`${user.id}/${params.id}/`)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { error } = await supabase.storage.from('invitation-music').remove([path]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
