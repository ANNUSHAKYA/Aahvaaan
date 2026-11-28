import PublicInvitationPersonalClient from './client';

export async function generateMetadata({ params }) {
  const guestSlug = params?.guestSlug;
  const baseUrl = 'https://aahvaaan.vercel.app';

  // Fallback defaults
  let title = 'Personal Wedding Invitation | Aahvaaan';
  let description = 'You are cordially invited to grace our family wedding celebrations.';
  let ogImage = `${baseUrl}/og-preview.png`;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && guestSlug) {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_invitation_by_personal_slug`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ p_personal_slug: guestSlug }),
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const data = await res.json();
        const guestName = data?.guest?.name || 'Respected Guest';
        if (data?.content) {
          const bride = data.content.brideName || data.content.bride || 'Bride';
          const groom = data.content.groomName || data.content.groom || 'Groom';
          title = `${guestName} – You are cordially invited to ${bride} & ${groom}'s Wedding`;
          description = `With joyous hearts, we warmly invite you to grace the auspicious celebrations of ${bride} & ${groom}. Click to open your personalized invitation.`;
          if (data.content.couplePhoto) {
            ogImage = data.content.couplePhoto.startsWith('http')
              ? data.content.couplePhoto
              : `${baseUrl}${data.content.couplePhoto}`;
          }
        }
      }
    }
  } catch (err) {
    console.error('generateMetadata error for guestSlug:', err);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/invite/r/${guestSlug}`,
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

export default function InvitePersonalSlugPage() {
  return <PublicInvitationPersonalClient />;
}
