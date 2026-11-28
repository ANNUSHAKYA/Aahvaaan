import Home from '../src/views/Home';
import RootLayoutShell from './shell';

export const metadata = {
  title: 'Aahvaaan by Vow & Vision – Luxury Digital Wedding Invitations',
  description:
    'Interactive Indian wedding invitations with a diya reveal, named guest links, maps and music, shared in one WhatsApp-ready link.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <RootLayoutShell>
      <Home />
    </RootLayoutShell>
  );
}
