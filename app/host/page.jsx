'use client';

import ProtectedRoute from '../../src/components/ProtectedRoute';
import Dashboard from '../../src/views/Dashboard';

export default function HostPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
