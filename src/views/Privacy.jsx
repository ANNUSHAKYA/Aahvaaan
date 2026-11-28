'use client';

import { Link } from '../lib/router-compat';
import SEO from '../components/SEO';
import siteConfig from '../../lib/siteConfig';

export default function Privacy() {
  return (
    <div className="bg-ivory min-h-screen pt-28 pb-20 font-body">
      <SEO
        title="Privacy Policy | Aahvaaan by Vow & Vision"
        description="Privacy policy and data protection principles for digital wedding invitations by Aahvaaan."
      />
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-heading uppercase tracking-widest text-gold font-bold block mb-1">
            Data Protection
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-wine mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-lg mx-auto">
            Your wedding celebration is deeply personal. Here is how we safeguard your family information and guest data.
          </p>
        </div>

        {/* Lawyer Review Notice */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-3 shadow-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 font-bold uppercase text-[10px] tracking-wide shrink-0">
            Notice
          </span>
          <div className="leading-relaxed">
            <strong className="block text-amber-900 mb-0.5">Draft, to be reviewed by a lawyer</strong>
            This privacy policy sets forth our standards for handling couple and guest data. It is currently a draft document to be finalized with our legal advisors.
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-champagne/80 p-6 sm:p-10 shadow-xs space-y-8 text-charcoal/80 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              1. Information We Collect
            </h2>
            <p>
              When you use {siteConfig.brandName}, we collect information necessary to design, host, and deliver your wedding invitation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal/70">
              <li><strong>Account details:</strong> Email address, name, and phone number when registering.</li>
              <li><strong>Wedding details:</strong> Couple names, ceremony dates, event timings, venue location, photos, and personalized greetings.</li>
              <li><strong>Guest information:</strong> Household or guest names you add to generate named links.</li>
              <li><strong>RSVP responses:</strong> Attendance status, dietary preferences, and blessing messages submitted by guests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              2. How We Use Your Information
            </h2>
            <p>
              We use collected information exclusively to provide our digital wedding invitation services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal/70">
              <li>Generating your interactive wedding web card and customized digital envelopes.</li>
              <li>Providing maps and calendar links for your ceremony locations.</li>
              <li>Compiling your RSVP guest responses in your private host dashboard.</li>
              <li>Communicating with you regarding your order or support inquiries.</li>
            </ul>
            <p className="font-semibold text-wine">
              We never sell or monetize your guest list or wedding data to third-party advertisers or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              3. Named Guest Links &amp; Security
            </h2>
            <p>
              Named guest links are generated with cryptographically random, unguessable slugs (24-character identifiers) so that only individuals who receive the specific link can view the greeting addressed to their household.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              4. Data Retention and Deletion
            </h2>
            <p>
              Your invitation remains viewable online following your celebration as a digital keepsake. If at any point you wish to permanently delete your invitation, guest names, photos, or account records, you may email us directly, and we will purge the records from our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              5. Contact Us
            </h2>
            <p>
              If you have any questions or privacy concerns, please contact us at{' '}
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
