import siteConfig from '../../lib/siteConfig';

export const packages = [
  {
    ...siteConfig.pricing.starter,
    badge: 'Essential',
  },
  {
    ...siteConfig.pricing.signature,
    badge: 'Most Popular',
  },
  {
    ...siteConfig.pricing.luxury,
    badge: 'Bespoke Experience',
  },
];

export default packages;
