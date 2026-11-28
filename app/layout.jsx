import '../src/index.css';
import Providers from './providers';
import { Cormorant_Garamond, DM_Sans, Petit_Formal_Script } from 'next/font/google';
import siteConfig from '../lib/siteConfig';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const petit = Petit_Formal_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-petit',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://aahvaaan.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Aahvaaan by Vow & Vision – Luxury Digital Wedding Invitations',
    template: '%s | Aahvaaan',
  },
  description:
    'Interactive Indian wedding invitations with a diya reveal, named guest links, maps and music, shared in one WhatsApp-ready link.',
  keywords: [
    'digital wedding invitation',
    'indian wedding invitation website',
    'royal wedding invites',
    'whatsapp wedding invitation link',
    'aahvaaan wedding invitations',
    'interactive wedding invite',
    'diya reveal wedding invite',
    'personalized wedding cards',
  ],
  authors: [{ name: 'Aahvaaan by Vow & Vision' }],
  creator: 'Vow & Vision',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aahvaaan.com/',
    siteName: 'Aahvaaan by Vow & Vision',
    title: 'Aahvaaan by Vow & Vision – Luxury Digital Wedding Invitations',
    description:
      'Interactive Indian wedding invitations with a diya reveal, named guest links, maps and music, shared in one WhatsApp-ready link.',
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
      'Interactive Indian wedding invitations with a diya reveal, named guest links, maps and music, shared in one WhatsApp-ready link.',
    images: ['/og-preview.png'],
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aahvaaan by Vow & Vision',
    url: 'https://aahvaaan.com',
    logo: 'https://aahvaaan.com/apple-touch-icon.png',
    description:
      'Luxury interactive wedding invitations crafted for Indian weddings with diya reveals, personal guest links, maps and music, shared via WhatsApp.',
    sameAs: [siteConfig.instagram],
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.email,
      contactType: 'customer service',
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Aahvaaan',
    alternateName: 'Aahvaaan by Vow & Vision',
    url: 'https://aahvaaan.com',
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${petit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="font-body bg-ivory text-charcoal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
