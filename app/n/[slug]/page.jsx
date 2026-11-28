import { notFound } from 'next/navigation';
import NamedInvitationClient from './client';

const VALID_SLUGS = ['sharma-family-sample', 'sharma-family', 'sample', 'guest'];

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!VALID_SLUGS.includes(slug)) {
    return {
      title: 'Invitation Not Found | Aahvaaan',
    };
  }

  const guestName =
    slug === 'sharma-family-sample' || slug === 'sharma-family'
      ? 'Sharma Family'
      : slug
          .replace(/-sample$/, '')
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aahvaaan.vercel.app';
  const title = `A Personal Wedding Invitation for ${guestName} | Aahvaaan`;
  const description =
    `${guestName}, you are warmly invited to grace our family celebration. Open your personal envelope for ceremony details, venue maps, and wedding music.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/n/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/n/${slug}`,
      siteName: 'Aahvaaan by Vow & Vision',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function NamedInviteSlugPage({ params }) {
  const slug = params?.slug;
  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }
  return <NamedInvitationClient />;
}
