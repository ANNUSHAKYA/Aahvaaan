import { useEffect } from 'react';

/**
 * Lightweight SEO & Meta tags manager for SPA
 */
export default function SEO({
  title = 'Aahvaaan | Luxury Digital Wedding Invitations by Vow & Vision',
  description = 'Bespoke digital wedding invitations crafted with authentic Indian heritage, live RSVP tracking, Google Maps directions, and personalized guest links.',
  image = '/assets/hero-bg.jpg',
  url = window.location.href,
}) {
  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // 2. Helper to set or create meta tags
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace(/[\[\]']/g, '').split('=');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    setMetaTag("meta[name='description']", 'content', description);
    setMetaTag("meta[property='og:title']", 'content', title);
    setMetaTag("meta[property='og:description']", 'content', description);
    setMetaTag("meta[property='og:image']", 'content', image.startsWith('http') ? image : `${window.location.origin}${image}`);
    setMetaTag("meta[property='og:url']", 'content', url);
    setMetaTag("meta[name='twitter:card']", 'content', 'summary_large_image');
    setMetaTag("meta[name='twitter:title']", 'content', title);
    setMetaTag("meta[name='twitter:description']", 'content', description);
  }, [title, description, image, url]);

  return null;
}
