/**
 * Central Site Configuration for Aahvaaan by Vow & Vision
 *
 * WhatsApp and Email can be overridden via environment variables
 * (VITE_WHATSAPP_NUMBER and VITE_CONTACT_EMAIL) or configured here.
 */

export interface SiteConfig {
  brandName: string;
  websiteName: string;
  tagline: string;
  domain: string;
  whatsappNumber: string;
  email: string;
  instagram: string;
  instagramHandle: string;
  location: string;
  currency: string;
}

/**
 * Validates a WhatsApp phone number.
 * Must be 10 to 15 digits including country code, with no leading '+', spaces, or dashes.
 * Example for India: 919876543210 (91 country code + 10 digits)
 */
export function isValidWhatsAppNumber(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[^0-9]/g, '');
  return clean.length >= 10 && clean.length <= 15;
}

/**
 * Validates an email address.
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Generates a clean WhatsApp chat link with an optional pre-filled message.
 */
export function getWhatsAppUrl(message?: string, customPhone?: string): string {
  const target = customPhone || siteConfig.whatsappNumber;
  const clean = target.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${clean}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const siteConfig: SiteConfig = {
  brandName: 'Aahvaaan by Vow & Vision',
  websiteName: 'Aahvaaan',
  tagline: 'Every celebration deserves a beautiful beginning.',
  domain: 'https://aahvaaan.vercel.app',

  // Configured contact points (replace with real business credentials)
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '919876543210',
  email: (import.meta.env.VITE_CONTACT_EMAIL as string) || 'hello@aahvaaan.com',

  instagram: 'https://instagram.com/aahvaaan.invites',
  instagramHandle: '@aahvaaan.invites',
  location: 'Jaipur & Mumbai, India',
  currency: '₹',
};

export default siteConfig;
