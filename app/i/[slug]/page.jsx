import { notFound } from 'next/navigation';
import OpenInvitationClient from './client';

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (slug !== 'sample' && slug !== 'ananya-kabir') {
    return {
      title: 'Invitation Not Found | Aahvaaan',
    };
  }

  const coupleName = 'Ananya & Kabir';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aahvaaan.vercel.app';
  const title = `${coupleName} are getting married`;
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

export default function OpenInviteSlugPage({ params }) {
  const slug = params?.slug;
  if (slug !== 'sample' && slug !== 'ananya-kabir') {
    notFound();
  }
  return <OpenInvitationClient />;
}
