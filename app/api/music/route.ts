import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { STARTER_MUSIC_TRACKS } from '@/lib/music/constants';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('music_tracks')
    .select('id, title, artist, movie_or_album, category, duration_seconds, audio_url, cover_url, license_type, license_confirmed, is_published, is_featured')
    .eq('is_published', true)
    .eq('license_confirmed', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    // Graceful fallback if migration has not been applied yet
    return NextResponse.json({ tracks: STARTER_MUSIC_TRACKS });
  }

  return NextResponse.json({
    tracks: data && data.length > 0 ? data : STARTER_MUSIC_TRACKS,
  });
}
