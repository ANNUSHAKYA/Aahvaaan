'use client';

import ProtectedRoute from '../../../../../src/components/ProtectedRoute';
import InvitationEditor from '../../../../../src/views/InvitationEditor';

export default function EditInvitationPage() {
  return (
    <ProtectedRoute>
      <InvitationEditor />
    </ProtectedRoute>
  );
}
