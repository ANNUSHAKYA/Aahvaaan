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

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://aahvaaan.vercel.app';

export const metadata = {
  metadataBase: new URL(siteOrigin),
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
    'online wedding invitation card',
    'shubh vivah digital card',
  ],
  authors: [{ name: 'Aahvaaan by Vow & Vision' }],
  creator: 'Vow & Vision',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
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
    url: siteOrigin,
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
    url: siteOrigin,
    logo: `${siteOrigin}/apple-touch-icon.png`,
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
    url: siteOrigin,
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-wine focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
