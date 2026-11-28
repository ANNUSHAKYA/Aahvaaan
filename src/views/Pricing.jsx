import { useState } from 'react';
import { Link } from '../lib/router-compat';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, MessageCircle, Sparkles, Clock, ShieldCheck,
  Smartphone, RefreshCw, CheckCircle2, ChevronDown
} from 'lucide-react';
import packages from '../data/pricing';
import PricingCard from '../components/PricingCard';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';

const GOOD_TO_KNOW_ITEMS = [
  {
    icon: Clock,
    title: 'Active for 6 Months',
    desc: 'Your interactive invitation link and live host dashboard remain fully accessible for 6 months from purchase date.',
  },
  {
    icon: RefreshCw,
    title: '3 Free Design Revisions',
    desc: 'Includes 3 rounds of designer revisions for ceremony dates, text wording, and photo uploads, plus anytime self-edits.',
  },
  {
    icon: CheckCircle2,
    title: '48-Hour Fast Delivery',
    desc: 'Receive your live preview invitation draft within 48 hours of submitting your wedding details and photographs.',
  },
  {
    icon: Smartphone,
    title: 'Zero App Downloads Needed',
    desc: 'Guests tap your link in WhatsApp and it opens immediately in any browser with sound, maps, and animations.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Refund Policy',
    desc: '100% money-back refund if cancelled before design draft begins. Free template exchange anytime prior to publishing.',
  },
];

