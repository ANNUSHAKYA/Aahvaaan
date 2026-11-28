import PublicInvitationClient from './client';

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const baseUrl = 'https://aahvaaan.vercel.app';

  // Fallback defaults
  let title = 'Wedding Celebration Invitation | Aahvaaan';
  let description = 'Cordially invite you and your family to celebrate our holy wedding ceremonies.';
  let ogImage = `${baseUrl}/og-preview.png`;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && slug) {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_invitation_by_common_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ p_code: slug }),
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.content) {
          const bride = data.content.brideName || data.content.bride || 'Bride';
          const groom = data.content.groomName || data.content.groom || 'Groom';
          title = `${bride} & ${groom}'s Royal Wedding Invitation`;
          description = `We joyfully invite you to grace the wedding ceremonies of ${bride} & ${groom}. Click to open the auspicious interactive invitation.`;
          if (data.content.couplePhoto) {
            ogImage = data.content.couplePhoto.startsWith('http')
              ? data.content.couplePhoto
              : `${baseUrl}${data.content.couplePhoto}`;
          }
        }
      }
    }
  } catch (err) {
    console.error('generateMetadata error for slug:', err);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/invite/${slug}`,
      siteName: 'Aahvaaan by Vow & Vision',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function InviteSlugPage() {
  return <PublicInvitationClient />;
}
