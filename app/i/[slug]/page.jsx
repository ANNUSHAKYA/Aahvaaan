import { notFound } from 'next/navigation';
import LiveInvitationClient from '@/src/components/invitation/LiveInvitationClient';
import { fetchPublicInvitation } from '@/lib/invitations/public';

export const revalidate = 60;

function formatCityAndDate(weddingDate, venueName, venueAddress) {
  let dateLabel = 'upcoming celebrations';
  if (weddingDate) {
    const d = new Date(weddingDate);
    if (!Number.isNaN(d.getTime())) {
      dateLabel = d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }
  const citySource = venueAddress || venueName || '';
  const cityPart = citySource ? ` in ${citySource.split(',').slice(-1)[0].trim()}` : '';
  return { dateLabel, cityPart };
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const invitation = await fetchPublicInvitation(slug);

  if (!invitation) {
    return {
      title: 'Invitation Not Found | Aahvaaan',
      robots: { index: false, follow: false },
    };
  }

  const coupleName = `${invitation.bride_name} & ${invitation.groom_name}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aahvaaan.vercel.app';
  const { dateLabel, cityPart } = formatCityAndDate(
    invitation.wedding_date,
    invitation.venue_name,
    invitation.venue_address
  );

  const title = `${coupleName} are getting married`;
  const description = `You are cordially invited to celebrate the wedding of ${coupleName} on ${dateLabel}${cityPart}. Open your interactive invitation for ceremony timings, venue directions, and music.`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/i/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/i/${slug}`,
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

export default async function OpenInviteSlugPage({ params }) {
  const invitation = await fetchPublicInvitation(params?.slug);
  if (!invitation) {
    notFound();
  }
  return <LiveInvitationClient invitation={invitation} />;
}
