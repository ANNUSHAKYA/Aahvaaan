import Terms from '../../src/views/Terms';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Terms of Service | Aahvaaan by Vow & Vision',
  description:
    'Terms of service, platform rules, and acceptable use guidelines for Aahvaaan digital wedding invitations.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <RootLayoutShell>
      <Terms />
    </RootLayoutShell>
  );
}
