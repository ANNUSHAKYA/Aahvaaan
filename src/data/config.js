import siteConfig, { isValidWhatsAppNumber, isValidEmail, getWhatsAppUrl } from '../config/site.config';

// Central configuration file for Vow & Vision / Aahvaaan
const config = {
  // Brand
  brandName: siteConfig.brandName,
  websiteName: siteConfig.websiteName,
  tagline: siteConfig.tagline,

  // Contact – Business WhatsApp and Email
  whatsappNumber: siteConfig.whatsappNumber,
  email: siteConfig.email,
  instagram: siteConfig.instagram,
  instagramHandle: siteConfig.instagramHandle,

  // Business details
  location: siteConfig.location,
  currency: siteConfig.currency,

  // Utilities
  isValidWhatsAppNumber,
  isValidEmail,
  getWhatsAppUrl,
  
  // Default sample invitation details
  sampleInvitation: {
    bride: 'Ananya Sharma',
    groom: 'Kabir Singhania',
    weddingDate: '2027-02-22',
    location: 'Udaipur, Rajasthan',
    venue: 'The Oberoi Udaivilas, Haridas Ji Ki Magri, Udaipur, Rajasthan 313001',
    mapUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
  },
};

export default config;
