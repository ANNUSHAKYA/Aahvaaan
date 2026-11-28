export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/profile/', '/buy/*/checkout'],
      },
    ],
    sitemap: 'https://aahvaaan.vercel.app/sitemap.xml',
  };
}
