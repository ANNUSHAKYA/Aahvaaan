import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Aahvaaan Wedding Invitation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const slug = params?.slug || 'sample';
  const coupleName =
    slug === 'sample'
      ? 'Ananya & Kabir'
      : slug
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
          backgroundColor: '#1E050D',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #512D38 0%, #1E050D 100%)',
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
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
        >
          ॥ श्री गणेशाय नमः ॥
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '18px',
            letterSpacing: '0.25em',
            color: '#E9D8CC',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}
        >
          Wedding Invitation
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginBottom: '16px',
          }}
        >
          {coupleName}
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
            fontSize: '24px',
            color: '#E9D8CC',
            marginBottom: '28px',
          }}
        >
          Cordially invite you to celebrate their holy union
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
