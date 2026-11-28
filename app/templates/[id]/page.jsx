import InvitationPreview from '../../../src/views/InvitationPreview';
import RootLayoutShell from '../../shell';
import templates from '../../../src/data/templates';
import siteConfig from '../../../lib/siteConfig';

export async function generateMetadata({ params }) {
  const tmpl = templates.find((t) => t.id === params.id || t.alias === params.id) || templates[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aahvaaan.vercel.app';
  const title = `${tmpl.name} – Luxury Indian Wedding Invitation | Aahvaaan`;
  const description = `${tmpl.shortDescription} Includes diya reveal, wedding shehnai, Google Maps navigation, and personal family envelopes.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/templates/${params.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/templates/${params.id}`,
      type: 'website',
      images: [
        {
          url: tmpl.image,
          width: 800,
          height: 500,
          alt: `${tmpl.name} wedding invitation preview`,
        },
      ],
    },
  };
}

export default function TemplatePreviewPage({ params }) {
  const tmpl = templates.find((t) => t.id === params.id || t.alias === params.id) || templates[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aahvaaan.vercel.app';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${tmpl.name} Digital Wedding Invitation`,
    image: `${siteUrl}${tmpl.image}`,
    description: tmpl.description || tmpl.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'Aahvaaan by Vow & Vision',
    },
    offers: {
      '@type': 'Offer',
      price: siteConfig.pricing.signature.price.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/templates/${tmpl.id}`,
    },
  };

  return (
    <RootLayoutShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <InvitationPreview />
    </RootLayoutShell>
  );
}
