/**
 * Central Configuration & Plan Rules for Aahvaaan by Vow & Vision
 *
 * Rules:
 * - All plan limits and parameters are maintained here.
 * - Components must import from here rather than hard-coding numbers.
 */

export interface PlanRules {
  namedLinksIncluded: number;
  liveUpdatesIncluded: number;
  updateWindowMonths: number;
}

export interface FeatureFlags {
  rsvpInboxLive: boolean; // false = "Coming soon"
}

export interface SiteConfig extends PlanRules {
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
  features: FeatureFlags;
}

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
  // Plan Rules (Exact Specification)
  namedLinksIncluded: 10,
  liveUpdatesIncluded: 5,
  updateWindowMonths: 9,

  // Feature Flags
  features: {
    rsvpInboxLive: false, // Labelled "Coming soon"
  },

  // Brand & Site metadata
  brandName: 'Aahvaaan by Vow & Vision',
  websiteName: 'Aahvaaan',
  tagline: 'Interactive wedding invitations, shared in one link.',
  domain: 'https://aahvaaan.vercel.app',

  // Contact points
  whatsappNumber: getEnv('VITE_WHATSAPP_NUMBER', 'NEXT_PUBLIC_WHATSAPP_NUMBER') || '919876543210',
  email: getEnv('VITE_CONTACT_EMAIL', 'NEXT_PUBLIC_CONTACT_EMAIL') || 'hello@aahvaaan.com',

  instagram: 'https://instagram.com/aahvaaan.invites',
  instagramHandle: '@aahvaaan.invites',
  location: 'Jaipur & Delhi NCR, India',
  currency: '₹',

  // Payment configuration
  upiId: getEnv('VITE_UPI_ID', 'NEXT_PUBLIC_UPI_ID') || 'annushakya94526@ybl',
  payeeName: getEnv('VITE_PAYEE_NAME', 'NEXT_PUBLIC_PAYEE_NAME') || 'ANNU SHAKYA DO RAJVEER SINGH',
  phonePeQrImage: '/payment/phonepe-qr.jpg',
  walletBalance: 0,
};

export function isValidWhatsAppNumber(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[^0-9]/g, '');
  return clean.length >= 10 && clean.length <= 15;
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getWhatsAppUrl(message?: string, customPhone?: string): string {
  const target = customPhone || siteConfig.whatsappNumber;
  const clean = target.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${clean}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export default siteConfig;
