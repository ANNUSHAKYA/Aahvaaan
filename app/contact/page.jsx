import Contact from '../../src/views/Contact';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Contact Us | Aahvaaan by Vow & Vision',
  description:
    'Get in touch with Aahvaaan. Reach out directly on WhatsApp or email for custom wedding invitation inquiries and assistance.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <RootLayoutShell>
      <Contact />
    </RootLayoutShell>
  );
}
