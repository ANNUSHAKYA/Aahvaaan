import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAdminSupabase } from '@/lib/payments/addons';
import { MUSIC_CATEGORIES } from '@/lib/music/constants';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  const adminUserId = process.env.ADMIN_USER_ID;
  if (error || !user || !adminUserId || user.id !== adminUserId) {
    return null;
  }
  return user;
}

const PatchTrackSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(120).optional(),
  artist: z.string().trim().max(120).nullable().optional(),
  movie_or_album: z.string().trim().max(120).nullable().optional(),
  category: z.string().trim().min(1).max(80).optional(),
  duration_seconds: z.number().int().min(0).max(3600).optional(),
  license_type: z.enum(['original', 'licensed', 'royalty_free']).optional(),
  license_confirmed: z.boolean().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = getAdminSupabase();
  if (!admin) return NextResponse.json({ error: 'Service role not configured' }, { status: 500 });

  const formData = await req.formData();
  const title = String(formData.get('title') || '').trim();
  const artist = String(formData.get('artist') || '').trim() || null;
  const movieOrAlbum = String(formData.get('movie_or_album') || '').trim() || null;
  const category = String(formData.get('category') || MUSIC_CATEGORIES[0]).trim();
  const durationSeconds = Math.max(0, parseInt(String(formData.get('duration_seconds') || '0'), 10) || 0);
  const licenseType = String(formData.get('license_type') || 'original') as 'original' | 'licensed' | 'royalty_free';
  const licenseConfirmed = formData.get('license_confirmed') === 'true';
  const isPublished = formData.get('is_published') === 'true';
  const isFeatured = formData.get('is_featured') === 'true';

  if (!title) {
    return NextResponse.json({ error: 'Song title is required' }, { status: 400 });
  }

  if (isPublished && !licenseConfirmed) {
    return NextResponse.json(
      { error: 'Commercial distribution rights must be confirmed before publishing a track.' },
      { status: 400 }
    );
  }

  const audioFile = formData.get('audio') as File | null;
  const coverFile = formData.get('cover') as File | null;
  let audioUrl = String(formData.get('audio_url') || '').trim();
  let coverUrl: string | null = null;

  if (audioFile && audioFile.size > 0) {
    const ext = audioFile.name?.split('.').pop()?.toLowerCase() || 'mp3';
    const path = `tracks/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buf = Buffer.from(await audioFile.arrayBuffer());
    const { error: upErr } = await admin.storage
      .from('music-library')
      .upload(path, buf, { contentType: audioFile.type || 'audio/mpeg', upsert: false });
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }
    const { data: pub } = admin.storage.from('music-library').getPublicUrl(path);
    audioUrl = pub.publicUrl;
  }

  if (!audioUrl) {
    return NextResponse.json({ error: 'Please upload an audio file.' }, { status: 400 });
  }

  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name?.split('.').pop()?.toLowerCase() || 'jpg';
    const cPath = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const cBuf = Buffer.from(await coverFile.arrayBuffer());
    const { error: cErr } = await admin.storage
      .from('music-library')
      .upload(cPath, cBuf, { contentType: coverFile.type || 'image/jpeg', upsert: false });
    if (!cErr) {
      const { data: pub } = admin.storage.from('music-library').getPublicUrl(cPath);
      coverUrl = pub.publicUrl;
    }
  }

  const { data: track, error: insErr } = await admin
    .from('music_tracks')
    .insert({
      title,
      artist,
      movie_or_album: movieOrAlbum,
      category,
      duration_seconds: durationSeconds,
      audio_url: audioUrl,
      cover_url: coverUrl,
      license_type: licenseType,
      license_confirmed: licenseConfirmed,
      is_published: isPublished,
      is_featured: isFeatured,
    })
    .select('*')
    .single();

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, track });
}

export async function PATCH(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = getAdminSupabase();
  if (!admin) return NextResponse.json({ error: 'Service role not configured' }, { status: 500 });

  const body = await req.json().catch(() => null);
  const parsed = PatchTrackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid track update' }, { status: 400 });
  }

  const { id, ...updates } = parsed.data;

  // Enforce license confirmation before publishing
  if (updates.is_published === true) {
    const { data: existing } = await admin
      .from('music_tracks')
      .select('license_confirmed')
      .eq('id', id)
      .single();

    const confirmed =
      updates.license_confirmed !== undefined
        ? updates.license_confirmed
        : existing?.license_confirmed;

    if (!confirmed) {
      return NextResponse.json(
        { error: 'Confirm commercial rights before publishing this track.' },
        { status: 400 }
      );
    }
  }

  const { data: track, error: upErr } = await admin
    .from('music_tracks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, track });
}

export async function DELETE(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = getAdminSupabase();
  if (!admin) return NextResponse.json({ error: 'Service role not configured' }, { status: 500 });

  const { id } = await req.json().catch(() => ({}));
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Track id required' }, { status: 400 });
  }

  const { error } = await admin.from('music_tracks').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
