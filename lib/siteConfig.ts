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

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  tagline: string;
  description: string;
  popular?: boolean;
  badge?: string;
  ctaText: string;
  features: string[];
}

export interface PricingPlans {
  starter: PricingPlan;
  signature: PricingPlan;
  luxury: PricingPlan;
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
  pricing: PricingPlans;
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

  // Pricing Plans (Easy to Edit from siteConfig)
  pricing: {
    starter: {
      id: 'starter',
      name: 'Starter',
      price: 999,
      priceDisplay: '₹999',
      tagline: 'Essential digital wedding invitation for WhatsApp.',
      description: 'Ideal for intimate weddings or quick announcements.',
      popular: false,
      ctaText: 'Choose Starter',
      features: [
        '1 open link for all guests',
        '1 named link sample',
        'Google Maps venue navigation',
        'Add to Calendar event link',
        'Mobile-friendly responsive page',
        '1 live update within 3 months',
      ],
    },
    signature: {
      id: 'signature',
      name: 'Signature',
      price: 1749,
      priceDisplay: '₹1,749',
      tagline: 'Our premier package with diya reveal and personal family envelopes.',
      description: 'Everything you need for an unforgettable Indian wedding invitation.',
      popular: true,
      badge: 'Most Popular',
      ctaText: 'Choose Signature',
      features: [
        '1 open link for family groups',
        '10 named links with personalized envelopes',
        'Tap-to-light diya reveal & wedding shehnai',
        '5 live updates for 9 months after publish',
        'Google Maps navigation & calendar files',
        'Ceremony schedule & event details',
        'RSVP replies (dashboard coming soon)',
      ],
    },
    luxury: {
      id: 'luxury',
      name: 'Luxury',
      price: 2999,
      priceDisplay: '₹2,999',
      tagline: 'The complete royal experience with dedicated design assistance.',
      description: 'For grand celebrations needing bespoke touches and extra named links.',
      popular: false,
      ctaText: 'Choose Luxury',
      features: [
        '1 open link for all guests',
        '25 named links for your closest families',
        'All Signature interactive features & custom audio',
        'Unlimited live updates for 9 months',
        'Priority 1-on-1 WhatsApp setup support',
        'Turnaround within 24 hours',
        'Custom palette and typography guidance',
      ],
    },
  },

  // Brand & Site metadata
  brandName: 'Aahvaaan by Vow & Vision',
  websiteName: 'Aahvaaan',
  tagline: 'Interactive wedding invitations, shared in one link.',
  domain: 'https://aahvaaan.vercel.app',

  // Contact points
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.VITE_WHATSAPP_NUMBER ||
    '918796715590',
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    process.env.VITE_CONTACT_EMAIL ||
    'hello@aahvaaan.com',

  instagram: 'https://instagram.com/aahvaaan.invites',
  instagramHandle: '@aahvaaan.invites',
  location: 'Jaipur & Delhi NCR, India',
  currency: '₹',

  // Payment configuration
  upiId:
    process.env.NEXT_PUBLIC_UPI_ID ||
    process.env.VITE_UPI_ID ||
    'annushakya94526@ybl',
  payeeName:
    process.env.NEXT_PUBLIC_PAYEE_NAME ||
    process.env.VITE_PAYEE_NAME ||
    'ANNU SHAKYA DO RAJVEER SINGH',
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
