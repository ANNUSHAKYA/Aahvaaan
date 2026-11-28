import Privacy from '../../src/views/Privacy';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Privacy Policy | Aahvaaan by Vow & Vision',
  description:
    'Our commitment to privacy. How Aahvaaan safeguards couple details, guest RSVPs, and wedding event data.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <RootLayoutShell>
      <Privacy />
    </RootLayoutShell>
  );
}
