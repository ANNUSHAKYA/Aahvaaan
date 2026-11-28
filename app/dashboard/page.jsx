import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardView from '@/src/views/DashboardView';

export const metadata = {
  title: 'Your Invitations | Aahvaaan',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?from=/dashboard');
  }

  // Fetch all invitations for this user
  const { data: invitations } = await supabase
    .from('invitations')
    .select('id, slug, status, couple_names, wedding_date, live_updates_used, edit_window_ends_at, published_at, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  return <DashboardView invitations={invitations || []} user={{ id: user.id, email: user.email || '' }} />;
}
