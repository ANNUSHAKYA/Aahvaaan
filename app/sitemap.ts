import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aahvaaan.com';
  const routes = [
    '',
    '/templates',
    '/templates/mor-pankh',
    '/how-it-works',
    '/pricing',
    '/contact',
    '/about',
    '/terms',
    '/privacy',
    '/refund',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/templates') ? 0.9 : 0.7,
  }));
}