const PRICING_FAQS = [
  {
    q: 'How quickly is our wedding invitation link delivered?',
    a: 'Once you submit your wedding schedule, venue details, and couple photos, our studio prepares and delivers your live interactive draft within 48 hours.',
  },
  {
    q: 'How many revisions can we request on our invitation?',
    a: 'All packages include 3 complimentary design revision rounds with our team. Additionally, you can update dates, timings, and dietary options directly from your host studio dashboard anytime.',
  },
  {
    q: 'Do our wedding guests need to download an app or create an account?',
    a: 'No app or login is needed! Guests simply tap your link on WhatsApp, SMS, or Instagram, and the interactive experience opens smoothly on iOS, Android, and desktop browsers.',
  },
  {
    q: 'How does greeting guests by name work?',
    a: 'With personalized guest links, every family or guest receives a unique link. When they open it, the wax-sealed envelope and welcome greeting are addressed specifically to them (e.g., "The Patidar Family").',
  },
  {
    q: 'What is your refund and template exchange policy?',
    a: 'We offer a 100% full refund if you cancel before our team commences work on your design draft. You may also swap your selected template for any other collection free of charge prior to final publishing.',
  },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };
  return (
    <div className="pt-20">
      <SEO
        title="Pricing & Packages | Aahvaaan by Vow & Vision"
        description="Transparent wedding invitation packages starting from ₹1,749. Includes personalized guest links, live RSVP tracking, and Google Maps integration."
        url="https://aahvaaan.vercel.app/pricing"
      />
      {/* Header */}
      <section className="section-padding bg-champagne/30">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Transparent Pricing"
            title="Choose Your Perfect Package"
            description="Every package includes a fully personalised, mobile-friendly digital wedding invitation based on one of our 4 signature collections. Clear starting prices with no hidden charges."
          />

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {packages.map((plan) => (
              <PricingCard key={plan.id} plan={plan} featured={plan.popular} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="font-body text-xs text-charcoal/60">
              💡 Looking for a specific design? You can also <Link to="/invitations" className="text-wine font-semibold underline">explore the 4 Signature Templates</Link> and click "Buy This Template" to have your design pre-selected!
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <SectionHeading
            subtitle="Detailed Feature Breakdown"
            title="Package Comparison"
            description="Compare every capability across our Starter, Signature, and Luxury packages."
          />

          <div className="overflow-x-auto bg-ivory rounded-xl p-6 border border-champagne/50 shadow-xs">
            <table className="w-full font-body text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-champagne">
                  <th className="text-left py-4 pr-4 font-heading text-lg sm:text-xl text-wine">Features & Inclusions</th>
                  {packages.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-3 font-heading text-base sm:text-lg text-wine">
                      {plan.name}
                      <span className="block text-xs font-body font-normal text-gold mt-0.5">{plan.priceDisplay}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Selected Signature Template Design', starter: true, signature: true, luxury: true },
                  { feature: 'Personalised Couple Names & Wedding Date', starter: true, signature: true, luxury: true },
                  { feature: 'Ceremony Schedule & Itinerary', starter: true, signature: true, luxury: true },
                  { feature: 'Venue Details & Google Maps Link', starter: true, signature: true, luxury: true },
                  { feature: 'Instant WhatsApp Shareable Link', starter: true, signature: true, luxury: true },
                  { feature: 'Mobile-First Responsive Experience', starter: true, signature: true, luxury: true },
                  { feature: 'Personalised Couple Love Story', starter: false, signature: true, luxury: true },
                  { feature: 'Wedding Photo Gallery (up to 8 Photos)', starter: false, signature: true, luxury: true },
                  { feature: 'Live Wedding Countdown Timer', starter: false, signature: true, luxury: true },
                  { feature: 'Interactive Guest RSVP Form', starter: false, signature: true, luxury: true },
                  { feature: 'Signature Envelope Opening Animation', starter: false, signature: true, luxury: true },
                  { feature: 'Add-to-Calendar (.ics) Event Downloads', starter: false, signature: true, luxury: true },
                  { feature: 'Multiple Ceremony Sections (Unlimited Events)', starter: false, signature: false, luxury: true },
                  { feature: 'Enhanced Bespoke Typography & Border Styling', starter: false, signature: false, luxury: true },
                  { feature: 'Priority 1-on-1 Design Support via WhatsApp', starter: false, signature: false, luxury: true },
                  { feature: 'Unlimited Design Revisions until Approval', starter: false, signature: false, luxury: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-champagne/40">
                    <td className="py-3.5 pr-4 text-charcoal font-medium">{row.feature}</td>
                    <td className="text-center py-3.5 px-3">
                      {row.starter ? (
                        <span className="text-gold text-base font-bold">✓</span>
                      ) : (
                        <span className="text-charcoal/20">—</span>
                      )}
                    </td>
                    <td className="text-center py-3.5 px-3 bg-champagne/20">
                      {row.signature ? (
                        <span className="text-gold text-base font-bold">✓</span>
                      ) : (
                        <span className="text-charcoal/20">—</span>
                      )}
                    </td>
                    <td className="text-center py-3.5 px-3">
                      {row.luxury ? (
                        <span className="text-gold text-base font-bold">✓</span>
                      ) : (
                        <span className="text-charcoal/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── GOOD TO KNOW TRUST SECTION ─── */}
      <section className="section-padding bg-[#FFFBF7] border-y border-champagne/40">
        <div className="container-custom mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-gold block mb-2">
              TRANSPARENT COMMITMENTS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-wine tracking-tight mb-3">
              Good To Know Before You Begin
            </h2>
            <p className="font-body text-xs sm:text-sm text-charcoal/70 max-w-xl mx-auto">
              Everything you need to know about our turnaround, revision guarantees, and hassle-free guest experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5 sm:gap-6">
            {GOOD_TO_KNOW_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-white rounded-3xl p-6 border border-champagne/70 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-champagne/30 text-wine flex items-center justify-center mb-4">
                    <Icon size={22} className="text-wine" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-wine mb-1.5">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-charcoal/75 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5-ITEM FAQ ACCORDION ─── */}
      <section className="section-padding bg-ivory">
        <div className="container-custom mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-gold block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-wine tracking-tight mb-2">
              Got Questions? We Have Answers.
            </h2>
            <p className="font-body text-xs sm:text-sm text-charcoal/70">
              Clear answers to the most common questions from our couples.
            </p>
          </div>

          <div className="space-y-3.5">
            {PRICING_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-champagne/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-body text-xs sm:text-sm font-semibold text-wine hover:text-gold transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`w-6 h-6 rounded-full bg-champagne/30 text-wine flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-gold/20 text-gold-dark' : ''
                      }`}
                    >
                      <ChevronDown size={14} />
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pt-1 font-body text-xs sm:text-sm text-charcoal/75 leading-relaxed border-t border-champagne/30">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Requirements Banner */}
      <section className="section-padding bg-ivory">
        <div className="container-custom mx-auto text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-md mb-4">Have Custom Or Multi-Day Celebrations?</h2>
            <p className="text-body mb-8">
              Need a multilingual invitation (Hindi + English), custom background music, audio narration, or multiple PDF cards? We would love to tailor a bespoke package for your wedding.
            </p>
            <Link to="/contact" className="btn-primary">
              <MessageCircle size={16} className="mr-2" />
              Discuss Custom Requirements
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
