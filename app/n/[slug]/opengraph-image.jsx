import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Personal Wedding Envelope Invitation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://nvoynqxwkbtzdlgbjvfl.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b3lucXh3a2J0emRsZ2JqdmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0MzAzMzIsImV4cCI6MjExMTAwNjMzMn0.Y0zB8XKG8fC2_Pb1pdTNXi9-sbOxfcjVuZrmbw6T6VM';

async function loadGuestInviteForOg(guestSlug) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_public_guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_guest_slug: guestSlug }),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

export default async function Image({ params }) {
  const slug = params?.slug || 'guest';
  const data = await loadGuestInviteForOg(slug);

  const guestName =
    data?.guest?.display_name ||
    slug
      .replace(/-sample$/, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const bride = data?.couple_names?.bride || 'Ananya';
  const groom = data?.couple_names?.groom || 'Kabir';
  const coupleName = `${bride} & ${groom}`;

  let dateDisplay = '27 February 2027';
  if (data?.wedding_date) {
    const d = new Date(data.wedding_date);
    if (!Number.isNaN(d.getTime())) {
      dateDisplay = d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0E4D4F',
          backgroundImage: 'radial-gradient(circle at 50% 45%, #24655D 0%, #082D2E 100%)',
          border: '14px solid #B69A70',
          padding: '44px',
          fontFamily: 'serif',
          color: '#FAF7F2',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '20px',
            letterSpacing: '0.24em',
            color: '#E3D3AE',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          Warmly Addressed To
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#FAF7F2',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {guestName}
        </div>
        <div
          style={{
            width: '96px',
            height: '3px',
            backgroundColor: '#B69A70',
            marginBottom: '20px',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: '30px',
            color: '#FAF7F2',
            marginBottom: '10px',
          }}
        >
          {coupleName}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            color: '#E3D3AE',
            marginBottom: '24px',
          }}
        >
          {dateDisplay}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '16px',
            letterSpacing: '0.22em',
            color: '#B69A70',
            textTransform: 'uppercase',
          }}
        >
          Aahvaaan · Mor Pankh
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
