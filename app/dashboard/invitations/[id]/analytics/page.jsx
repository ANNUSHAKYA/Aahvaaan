import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AnalyticsDashboardView from '@/src/views/AnalyticsDashboardView';
import siteConfig from '@/lib/siteConfig';

export const metadata = {
  title: 'Invitation Analytics | Aahvaaan',
  robots: { index: false, follow: false },
};

export default async function InvitationAnalyticsPage({ params }) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?from=/dashboard');
  }

  const { id } = params;

  const { data: inv, error: invErr } = await supabase
    .from('invitations')
    .select('id, slug, status, couple_names, wedding_date, venue_name')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (invErr || !inv) {
    notFound();
  }

  const { data: analytics } = await supabase.rpc('get_invitation_analytics', {
    p_invitation_id: id,
  });

  return (
    <AnalyticsDashboardView
      invitation={inv}
      analytics={
        analytics || {
          total_views: 0,
          unique_visitors: 0,
          named_opened: 0,
          named_total: 0,
          replied_count: 0,
          views_by_day: [],
          device_split: [],
          guest_activity: [],
        }
      }
      domain={siteConfig.domain}
    />
  );
}
