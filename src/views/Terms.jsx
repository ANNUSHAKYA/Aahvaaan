import { Link } from '../lib/router-compat';
import SEO from '../components/SEO';
import siteConfig from '../../lib/siteConfig';

export default function Terms() {
  return (
    <div className="bg-ivory min-h-screen pt-28 pb-20 font-body">
      <SEO
        title="Terms of Service | Aahvaaan by Vow & Vision"
        description="Terms of service and acceptable use for digital wedding invitations by Aahvaaan."
      />
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-heading uppercase tracking-widest text-gold font-bold block mb-1">
            Legal Information
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-wine mb-4">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-lg mx-auto">
            Please read these terms carefully before creating or sharing an invitation through Aahvaaan.
          </p>
        </div>

        {/* Lawyer Review Notice */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-3 shadow-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 font-bold uppercase text-[10px] tracking-wide shrink-0">
            Notice
          </span>
          <div className="leading-relaxed">
            <strong className="block text-amber-900 mb-0.5">Draft, to be reviewed by a lawyer</strong>
            This document outlines the standard operational terms for Aahvaaan digital wedding invitations. It is currently in draft format and will be finalized with legal counsel.
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-champagne/80 p-6 sm:p-10 shadow-xs space-y-8 text-charcoal/80 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using {siteConfig.brandName} (“Aahvaaan”, “we”, “our”, or “the Service”), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              2. Description of the Service
            </h2>
            <p>
              Aahvaaan provides digital wedding invitation software that allows couples and families to create interactive web-based wedding cards. Features include custom itineraries, music, venue navigation, date reveals, open sharing links, and named links for individual guest households.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              3. User Accounts and Verification
            </h2>
            <p>
              To create and publish an invitation, you may be required to register an account using a valid email address or mobile authentication. You are responsible for safeguarding your login credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              4. Content Ownership and License
            </h2>
            <p>
              You retain all ownership rights to the photos, family names, ceremony descriptions, and personal messages you upload to your wedding invitation. By uploading content, you grant Aahvaaan a limited license to host, display, and transmit the content solely for the purpose of serving your invitation to your intended recipients.
            </p>
            <p>
              You agree not to upload content that infringes upon third-party copyrights or violates applicable laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              5. Publishing and Plan Rules
            </h2>
            <p>
              Each published order includes access to the features outlined in our pricing and site specifications:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal/70">
              <li>One open broadcast link for sharing with extended groups.</li>
              <li>{siteConfig.namedLinksIncluded} named links for personal household greetings.</li>
              <li>Up to {siteConfig.liveUpdatesIncluded} live detail updates within {siteConfig.updateWindowMonths} months of publishing.</li>
            </ul>
            <p>
              After the {siteConfig.updateWindowMonths}-month editing window, the invitation remains online for viewing, but further live edits are locked.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              6. Service Availability and Modifications
            </h2>
            <p>
              We strive for 99.9% uptime so that your guests can access your invitation anytime on WhatsApp or mobile browsers. However, temporary maintenance or unexpected outages may occasionally occur. We reserve the right to improve, update, or modify features without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              7. Contact Information
            </h2>
            <p>
              For legal inquiries, questions about these Terms, or account assistance, please contact us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-wine font-semibold underline">
                {siteConfig.email}
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/templates"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-wine hover:bg-wine-light text-white text-xs font-semibold shadow-md transition-all"
          >
            Explore Templates
          </Link>
        </div>
      </div>
    </div>
  );
}
