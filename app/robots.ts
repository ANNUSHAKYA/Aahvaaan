import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aahvaaan.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/dashboard/', '/login', '/signup', '/api/', '/admin', '/admin/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
