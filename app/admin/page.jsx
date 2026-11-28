'use client';

import ProtectedRoute from '../../src/components/ProtectedRoute';
import Admin from '../../src/views/Admin';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  );
}
