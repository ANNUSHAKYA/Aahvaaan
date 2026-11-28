import Invitations from '../../src/views/Invitations';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Wedding Invitation Designs & Themes | Aahvaaan',
  description:
    'Explore luxury digital wedding invitation templates for Indian weddings. Featuring Mor Pankh with 3D arch gates, tap-to-light diya reveal, music, maps and RSVP inbox.',
  alternates: {
    canonical: '/templates',
  },
};

export default function TemplatesPage() {
  return (
    <RootLayoutShell>
      <Invitations />
    </RootLayoutShell>
  );
}
