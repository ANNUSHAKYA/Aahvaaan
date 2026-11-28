import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import RsvpsDashboardView from '@/src/views/RsvpsDashboardView';
import siteConfig from '@/lib/siteConfig';

export const metadata = {
  title: 'RSVP Inbox | Aahvaaan',
  robots: { index: false, follow: false },
};

export default async function InvitationRsvpsPage({ params }) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?from=/dashboard');
  }

  const { id } = params;

  const { data: inv, error: invErr } = await supabase
    .from('invitations')
    .select('id, slug, status, couple_names, wedding_date, rsvp_digest_enabled')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (invErr || !inv) {
    notFound();
  }

  const [{ data: guests }, { data: rsvps }] = await Promise.all([
    supabase
      .from('guests')
      .select('id, display_name, slug, max_party_size, created_at')
      .eq('invitation_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('rsvps')
      .select('id, guest_id, name, attending, party_size, events_attending, meal_preference, message, created_at, updated_at')
      .eq('invitation_id', id)
      .order('created_at', { ascending: false }),
  ]);

  return (
    <RsvpsDashboardView
      invitation={inv}
      initialGuests={guests || []}
      initialRsvps={rsvps || []}
      domain={siteConfig.domain}
    />
  );
}
