import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Aahvaaan by Vow & Vision – Luxury Digital Wedding Invitations';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          backgroundImage: 'radial-gradient(circle at 50% 45%, #512D38 0%, #1E050D 100%)',
          border: '14px solid #B69A70',
          padding: '48px',
          fontFamily: 'serif',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '20px',
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
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '18px',
            textShadow: '0 4px 20px rgba(0,0,0,0.6)',
          }}
        >
          Aahvaaan
        </div>
        <div
          style={{
            display: 'flex',
            width: '120px',
            height: '2px',
            backgroundColor: '#B69A70',
            marginBottom: '20px',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: '24px',
            color: '#FAF7F2',
            maxWidth: '850px',
            lineHeight: 1.4,
            opacity: 0.95,
          }}
        >
          Living Indian Wedding Invitations · Diya Reveal, Music, Maps & WhatsApp Sharing
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '36px',
            padding: '10px 28px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(182, 154, 112, 0.2)',
            border: '1px solid #B69A70',
            fontSize: '16px',
            letterSpacing: '0.2em',
            color: '#E3D3AE',
            textTransform: 'uppercase',
          }}
        >
          By Vow &amp; Vision
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
