import ProtectedRoute from '../../src/components/ProtectedRoute';
import Dashboard from '../../src/views/Dashboard';

export const metadata = {
  title: 'Your Invitations Dashboard | Aahvaaan',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
