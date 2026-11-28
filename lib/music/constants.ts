export const MUSIC_CATEGORIES = [
  'Romantic Bollywood',
  'Bridal Entry',
  'Groom Entry',
  'Wedding Classics',
  'Haldi & Mehendi',
  'Emotional & Soulful',
  'Bollywood Instrumentals',
  'Traditional Indian Music',
] as const;

export type MusicCategory = (typeof MUSIC_CATEGORIES)[number];

export interface MusicTrack {
  id: string;
  title: string;
  artist: string | null;
  movie_or_album: string | null;
  category: string;
  duration_seconds: number;
  audio_url: string;
  cover_url: string | null;
  license_type: 'original' | 'licensed' | 'royalty_free';
  license_confirmed: boolean;
  is_published: boolean;
  is_featured: boolean;
}

export const STARTER_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'shehnai-royal',
    title: 'Royal Shehnai & Sitar',
    artist: 'Aahvaaan Ensemble',
    movie_or_album: 'Traditional Heritage',
    category: 'Traditional Indian Music',
    duration_seconds: 120,
    audio_url: '/templates/mor-pankh/media/music.mp3',
    cover_url: null,
    license_type: 'royalty_free',
    license_confirmed: true,
    is_published: true,
    is_featured: true,
  },
  {
    id: 'flute-raag',
    title: 'Auspicious Flute Raag',
    artist: 'Aahvaaan Ensemble',
    movie_or_album: 'Classical Instrumentals',
    category: 'Bollywood Instrumentals',
    duration_seconds: 135,
    audio_url: '/templates/mor-pankh/media/music.mp3',
    cover_url: null,
    license_type: 'royalty_free',
    license_confirmed: true,
    is_published: true,
    is_featured: true,
  },
  {
    id: 'sitar-symphony',
    title: 'Palace Courtyard Melody',
    artist: 'Aahvaaan Ensemble',
    movie_or_album: 'Wedding Melodies',
    category: 'Wedding Classics',
    duration_seconds: 110,
    audio_url: '/templates/mor-pankh/media/music.mp3',
    cover_url: null,
    license_type: 'royalty_free',
    license_confirmed: true,
    is_published: true,
    is_featured: false,
  },
];

export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/m4a',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/aac',
];

export const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function formatDuration(seconds: number | null | undefined): string {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
