'use client';

import ProtectedRoute from '../../src/components/ProtectedRoute';
import Dashboard from '../../src/views/Dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
