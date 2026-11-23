import config from './config';

const { currency } = config;

export const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    priceDisplay: `${currency}999`,
    badge: 'Essential',
    tagline: 'A clean and elegant digital wedding invitation with essential details.',
    description: 'Perfect for couples who want a beautiful, mobile-friendly invitation with all key ceremony details and location map.',
    popular: false,
    ctaText: 'Choose Starter',
    features: [
      'Selected invitation template design',
      'Personalised couple names & story snippet',
      'Wedding date and venue details',
      'Wedding event schedule',
      'Google Maps directions link',
      'Shareable digital invitation link',
      'Mobile-friendly responsive experience',
    ],
  },
  {
    id: 'signature',
    name: 'Signature',
    price: 1499,
    priceDisplay: `${currency}1,499`,
    badge: 'Recommended',
    tagline: 'Our most popular choice with rich interactive features & animations.',
    description: 'Everything in Starter, plus our signature interactive opening, love story, photo gallery, countdown, and guest RSVP.',
    popular: true,
    ctaText: 'Choose Signature',
    features: [
      'Everything in Starter',
      'Personalised couple love story',
      'Curated wedding photo gallery (up to 8 photos)',
      'Live wedding countdown timer',
      'Interactive guest RSVP form demo',
      'Premium envelope opening animation',
      'Additional styling & palette personalisation',
      'Add-to-Calendar event downloads',
    ],
  },
  {
    id: 'luxury',
    name: 'Luxury',
    price: 1999,
    priceDisplay: `${currency}1,999`,
    badge: 'Bespoke Experience',
    tagline: 'The ultimate bespoke experience with custom music and priority design support.',
    description: 'For couples seeking a truly unforgettable digital invitation with custom ceremony sections, premium effects, and priority designer assistance.',
    popular: false,
    ctaText: 'Choose Luxury',
    features: [
      'Everything in Signature',
      'More extensive design personalisation',
      'Multiple wedding ceremony sections (unlimited events)',
      'Premium interactive elements & audio styling',
      'Enhanced invitation typography and border effects',
      'Priority 1-on-1 design support via WhatsApp',
      'Unlimited revisions until perfection',
    ],
  },
];

export default packages;
