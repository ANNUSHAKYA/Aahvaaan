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
  upiId: string;
  payeeName: string;
  phonePeQrImage: string;
  walletBalance: number;
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

// Helper to support both Vite (import.meta.env) and Next.js (process.env)
const getEnv = (key: string, nextKey?: string): string => {
  if (typeof process !== 'undefined' && process.env) {
    if (nextKey && process.env[nextKey]) return process.env[nextKey] as string;
    if (process.env[key]) return process.env[key] as string;
  }
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      if ((import.meta as any).env[key]) return (import.meta as any).env[key];
    }
  } catch {}
  return '';
};

export const siteConfig: SiteConfig = {
  brandName: 'Aahvaaan by Vow & Vision',
  websiteName: 'Aahvaaan',
  tagline: 'Every celebration deserves a beautiful beginning.',
  domain: 'https://aahvaaan.vercel.app',

  // Configured contact points
  whatsappNumber: getEnv('VITE_WHATSAPP_NUMBER', 'NEXT_PUBLIC_WHATSAPP_NUMBER') || '919876543210',
  email: getEnv('VITE_CONTACT_EMAIL', 'NEXT_PUBLIC_CONTACT_EMAIL') || 'hello@aahvaaan.com',

  instagram: 'https://instagram.com/aahvaaan.invites',
  instagramHandle: '@aahvaaan.invites',
  location: 'Jaipur & Mumbai, India',
  currency: '₹',

  // Payment & UPI Configuration
  upiId: getEnv('VITE_UPI_ID', 'NEXT_PUBLIC_UPI_ID') || 'annushakya94526@ybl',
  payeeName: getEnv('VITE_PAYEE_NAME', 'NEXT_PUBLIC_PAYEE_NAME') || 'ANNU SHAKYA DO RAJVEER SINGH',
  phonePeQrImage: '/payment/phonepe-qr.jpg',
  walletBalance: 0,
};

export default siteConfig;
