/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/invitations',
        destination: '/templates',
        permanent: true,
      },
      {
        source: '/invitations/:id',
        destination: '/templates/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
