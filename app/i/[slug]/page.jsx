import OpenInvitationClient from './client';

export async function generateMetadata({ params }) {
  const slug = params?.slug || 'sample';
  const baseUrl = 'https://aahvaaan.com';

  const coupleName =
    slug === 'sample'
      ? 'Ananya & Kabir'
      : slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

  const title = `${coupleName} – Wedding Celebration Invitation | Aahvaaan`;
  const description =
    `You are cordially invited to celebrate the holy wedding ceremonies of ${coupleName}. Open the auspicious interactive invitation with diya reveal, wedding music, venue maps and schedule.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/i/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/i/${slug}`,
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

export default function OpenInviteSlugPage() {
  return <OpenInvitationClient />;
}
