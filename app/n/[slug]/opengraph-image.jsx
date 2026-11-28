import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Personal Wedding Envelope Invitation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const slug = params?.slug || 'guest';
  const guestName = slug
    .replace(/-sample$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
          backgroundColor: '#2D0B16',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #512D38 0%, #18030B 100%)',
          border: '14px solid #B69A70',
          padding: '40px',
          fontFamily: 'serif',
          color: '#FFFFFF',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            letterSpacing: '0.3em',
            color: '#C8B28F',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}
        >
          ॥ श्री गणेशाय नमः ॥
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '20px',
            letterSpacing: '0.25em',
            color: '#E9D8CC',
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
        >
          A Personal Wedding Invitation
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            color: '#B69A70',
            marginBottom: '8px',
            fontStyle: 'italic',
          }}
        >
          Warmly Addressed To
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '60px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginBottom: '20px',
          }}
        >
          {guestName}
        </div>
        <div
          style={{
            width: '80px',
            height: '3px',
            backgroundColor: '#B69A70',
            marginBottom: '24px',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            color: '#E9D8CC',
            marginBottom: '24px',
          }}
        >
          Open your royal envelope to view the ceremonies &amp; RSVP
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '18px',
            letterSpacing: '0.2em',
            color: '#B69A70',
            textTransform: 'uppercase',
          }}
        >
          Aahvaaan · By Vow &amp; Vision
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
