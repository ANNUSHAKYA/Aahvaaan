import { useEffect } from 'react';

const SITE_ORIGIN = 'https://aahvaaan.vercel.app';

/**
 * Lightweight SEO & Meta tags manager for SPA
 */
export default function SEO({
  title = 'Aahvaaan | Luxury Digital Wedding Invitations by Vow & Vision',
  description = 'Bespoke digital wedding invitations crafted with authentic Indian heritage, live RSVP tracking, Google Maps directions, and personalized guest links.',
  image = '/og-preview.png',
  url,
  type = 'website',
  canonical,
}) {
  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // 2. Resolve absolute URLs
    const currentPath = window.location.pathname + window.location.search;
    const finalUrl = url || `${SITE_ORIGIN}${currentPath}`;
    const finalCanonical = canonical || finalUrl.split('?')[0];
    const finalImage = image.startsWith('http') ? image : `${SITE_ORIGIN}${image}`;

    // 3. Helper to set or create meta tags
    const setMetaTag = (attributeName, attributeValue, content) => {
      let element = document.querySelector(`meta[${attributeName}='${attributeValue}']`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta description
    setMetaTag('name', 'description', description);

    // Canonical link tag
    let canonicalLink = document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);

    // Open Graph
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'Aahvaaan by Vow & Vision');
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', finalUrl);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:image:secure_url', finalImage);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');

    // Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', finalImage);
    setMetaTag('name', 'twitter:url', finalUrl);
  }, [title, description, image, url, type, canonical]);

  return null;
}
