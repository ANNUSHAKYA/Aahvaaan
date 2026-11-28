import '../src/index.css';
import Providers from './providers';

export const metadata = {
  metadataBase: new URL('https://aahvaaan.vercel.app'),
  title: {
    default: 'Aahvaaan by Vow & Vision – Luxury Digital Wedding Invitations',
    template: '%s | Aahvaaan',
  },
  description:
    'Bespoke interactive digital wedding invitations crafted for Indian royalty. Named guest envelope reveals, RSVP inbox, Google Maps directions, and background wedding music.',
  keywords: [
    'digital wedding invitation',
    'indian wedding invitation website',
    'royal wedding invites',
    'whatsapp wedding invitation link',
    'aahvaaan wedding invitations',
    'interactive wedding invite',
    'rsvp tracker',
  ],
  authors: [{ name: 'Aahvaaan by Vow & Vision' }],
  creator: 'Vow & Vision',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aahvaaan.vercel.app/',
    siteName: 'Aahvaaan by Vow & Vision',
    title: 'Aahvaaan by Vow & Vision – Luxury Digital Wedding Invitations',
    description:
      'Bespoke interactive digital wedding invitations crafted for Indian royalty. Named guest envelope reveals, RSVP inbox, Google Maps directions, and background wedding music.',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Aahvaaan by Vow & Vision – Luxury Digital Wedding Invitations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aahvaaan by Vow & Vision – Luxury Digital Wedding Invitations',
    description:
      'Bespoke interactive digital wedding invitations crafted for Indian royalty. Named guest envelope reveals, RSVP inbox, and Google Maps navigation.',
    images: ['/og-preview.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400;1,9..40,500&family=Petit+Formal+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-ivory text-charcoal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
