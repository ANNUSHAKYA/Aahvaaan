import { Link } from '../lib/router-compat';
import SEO from '../components/SEO';
import siteConfig from '../../lib/siteConfig';

export default function Refund() {
  return (
    <div className="bg-ivory min-h-screen pt-28 pb-20 font-body">
      <SEO
        title="Refund Policy | Aahvaaan by Vow & Vision"
        description="Clear, transparent refund and cancellation policy for digital wedding invitations by Aahvaaan."
      />
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-heading uppercase tracking-widest text-gold font-bold block mb-1">
            Fair &amp; Transparent
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-wine mb-4">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-lg mx-auto">
            We want you to feel completely confident when ordering your wedding invitation with Aahvaaan.
          </p>
        </div>

        {/* Lawyer Review Notice */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-3 shadow-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 font-bold uppercase text-[10px] tracking-wide shrink-0">
            Notice
          </span>
          <div className="leading-relaxed">
            <strong className="block text-amber-900 mb-0.5">Draft, to be reviewed by a lawyer</strong>
            This refund policy sets forth our standards for cancellations, refunds, and design exchanges. It is currently a draft document to be reviewed and confirmed with our legal team.
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-champagne/80 p-6 sm:p-10 shadow-xs space-y-8 text-charcoal/80 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              1. 100% Pre-Publishing Cancellation Refund
            </h2>
            <p>
              If you purchase an invitation and change your mind before your invitation is finalized and published live, you are eligible for a <strong className="text-wine">100% full refund</strong>. Simply send an email or WhatsApp message to our team with your order reference.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              2. Free Template Exchange
            </h2>
            <p>
              Prior to publishing your invitation, you may freely swap your selected template for any other available collection on Aahvaaan at no additional charge. Your inputted ceremony details, dates, and couple story will be transferred to your new design.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              3. Delivered Digital Goods Policy
            </h2>
            <p>
              Because Aahvaaan produces personalized digital web services that immediately deploy cloud hosting, active domain URLs, and server resources upon publishing, orders that have already been published live and shared with guests are generally non-refundable.
            </p>
            <p>
              However, every published order includes {siteConfig.liveUpdatesIncluded} live updates within {siteConfig.updateWindowMonths} months. If you notice an error in your dates, venue, or timings, you can update them instantly without incurring any fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              4. Processing Timeline
            </h2>
            <p>
              Approved refunds are initiated immediately and processed through our payment gateway to your original payment method (UPI, credit/debit card, or net banking) within 5 to 7 business days, depending on your bank's clearance schedule.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
              5. Contact Us for Assistance
            </h2>
            <p>
              To request a cancellation, exchange, or refund, please reach out to us at{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-wine font-semibold underline">
                {siteConfig.email}
              </a>{' '}
              with your order ID and couple names.
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
