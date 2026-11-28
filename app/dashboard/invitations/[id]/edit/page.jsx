import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import InvitationEditor from '@/src/components/dashboard/InvitationEditor';
import siteConfig from '@/lib/siteConfig';

export const metadata = {
  title: 'Edit Invitation | Aahvaaan',
  robots: { index: false, follow: false },
};

export default async function EditInvitationPage({ params }) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect('/login?from=/dashboard');

  const { id } = params;

  // Fetch invitation (must belong to this user)
  const { data: inv, error: invErr } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (invErr || !inv) notFound();

  // Fetch draft data
  const { data: draft } = await supabase
    .from('invitation_drafts')
    .select('data')
    .eq('invitation_id', id)
    .maybeSingle();

  // Fetch guests
  const { data: guests } = await supabase
    .from('guests')
    .select('id, slug, display_name, max_party_size, created_at')
    .eq('invitation_id', id)
    .order('created_at', { ascending: true });

  const draftData = (draft?.data) || {};

  return (
    <InvitationEditor
      invitation={inv}
      initialDraft={draftData}
      initialGuests={guests || []}
      config={{
        namedLinksIncluded: siteConfig.namedLinksIncluded,
        liveUpdatesIncluded: siteConfig.liveUpdatesIncluded,
        domain: siteConfig.domain,
        whatsappNumber: siteConfig.whatsappNumber,
        paymentsEnabled: process.env.PAYMENTS_ENABLED === 'true',
      }}
    />
  );
}
