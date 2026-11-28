import Refund from '../../src/views/Refund';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Refund Policy | Aahvaaan by Vow & Vision',
  description:
    'Refund, revision, and draft review terms for Aahvaaan digital wedding invitations.',
  alternates: {
    canonical: '/refund',
  },
};

export default function RefundPage() {
  return (
    <RootLayoutShell>
      <Refund />
    </RootLayoutShell>
  );
}
