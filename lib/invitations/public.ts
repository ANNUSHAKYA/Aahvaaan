import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export interface PublicEvent {
  id?: string;
  name: string;
  date?: string;
  fullDate?: string;
  time?: string;
  venue?: string;
  maps_url?: string;
  mapUrl?: string;
  note?: string;
  attire?: string;
  icon?: string;
}

export interface PublicGuest {
  id: string;
  display_name: string;
  slug: string;
  max_party_size: number;
}

export interface PublicInvitation {
  id: string;
  slug: string;
  status: 'published' | 'archived';
  bride_name: string;
  groom_name: string;
  wedding_date: string | null;
  events: PublicEvent[];
  venue_name: string;
  venue_address: string;
  maps_url: string;
  photos: string[];
  music_choice: string;
  family_note: string;
  published_at: string | null;
  guest: PublicGuest | null;
  template_slug: string;
  is_sample?: boolean;
}

const SAMPLE_EVENTS: PublicEvent[] = [
  {
    name: 'Haldi',
    date: '2027-02-26',
    fullDate: 'Friday, 26 Feb 2027',
    time: '10:00',
    venue: 'The Marigold Courtyard, The Leela Palace, Jaipur',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur',
    note: 'A little sunshine, fragrant turmeric, and flower showers',
    attire: 'Sunshine yellows & marigold florals',
    icon: '✨',
  },
  {
    name: 'Mehendi',
    date: '2027-02-26',
    fullDate: 'Friday, 26 Feb 2027',
    time: '16:00',
    venue: 'The Garden Pavilion, The Leela Palace, Jaipur',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur',
    note: 'Love written in fragrant Rajasthani henna and folk tunes',
    attire: 'Garden greens & playful florals',
    icon: '🌿',
  },
  {
    name: 'Sangeet & Jaago',
    date: '2027-02-26',
    fullDate: 'Friday, 26 Feb 2027',
    time: '19:00',
    venue: 'The Peacock Ballroom, The Leela Palace, Jaipur',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur',
    note: 'An energetic evening of family dance battles & live dhol',
    attire: 'Jewel tones, sequins & dancing shoes',
    icon: '🎶',
  },
  {
    name: 'Pheras & Vivaah',
    date: '2027-02-27',
    fullDate: 'Saturday, 27 Feb 2027',
    time: '16:30',
    venue: 'The Royal Courtyard, The Leela Palace, Jaipur',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur',
    note: 'Seven sacred promises under Vedic chants at golden hour',
    attire: 'Royal Indian heritage silks & sherwanis',
    icon: '🔥',
  },
  {
    name: 'Reception',
    date: '2027-02-27',
    fullDate: 'Saturday, 27 Feb 2027',
    time: '19:30',
    venue: 'The Grand Palace Lawns, The Leela Palace, Jaipur',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur',
    note: 'To new beginnings and celebratory royal banquet toasts',
    attire: 'Black tie, tuxedo & evening glamour',
    icon: '🥂',
  },
];

function buildSampleInvitation(slug: string, guestName?: string | null): PublicInvitation {
  return {
    id: 'sample-mor-pankh',
    slug,
    status: 'published',
    bride_name: 'Ananya',
    groom_name: 'Kabir',
    wedding_date: '2027-02-27',
    events: SAMPLE_EVENTS,
    venue_name: 'The Leela Palace, Jaipur',
    venue_address: 'Delhi Highway, NH 11, Kukas, Jaipur, Rajasthan 302028',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur',
    photos: [],
    music_choice: 'shehnai-royal',
    family_note:
      'With the blessings of our families, we joyfully invite you to celebrate our union.',
    published_at: null,
    guest: guestName
      ? {
          id: 'sample-guest',
          display_name: guestName,
          slug,
          max_party_size: 4,
        }
      : null,
    template_slug: 'mor-pankh',
    is_sample: true,
  };
}

async function signPrivatePhotos(photos: unknown): Promise<string[]> {
  if (!Array.isArray(photos)) return [];
  const rawList = photos.filter((p): p is string => typeof p === 'string' && p.trim().length > 0);
  if (rawList.length === 0) return [];

  const needsSigning = rawList.some((p) => !p.startsWith('http://') && !p.startsWith('https://') && !p.startsWith('/'));
  if (!needsSigning) return rawList;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return rawList.filter((p) => p.startsWith('http://') || p.startsWith('https://') || p.startsWith('/'));
  }

  const admin = createSupabaseAdmin(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const signed = await Promise.all(
    rawList.map(async (item) => {
      if (item.startsWith('http://') || item.startsWith('https://') || item.startsWith('/')) {
        return item;
      }
      const { data } = await admin.storage
        .from('invitation-photos')
        .createSignedUrl(item, 60 * 60); // 1 hour signed URL
      return data?.signedUrl || null;
    })
  );

  return signed.filter((u): u is string => Boolean(u));
}

function normalizeRpcPayload(raw: Record<string, any>): Omit<PublicInvitation, 'photos'> & { rawPhotos: unknown } {
  const couple = (raw.couple_names && typeof raw.couple_names === 'object') ? raw.couple_names : {};
  const bride = (typeof couple.bride === 'string' && couple.bride.trim()) ? couple.bride.trim() : 'Bride';
  const groom = (typeof couple.groom === 'string' && couple.groom.trim()) ? couple.groom.trim() : 'Groom';
  const events: PublicEvent[] = Array.isArray(raw.events) ? raw.events : [];
  const firstEventVenue = events[0]?.venue || '';

  return {
    id: String(raw.id),
    slug: String(raw.slug),
    status: raw.status === 'archived' ? 'archived' : 'published',
    bride_name: bride,
    groom_name: groom,
    wedding_date: raw.wedding_date ? String(raw.wedding_date) : null,
    events,
    venue_name: raw.venue_name || firstEventVenue || 'Wedding Venue',
    venue_address: raw.venue_address || firstEventVenue || '',
    maps_url: raw.maps_url || events[0]?.maps_url || '',
    rawPhotos: raw.photos,
    music_choice: raw.music_choice || 'shehnai-royal',
    family_note: raw.family_note || '',
    published_at: raw.published_at || null,
    guest: raw.guest || null,
    template_slug: raw.template?.slug || 'mor-pankh',
  };
}

export async function fetchPublicInvitation(slug: string): Promise<PublicInvitation | null> {
  if (!slug) return null;

  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_public_invitation', {
    p_slug: slug,
  });

  if (!error && data && typeof data === 'object') {
    const normalized = normalizeRpcPayload(data as Record<string, any>);
    const photos = await signPrivatePhotos(normalized.rawPhotos);
    return { ...normalized, photos };
  }

  // Fallback for built-in sample slugs
  if (slug === 'sample' || slug === 'ananya-kabir') {
    return buildSampleInvitation(slug);
  }

  return null;
}

export async function fetchPublicGuestInvitation(guestSlug: string): Promise<PublicInvitation | null> {
  if (!guestSlug) return null;

  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_public_guest', {
    p_guest_slug: guestSlug,
  });

  if (!error && data && typeof data === 'object') {
    const normalized = normalizeRpcPayload(data as Record<string, any>);
    const photos = await signPrivatePhotos(normalized.rawPhotos);
    return { ...normalized, photos };
  }

  // Fallback for built-in sample named slugs
  if (guestSlug === 'sharma-family-sample' || guestSlug === 'sharma-family') {
    return buildSampleInvitation('sample', 'Sharma Family');
  }

  return null;
}
