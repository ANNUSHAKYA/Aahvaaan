'use client';

import { useEffect, useMemo } from 'react';
import MorPankhInvitation from '@/src/components/invitation/templates/MorPankhInvitation';
import GuestRsvpForm from '@/src/components/invitation/GuestRsvpForm';
import supabase, { isSupabaseConfigured } from '@/src/lib/supabase';
import type { PublicInvitation } from '@/lib/invitations/public';

function formatWeddingDate(dateStr?: string | null): string {
  if (!dateStr) return '27 February 2027';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function detectDevice(): 'mobile' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    ? 'mobile'
    : 'desktop';
}

export default function LiveInvitationClient({
  invitation,
}: {
  invitation: PublicInvitation;
}) {
  useEffect(() => {
    if (!invitation?.slug || invitation.is_sample || !isSupabaseConfigured) return;

    const storageKey = `aahvaaan_viewed_${invitation.slug}_${invitation.guest?.slug || 'open'}`;
    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // sessionStorage may be unavailable in restricted contexts; proceed once
    }

    const device = detectDevice();
    supabase
      .rpc('track_view', {
        p_invitation_slug: invitation.slug,
        p_device: device,
        p_guest_slug: invitation.guest?.slug || null,
      })
      .then(() => {})
      .catch(() => {});
  }, [invitation.slug, invitation.guest?.slug, invitation.is_sample]);

  const content = useMemo(() => {
    const formattedDate = formatWeddingDate(invitation.wedding_date);
    return {
      id: invitation.id,
      slug: invitation.slug,
      brideName: invitation.bride_name,
      groomName: invitation.groom_name,
      weddingDate: invitation.wedding_date || '2027-02-27',
      weddingDateDisplay: formattedDate,
      familyNote: invitation.family_note || '',
      venue: invitation.venue_name,
      address: invitation.venue_address,
      maps_url: invitation.maps_url,
      mapUrl: invitation.maps_url,
      events: invitation.events?.length > 0 ? invitation.events : undefined,
      gallery: invitation.photos?.length > 0 ? invitation.photos : undefined,
      musicChoice: invitation.music_choice || undefined,
      guestName: invitation.guest?.display_name || undefined,
    };
  }, [invitation]);

  return (
    <MorPankhInvitation
      content={content}
      guestName={invitation.guest?.display_name}
      rsvpComponent={<GuestRsvpForm invitation={invitation} />}
      isPreview={Boolean(invitation.is_sample)}
    />
  );
}
