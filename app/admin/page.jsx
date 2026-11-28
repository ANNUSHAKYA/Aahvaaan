import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAdminSupabase } from '@/lib/payments/addons';
import AdminDashboardView from '@/src/views/AdminDashboardView';

export const metadata = {
  title: 'Admin | Aahvaaan',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?from=/admin');
  }

  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId || user.id !== adminUserId) {
    notFound();
  }

  const admin = getAdminSupabase();
  if (!admin) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="font-cormorant text-2xl font-semibold text-[#0E4D4F]">Admin</h1>
        <p className="mt-2 text-sm text-red-600">
          SUPABASE_SERVICE_ROLE_KEY is not configured on the server.
        </p>
      </main>
    );
  }

  const [
    { data: users },
    { data: invitations },
    { data: orders },
    { data: auditLogs },
  ] = await Promise.all([
    admin.from('profiles').select('id, full_name, phone, created_at').order('created_at', { ascending: false }).limit(100),
    admin.from('invitations').select('id, owner_id, slug, status, couple_names, wedding_date, created_at').order('created_at', { ascending: false }).limit(100),
    admin.from('orders').select('id, owner_id, invitation_id, amount_inr, status, order_type, addon_quantity, admin_note, razorpay_order_id, razorpay_payment_id, created_at').order('created_at', { ascending: false }).limit(100),
    admin.from('admin_audit_logs').select('id, admin_user_id, order_id, action, note, created_at').order('created_at', { ascending: false }).limit(100),
  ]);

  return (
    <AdminDashboardView
      initialUsers={users || []}
      initialInvitations={invitations || []}
      initialOrders={orders || []}
      initialAuditLogs={auditLogs || []}
    />
  );
}
