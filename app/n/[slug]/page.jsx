import NamedInvitationClient from './client';

export async function generateMetadata({ params }) {
  const slug = params?.slug || 'guest';
  const baseUrl = 'https://aahvaaan.com';

  const guestName = slug
    .replace(/-sample$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
      url: `${baseUrl}/n/${slug}`,
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

export default function NamedInviteSlugPage() {
  return <NamedInvitationClient />;
}
