import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
const MAX_PHOTOS = 8;

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

  // Verify ownership
  const { data: inv, error: fetchErr } = await supabase
    .from('invitations')
    .select('id, owner_id, photos')
    .eq('id', invitationId)
    .eq('owner_id', user.id)
    .single();

  if (fetchErr || !inv) {
    return NextResponse.json({ error: 'Invitation not found or access denied' }, { status: 403 });
  }

  // Check existing photo count in draft
  const { data: draft } = await supabase
    .from('invitation_drafts')
    .select('data')
    .eq('invitation_id', invitationId)
    .maybeSingle();

  const draftData = (draft?.data as Record<string, unknown>) || {};
  const existingPhotos: string[] = Array.isArray(draftData.photos) ? (draftData.photos as string[]) : [];

  if (existingPhotos.length >= MAX_PHOTOS) {
    return NextResponse.json({ error: `Maximum ${MAX_PHOTOS} photos allowed` }, { status: 400 });
  }

  // Parse multipart form
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only jpg, png, webp images are allowed' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File must be under 3 MB' }, { status: 400 });
  }

  if (existingPhotos.length >= MAX_PHOTOS) {
    return NextResponse.json({ error: 'Photo limit reached' }, { status: 400 });
  }

  const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `${user.id}/${invitationId}/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadErr } = await supabase.storage
    .from('invitation-photos')
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadErr) {
    console.error('Photo upload error:', uploadErr);
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  // Generate a signed URL valid for 1 year
  const { data: signedData } = await supabase.storage
    .from('invitation-photos')
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

  return NextResponse.json({
    ok: true,
    path: storagePath,
    signedUrl: signedData?.signedUrl || null,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { path } = await req.json();
  if (!path || typeof path !== 'string') return NextResponse.json({ error: 'path required' }, { status: 400 });

  // Security: path must start with owner_id
  if (!path.startsWith(user.id + '/')) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { error } = await supabase.storage.from('invitation-photos').remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
