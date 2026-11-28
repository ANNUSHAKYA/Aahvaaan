'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '../lib/router-compat';
import SEO from '../components/SEO';
import {
  Sparkles,
  MapPin,
  Users,
  Calendar,
  Edit3,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Mail,
  Flame,
  Link2,
} from 'lucide-react';
const InteractiveDiyaHook = dynamic(
  () => import('../components/home/InteractiveDiyaHook'),
  {
    ssr: false,
    loading: () => (
      <div className="py-4 flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    ),
  }
);
import templates from '../data/templates';
import { checkRateLimit, recordRateLimitAction } from '../utils/rateLimiter';
import siteConfig from '../../lib/siteConfig';

// ─── FAQ Accordion Item (Always in DOM for SEO / Crawlers, Toggled via CSS) ───
function FAQAccordionItem({ question, answer, isOpen, onToggle, index }) {
  return (
    <div className="border border-champagne/80 rounded-2xl bg-white shadow-xs overflow-hidden transition-all duration-300">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          className="w-full text-left py-4 sm:py-5 px-5 sm:px-6 min-h-[48px] flex items-center justify-between gap-4 font-heading text-lg sm:text-xl font-bold text-wine hover:text-gold transition-colors cursor-pointer"
        >
          <span>{question}</span>
          <span className="w-8 h-8 rounded-full bg-ivory border border-champagne flex items-center justify-center shrink-0 text-wine">
            {isOpen ? <Minus size={15} /> : <Plus size={15} />}
          </span>
        </button>
      </h3>
      {/* Kept in DOM for search engines & View Source; visibility managed via CSS */}
      <div
        id={`faq-answer-${index}`}
        role="region"
        className={`transition-all duration-300 ease-in-out px-5 sm:px-6 overflow-hidden ${
          isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 pb-0 opacity-0 pointer-events-none'
        }`}
      >
        <p className="font-body text-[15px] sm:text-base text-charcoal/80 leading-relaxed pt-2 border-t border-champagne/40">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    city: '',
    weddingDate: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactError('');

    const rl = checkRateLimit('contact_form', 3, 15);
    if (!rl.allowed) {
      setContactError(rl.error);
      return;
    }

    recordRateLimitAction('contact_form');
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', city: '', weddingDate: '', message: '' });
    }, 4000);
  };

  const handleScrollToSection = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Phase 1 FAQ Specification (8 items, dynamic plan rules from siteConfig)
  const faqs = [
    {
      q: 'Can I change details after I publish?',
      a: `Yes. Drafts can be edited freely; you can push ${siteConfig.liveUpdatesIncluded} live updates within ${siteConfig.updateWindowMonths} months.`,
    },
    {
      q: "What's included in an order?",
      a: `The design, one open link, ${siteConfig.namedLinksIncluded} named links, maps, calendar and music.`,
    },
    {
      q: "What's the difference between an open link and a named link?",
      a: 'An open link is the same for everyone; a named link greets one household by name.',
    },
    {
      q: 'Do guests need to install or sign up for anything?',
      a: 'No, it opens in the phone browser from WhatsApp.',
    },
    {
      q: 'How do guests reply?',
      a: siteConfig.features.rsvpInboxLive
        ? 'Guests open your invitation link, choose Yes or No, select their party size and optional event or meal preferences, and add a short note. Replies appear immediately in your Aahvaaan RSVP dashboard, and named-link guests can update their reply anytime.'
        : 'RSVP replies will land directly in your dashboard (Coming soon). In the meantime, guests can tap your WhatsApp button on the invitation to confirm their presence.',
    },
    {
      q: 'Can I add more named links later?',
      a: 'Yes. Message us on WhatsApp and we will add more named links to your invitation.',
    },
    {
      q: `What happens after ${siteConfig.updateWindowMonths} months?`,
      a: 'The invitation stays viewable; editing locks.',
    },
    {
      q: 'How is this different from a PDF or video invite?',
      a: 'A static file cannot play background shehnai, guide your guests with Google Maps navigation, or let you update venue changes after sending. Aahvaaan gives your guests an interactive celebration web page that you can update whenever plans shift.',
    },
    {
      q: 'How do I pay and when is the invitation ready?',
      a: 'You can pay securely via UPI, QR code or card. Once you submit your wedding details, your preview draft is ready within 24 to 48 hours for review.',
    },
    {
      q: 'Can I change the music or photos?',
      a: 'Yes. You can select from traditional shehnai or melodies, or provide your own audio. Photos can also be updated whenever you like.',
    },
    {
      q: 'Can the invitation show Hindi text?',
      a: 'Yes. We support authentic Hindi and Devanagari script for shlokas, ceremony titles, family names, and personal blessings.',
    },
    {
      q: 'How do I reach you if I need help?',
      a: `You can reach us anytime directly on WhatsApp at ${siteConfig.whatsappNumber} or email ${siteConfig.email}. We typically reply within a few hours.`,
    },
  ];

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="bg-ivory min-h-screen font-body overflow-x-hidden">
      <SEO
        title="Aahvaaan | Digital invitations, made for Indian weddings"
        description="Let the celebration begin the moment they open the link. Interactive wedding invitations made for WhatsApp sharing."
      />

      {/* Structured Data: FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ════════════════ 1. HERO SECTION ════════════════ */}
      <section className="bg-gradient-to-b from-[#18030B] via-[#2D0B16] to-[#512D38] text-white pt-24 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 relative overflow-hidden">
        {/* Soft 3D ambient glows */}
        <div className="absolute top-1/4 left-5 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#8C3A50]/25 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
        <div className="absolute bottom-5 right-5 sm:right-10 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#B69A70]/20 rounded-full blur-[110px] sm:blur-[150px] pointer-events-none" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-40 bg-gold/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-5 sm:space-y-6 animate-hero-fade">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold/40 text-gold-light text-xs font-semibold tracking-wider uppercase shadow-xs">
                <Sparkles size={13} className="text-gold animate-pulse" />
                <span>Digital invitations, made for Indian weddings</span>
              </div>

              <h1 className="font-heading text-3xl xs:text-4xl sm:text-5xl lg:text-[3.65rem] font-bold text-white leading-[1.14] tracking-tight">
                Let the celebration begin the moment they open the link.
              </h1>

              <p className="font-body text-[15px] sm:text-base text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Aahvaaan turns your wedding card into a living invitation: a diya to light, a greeting by name for every family, music, maps and RSVPs on WhatsApp, all in one link made for WhatsApp.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4">
                <Link
                  to="/templates"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 min-h-[44px] rounded-full bg-gradient-to-r from-wine via-[#6B3D4A] to-[#8C3A50] hover:brightness-110 active:scale-95 text-white font-body font-semibold text-sm shadow-[0_10px_25px_-5px_rgba(81,45,56,0.6)] border border-[#B69A70]/60 transition-all duration-300"
                >
                  <span>Browse designs</span>
                  <ChevronRight size={16} className="text-gold-light" />
                </Link>

                <a
                  href="#diya-reveal"
                  onClick={handleScrollToSection('diya-reveal')}
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-full border border-gold/40 text-gold-light hover:bg-white/10 active:scale-95 text-sm font-semibold transition-all backdrop-blur-xs cursor-pointer"
                >
                  <span>Try the diya reveal</span>
                </a>
              </div>

              {/* ─── INTERACTIVE HERO HOOK: TAP THE DIYAS ─── */}
              <div id="diya-reveal" className="pt-1 scroll-mt-24">
                <InteractiveDiyaHook />
              </div>

              {/* Honest Chips (Zero fake stats) */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-white/90">
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  No app needed for guests
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  Built for WhatsApp sharing
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  Edit after you share
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Palace Arch Window */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end items-end relative pt-4 lg:pt-0">
              <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] lg:max-w-[460px] mx-auto animate-hero-fade">
                {/* Backing palace wall shadow depth */}
                <div className="absolute -inset-2.5 rounded-t-[200px] sm:rounded-t-[240px] rounded-b-3xl bg-gradient-to-b from-[#B69A70]/40 via-[#8C3A50]/30 to-transparent blur-xl -z-10" />

                {/* Outer Architectural Palace Trim */}
                <div className="p-1.5 sm:p-2 rounded-t-[195px] sm:rounded-t-[235px] rounded-b-3xl bg-gradient-to-b from-[#E9D8CC] via-[#B69A70] to-[#512D38] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
                  <div className="relative rounded-t-[185px] sm:rounded-t-[225px] rounded-b-2xl overflow-hidden border-[4px] sm:border-[6px] border-[#B69A70] bg-[#FAF7F2]">
                    <div className="absolute inset-0 shadow-[inset_0_20px_35px_rgba(0,0,0,0.55)] pointer-events-none z-20 rounded-t-[180px] sm:rounded-t-[220px]" />

                    {/* Top arch keystone */}
                    <div className="absolute top-2.5 sm:top-3.5 inset-x-0 flex justify-center z-30 pointer-events-none">
                      <span className="bg-[#512D38]/95 text-gold-light border border-gold/60 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-heading px-3.5 sm:px-4 py-1 rounded-full shadow-lg backdrop-blur-md">
                        Mor Pankh · Sample Design
                      </span>
                    </div>

                    {/* Main Couple Portrait inside the Arch */}
                    <div className="relative aspect-[3/4.4] w-full overflow-hidden bg-wine group">
                      <Image
                        src="/hero-couple.webp"
                        alt="Royal wedding invitation couple portrait inside architectural palace arch"
                        width={736}
                        height={981}
                        priority
                        className="w-full h-full object-cover object-top filter brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-[#18030B] via-[#512D38]/80 to-transparent z-10 pointer-events-none" />

                      {/* Bottom Royal Names & Fictional Venue */}
                      <div className="absolute bottom-3.5 sm:bottom-5 inset-x-0 text-center z-20 text-white px-3 sm:px-4">
                        <p className="text-gold-light text-xs font-heading tracking-[0.2em] uppercase font-medium">
                          || श्री गणेशाय नमः ||
                        </p>
                        <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide text-white drop-shadow-lg leading-tight mt-0.5">
                          Ananya &amp; Kabir
                        </h3>
                        <p className="text-xs sm:text-sm text-champagne/90 font-light mt-0.5 sm:mt-1">
                          Rajmahal Gardens, Jaipur (sample)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card Left: Sample RSVP (Hidden on screens < 640px) */}
                <div className="absolute -top-3 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 px-3.5 shadow-xl border border-gold/50 hidden sm:flex items-center gap-2.5 z-40 text-charcoal animate-float-card-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-wine block leading-none">
                      Sample RSVP
                    </span>
                    <span className="text-[11px] text-charcoal/70">
                      Sharma Family • Attending (3)
                    </span>
                  </div>
                </div>

                {/* Floating Card Right: Sample Link (Hidden on screens < 640px) */}
                <div className="absolute -bottom-3 -right-6 bg-gradient-to-r from-wine to-[#8C3A50] text-white rounded-2xl p-2.5 px-4 shadow-xl border border-gold/50 hidden sm:flex items-center gap-2.5 z-40 animate-float-card-2">
                  <span className="text-base select-none">💌</span>
                  <div>
                    <span className="text-xs font-bold block leading-none text-gold-light">
                      Sample link
                    </span>
                    <span className="text-[11px] text-white/85">
                      aahvaaan.com/n/sharma-family-sample
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS STRIP (3 Steps - Phase 5 Requirement 4) ════════════════ */}
      <section id="how-it-works" className="py-14 sm:py-16 bg-[#FAF4EE] border-y border-champagne/60 relative scroll-mt-20">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-gold block mb-1">
              Simple 3-Step Process
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-wine tracking-tight">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Step 1: Choose a design */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-champagne/70 shadow-xs flex flex-col items-center text-center relative group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 border border-wine/20 text-wine flex items-center justify-center font-heading text-xl font-bold mb-4 group-hover:scale-105 transition-transform">
                1
              </div>
              <h3 className="font-heading text-xl font-bold text-wine mb-2">
                Choose a design
              </h3>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                Pick a royal invitation theme crafted with diya reveals, palace arches, and traditional Indian wedding aesthetics.
              </p>
            </div>

            {/* Step 2: Add your details */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-champagne/70 shadow-xs flex flex-col items-center text-center relative group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 border border-wine/20 text-wine flex items-center justify-center font-heading text-xl font-bold mb-4 group-hover:scale-105 transition-transform">
                2
              </div>
              <h3 className="font-heading text-xl font-bold text-wine mb-2">
                Add your details
              </h3>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                Add ceremony dates, Google Maps venue navigation, couple love notes, and family member names in a few minutes.
              </p>
            </div>

            {/* Step 3: Share your link */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-champagne/70 shadow-xs flex flex-col items-center text-center relative group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 border border-wine/20 text-wine flex items-center justify-center font-heading text-xl font-bold mb-4 group-hover:scale-105 transition-transform">
                3
              </div>
              <h3 className="font-heading text-xl font-bold text-wine mb-2">
                Share your link
              </h3>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                Drop one open link into WhatsApp family groups, or send personalized envelopes that greet each household by name.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 2. FEATURED DESIGN ════════════════ */}
      <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine/10 text-wine text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles size={13} className="text-gold" />
            <span>Featured Design</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-3">
            Mor Pankh · № 01
          </h2>
          <p className="font-body text-[15px] sm:text-base text-charcoal/75 max-w-xl mx-auto">
            Our signature interactive wedding invitation featuring 3D arch gates, ceremony schedule, wedding music, and personal family envelopes.
          </p>
        </div>

        {/* Featured Template Card */}
        <div className="max-w-2xl mx-auto">
          {templates.map((tmpl) => (
            <Link
              key={tmpl.id}
              to={`/templates/${tmpl.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-champagne/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group relative"
            >
              <div className="aspect-[16/10] overflow-hidden bg-ivory relative border-b border-champagne/40">
                <Image
                  src={tmpl.image}
                  alt={`${tmpl.name} luxury Indian wedding invitation preview`}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-champagne/60">
                  <span className="font-heading text-xs font-semibold text-wine tracking-wide">
                    {tmpl.collection}
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-wine text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                  {tmpl.priceDisplay}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-widest text-gold block mb-1">
                    {tmpl.category}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-wine group-hover:text-gold transition-colors mb-2">
                    {tmpl.name}
                  </h3>
                  <p className="font-body text-[15px] text-charcoal/75 leading-relaxed mb-5">
                    {tmpl.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-champagne/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">
                      Palette Options
                    </span>
                    <span className="text-xs text-charcoal/50 font-mono">
                      {tmpl.colors?.length || 4} Shades
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tmpl.colors?.map((c, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-champagne shadow-2xs hover:scale-125 transition-transform cursor-pointer"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.hex})`}
                      />
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-champagne/30 flex items-center justify-between">
                    <span className="text-sm font-semibold text-wine group-hover:text-gold transition-colors">
                      Customize this design
                    </span>
                    <span className="w-9 h-9 rounded-full bg-ivory text-wine group-hover:bg-wine group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
                      <ChevronRight size={17} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/templates/mor-pankh"
            className="inline-flex items-center gap-2 px-8 py-3.5 min-h-[44px] rounded-full bg-gradient-to-r from-wine via-[#6B3D4A] to-[#8C3A50] hover:brightness-110 active:scale-95 text-white font-body font-semibold text-sm shadow-md hover:shadow-xl transition-all border border-[#B69A70]/50"
          >
            <span>View Mor Pankh</span>
            <ChevronRight size={16} className="text-gold-light" />
          </Link>
        </div>
      </section>

      {/* ════════════════ 3. FEATURES SECTION (6 Cards, 3x2 Grid) ════════════════ */}
      <section id="features" className="bg-[#512D38] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#B69A70]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#C99191]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16 relative">
            <h2 className="inline-block px-10 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white font-heading text-3xl sm:text-4xl font-bold tracking-tight shadow-inner border border-white/15">
              Features
            </h2>
          </div>

          {/* 3x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. One-tap Maps */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300 relative">
              {!siteConfig.features.maps && (
                <div className="absolute top-4 right-4 bg-gold/20 text-[#512D38] border border-gold/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Coming soon
                </div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <MapPin size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-lg sm:text-xl font-bold text-wine mb-2">
                One-tap Maps
              </h4>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                The venue opens straight in the guest's maps app.
              </p>
            </div>

            {/* 2. RSVP inbox */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300 relative">
              {!siteConfig.features.rsvpInbox && (
                <div className="absolute top-4 right-4 bg-gold/20 text-[#512D38] border border-gold/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Coming soon
                </div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Users size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-lg sm:text-xl font-bold text-wine mb-2">
                RSVP inbox
              </h4>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                Replies land in one dashboard.
              </p>
            </div>

            {/* 3. Save the date */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300 relative">
              {!siteConfig.features.calendar && (
                <div className="absolute top-4 right-4 bg-gold/20 text-[#512D38] border border-gold/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Coming soon
                </div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Calendar size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-lg sm:text-xl font-bold text-wine mb-2">
                Save the date
              </h4>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                One tap puts the wedding on any phone calendar.
              </p>
            </div>

            {/* 4. Edit after sharing */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300 relative">
              {!siteConfig.features.liveUpdates && (
                <div className="absolute top-4 right-4 bg-gold/20 text-[#512D38] border border-gold/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Coming soon
                </div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Edit3 size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-lg sm:text-xl font-bold text-wine mb-2">
                Edit after sharing
              </h4>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                Update details without resending the link.
              </p>
            </div>

            {/* 5. Diya reveal & music */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300 relative">
              {!siteConfig.features.music && (
                <div className="absolute top-4 right-4 bg-gold/20 text-[#512D38] border border-gold/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Coming soon
                </div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Flame size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-lg sm:text-xl font-bold text-wine mb-2">
                Diya reveal &amp; music
              </h4>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                A tap-to-light diya reveals the date, with wedding music.
              </p>
            </div>

            {/* 6. Named envelopes */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Mail size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-lg sm:text-xl font-bold text-wine mb-2">
                Named envelopes
              </h4>
              <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75 leading-relaxed">
                Each family opens an envelope with their own name on it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 4. SHARING SECTION (#send) ════════════════ */}
      <section id="send" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine/10 text-wine text-[13px] font-semibold tracking-wider uppercase mb-2">
            <span>WhatsApp Sharing</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-2">
            One invitation, two ways to send it
          </h2>
          <p className="font-body text-[15px] sm:text-base text-charcoal/75 max-w-md mx-auto">
            Reach the whole family at once, or greet each household by name.
          </p>
        </div>

        {/* Mockup Preview Cards: Open link & Named link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Open link */}
          <div className="bg-[#FAF7F2] rounded-[36px] p-6 sm:p-8 border border-champagne/60 text-center shadow-xs flex flex-col items-center hover:shadow-md transition-shadow">
            <h3 className="font-heading text-2xl font-bold text-wine mb-1">
              Open link
            </h3>
            <p className="font-body text-[15px] sm:text-base text-charcoal/75 mb-5 max-w-xs">
              One link for your entire guest list. Drop it into family groups and let everyone in.
            </p>

            {/* URL Box */}
            <div className="w-full max-w-xs py-2 px-4 rounded-full bg-white border border-champagne text-xs font-mono text-charcoal/70 mb-6 truncate shadow-2xs">
              aahvaaan.com/i/sample
            </div>

            {/* Mockup Phone Frame with Royal Arch Lotus Background */}
            <div className="w-60 sm:w-64 aspect-[9/17] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl border-2 border-slate-700 relative flex flex-col overflow-hidden">
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-1 z-30" />
              <div className="flex-1 rounded-[32px] overflow-hidden relative flex flex-col items-center justify-between p-4 text-center border border-gold/40 shadow-inner">
                <Image
                  src="/invitation-frame.webp"
                  alt="Royal Indian wedding invitation with gold jali and lotus floral border"
                  fill
                  sizes="(max-width: 640px) 240px, 256px"
                  className="object-cover object-center pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#3D0A17]/25 pointer-events-none" />

                <div className="relative z-20 pt-8 sm:pt-10">
                  <span className="text-xs text-gold-light font-serif italic block drop-shadow-sm">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  <span className="font-heading text-xs text-[#E9D8CC] uppercase tracking-[0.25em] font-semibold block mt-0.5">
                    Wedding Invitation
                  </span>
                </div>

                <div className="relative z-20 my-auto px-2 max-w-[200px]">
                  <p className="font-petit text-2xl sm:text-3xl text-white drop-shadow-md leading-tight">
                    Kabir &amp; Ananya
                  </p>
                  <div className="w-6 h-0.5 bg-gold/70 rounded-full mx-auto my-1.5" />
                  <p className="font-body text-xs sm:text-[13px] text-[#FAF7F2]/95 leading-tight drop-shadow-xs">
                    Cordially invite you &amp; family to celebrate our holy union
                  </p>
                  <p className="font-heading text-xs text-gold-light mt-1.5 tracking-wider font-semibold">
                    Rajmahal Gardens, Jaipur (sample)
                  </p>
                </div>

                <div className="relative z-20 pb-3 w-full">
                  <div className="py-1.5 px-3 rounded-full bg-wine/90 backdrop-blur-xs border border-gold/50 text-gold-light text-xs font-semibold uppercase tracking-wider shadow-sm min-h-[36px] flex items-center justify-center">
                    Open Invitation ✦
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Named link */}
          <div className="bg-[#FAF7F2] rounded-[36px] p-6 sm:p-8 border border-champagne/60 text-center shadow-xs flex flex-col items-center hover:shadow-md transition-shadow">
            <h3 className="font-heading text-2xl font-bold text-wine mb-1">
              Named link
            </h3>
            <p className="font-body text-[15px] sm:text-base text-charcoal/75 mb-5 max-w-xs">
              A link made for one household. When it opens, the envelope greets them by name.
            </p>

            {/* URL Box */}
            <div className="w-full max-w-xs py-2 px-4 rounded-full bg-white border border-champagne text-xs font-mono text-charcoal/70 mb-6 truncate shadow-2xs">
              aahvaaan.com/n/sharma-family-sample
            </div>

            {/* Mockup Phone Frame with Royal Arch Lotus Background */}
            <div className="w-60 sm:w-64 aspect-[9/17] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl border-2 border-slate-700 relative flex flex-col overflow-hidden">
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-1 z-30" />
              <div className="flex-1 rounded-[32px] overflow-hidden relative flex flex-col items-center justify-between p-4 text-center border border-gold/40 shadow-inner">
                <Image
                  src="/invitation-frame.webp"
                  alt="Personalized royal wedding invitation envelope background with lotus blossoms"
                  fill
                  sizes="(max-width: 640px) 240px, 256px"
                  className="object-cover object-center pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#3D0A17]/25 pointer-events-none" />

                <div className="relative z-20 pt-8 sm:pt-10">
                  <span className="text-xs text-gold-light font-serif italic block drop-shadow-sm">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  <span className="font-heading text-xs text-[#E9D8CC] uppercase tracking-[0.25em] font-semibold block mt-0.5">
                    Personalized Envelope
                  </span>
                </div>

                <div className="relative z-20 my-auto px-2 max-w-[200px]">
                  <span className="text-xs uppercase tracking-widest text-gold-light font-bold block mb-0.5">
                    Namaste
                  </span>
                  <p className="font-petit text-xl sm:text-2xl text-white drop-shadow-md leading-tight">
                    Sharma Family
                  </p>
                  <div className="w-6 h-0.5 bg-gold/70 rounded-full mx-auto my-1.5" />
                  <p className="font-body text-xs sm:text-[13px] text-[#FAF7F2]/95 leading-tight drop-shadow-xs">
                    With joyous hearts, we invite you to grace our wedding celebration
                  </p>
                  <p className="font-heading text-xs text-gold-light mt-1.5 tracking-wider font-semibold">
                    Rajmahal Gardens, Jaipur (sample)
                  </p>
                </div>

                <div className="relative z-20 pb-3 w-full">
                  <div className="py-1.5 px-3 rounded-full bg-gradient-to-r from-wine to-[#8C3A50] border border-gold/50 text-gold-light text-xs font-semibold uppercase tracking-wider shadow-sm min-h-[36px] flex items-center justify-center">
                    Open Your Envelope 💌
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2-Column Card Strip & Horizontal 3-Step Timeline (Phase 3 + Cleanup) ─── */}
        <div className="max-w-5xl mx-auto space-y-8 mt-14">
          {/* 2-Column Card Strip: Open Link & Named Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Open link with link icon */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-champagne/80 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 border border-wine/20 text-wine flex items-center justify-center shrink-0">
                <Link2 size={22} className="text-wine" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-heading text-xl font-bold text-wine">
                    Open link
                  </h4>
                  <span className="px-3 py-0.5 rounded-full bg-wine/10 text-wine text-[13px] font-bold">
                    1 open link
                  </span>
                </div>
                <p className="font-body text-[15px] text-charcoal/75 leading-relaxed">
                  One link for your entire guest list. Drop it into family groups and let everyone in.
                </p>
              </div>
            </div>

            {/* Right Card: Named links with count badge */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-champagne/80 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 text-wine flex items-center justify-center shrink-0">
                <Users size={22} className="text-[#8C3A50]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-heading text-xl font-bold text-wine">
                    Named links
                  </h4>
                  <span className="px-3 py-0.5 rounded-full bg-gold/25 text-[#512D38] border border-gold/40 text-[13px] font-bold">
                    {siteConfig.namedLinksIncluded} named links
                  </span>
                </div>
                <p className="font-body text-[15px] text-charcoal/75 leading-relaxed">
                  A link made for one household. When it opens, the envelope greets them by name.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="font-body text-[15px] text-charcoal/80 font-medium">
              Need more named links? Message us on WhatsApp.
            </p>
          </div>

          {/* Horizontal 3-Step Timeline for Updates */}
          <div className="bg-[#FAF7F2] rounded-[32px] p-6 sm:p-10 border border-champagne/80 shadow-xs">
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-wine mb-2">
                Venue changed? Fix it once, everyone sees it.
              </h3>
              <p className="font-body text-[15px] sm:text-base text-charcoal/75 max-w-xl mx-auto leading-relaxed">
                Edit your invitation and every link you've already shared shows the new details. No second round of forwarding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Step 1: Publish */}
              <div className="bg-white rounded-2xl p-5 border border-champagne/60 text-center flex flex-col items-center shadow-2xs">
                <div className="w-10 h-10 rounded-full bg-wine text-white flex items-center justify-center font-heading font-bold text-base mb-3 shadow-xs">
                  1
                </div>
                <h4 className="font-heading text-lg font-bold text-wine mb-1">
                  Publish
                </h4>
                <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75">
                  Your digital card goes live with dates, maps, and music.
                </p>
              </div>

              {/* Step 2: Edit anytime */}
              <div className="bg-white rounded-2xl p-5 border border-champagne/60 text-center flex flex-col items-center shadow-2xs">
                <div className="w-10 h-10 rounded-full bg-wine text-white flex items-center justify-center font-heading font-bold text-base mb-3 shadow-xs">
                  2
                </div>
                <h4 className="font-heading text-lg font-bold text-wine mb-1">
                  Edit anytime
                </h4>
                <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75">
                  Change venue locations, timings, or couple notes whenever needed.
                </p>
              </div>

              {/* Step 3: Guests see the change */}
              <div className="bg-white rounded-2xl p-5 border border-champagne/60 text-center flex flex-col items-center shadow-2xs">
                <div className="w-10 h-10 rounded-full bg-wine text-white flex items-center justify-center font-heading font-bold text-base mb-3 shadow-xs">
                  3
                </div>
                <h4 className="font-heading text-lg font-bold text-wine mb-1">
                  Guests see the change
                </h4>
                <p className="font-body text-[14px] sm:text-[15px] text-charcoal/75">
                  Every link you already sent displays the updated details instantly.
                </p>
              </div>
            </div>

            {/* Small chips below */}
            <div className="mt-8 pt-6 border-t border-champagne/60 flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-white border border-champagne/80 text-wine font-body text-[13px] font-bold shadow-2xs">
                ✦ {siteConfig.liveUpdatesIncluded} live updates
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white border border-champagne/80 text-wine font-body text-[13px] font-bold shadow-2xs">
                ✦ For {siteConfig.updateWindowMonths} months after you publish
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 5. PRICING SECTION (3 Plans - Phase 5 Requirement 1) ════════════════ */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine/10 text-wine text-[13px] font-semibold tracking-wider uppercase mb-2">
            <Sparkles size={13} className="text-gold" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-3">
            Choose your invitation package
          </h2>
          <p className="font-body text-[15px] sm:text-base text-charcoal/75 max-w-xl mx-auto">
            One single payment. No recurring monthly subscriptions or hidden forwarding fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto">
          {/* Plan 1: Starter */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-champagne/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-xl font-bold text-wine">
                  {siteConfig.pricing.starter.name}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-wine">
                  {siteConfig.pricing.starter.priceDisplay}
                </span>
                <span className="text-[13px] text-charcoal/60 ml-1.5">one-time payment</span>
              </div>
              <p className="text-[14px] sm:text-[15px] text-charcoal/70 mb-6 leading-relaxed">
                {siteConfig.pricing.starter.tagline}
              </p>
              <div className="w-full h-px bg-champagne/60 mb-6" />
              <ul className="space-y-3 mb-8">
                {siteConfig.pricing.starter.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-charcoal/80">
                    <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/buy/mor-pankh?plan=starter"
              className="w-full py-3 min-h-[44px] rounded-full border border-wine text-wine hover:bg-wine hover:text-white font-body font-semibold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center cursor-pointer"
            >
              <span>{siteConfig.pricing.starter.ctaText}</span>
            </Link>
          </div>

          {/* Plan 2: Signature (Most Popular) */}
          <div className="bg-gradient-to-b from-[#FAF7F2] to-white rounded-3xl p-7 sm:p-8 border-2 border-[#B69A70] shadow-xl relative flex flex-col justify-between lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-wine text-gold-light border border-gold/60 text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="font-heading text-2xl font-bold text-wine">
                  {siteConfig.pricing.signature.name}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-wine">
                  {siteConfig.pricing.signature.priceDisplay}
                </span>
                <span className="text-[13px] text-charcoal/60 ml-1.5">one-time payment</span>
              </div>
              <p className="text-[14px] sm:text-[15px] text-charcoal/70 mb-6 leading-relaxed">
                {siteConfig.pricing.signature.tagline}
              </p>
              <div className="w-full h-px bg-champagne/60 mb-6" />
              <ul className="space-y-3 mb-8">
                {siteConfig.pricing.signature.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-charcoal/90">
                    <CheckCircle2 size={16} className="text-wine shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/buy/mor-pankh?plan=signature"
              className="w-full py-3.5 min-h-[44px] rounded-full bg-gradient-to-r from-wine to-[#8C3A50] hover:brightness-110 active:scale-95 text-white font-body font-semibold text-xs uppercase tracking-wider text-center shadow-md border border-[#B69A70]/50 transition-all flex items-center justify-center cursor-pointer"
            >
              <span>{siteConfig.pricing.signature.ctaText}</span>
            </Link>
          </div>

          {/* Plan 3: Luxury */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-champagne/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-xl font-bold text-wine">
                  {siteConfig.pricing.luxury.name}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-wine">
                  {siteConfig.pricing.luxury.priceDisplay}
                </span>
                <span className="text-[13px] text-charcoal/60 ml-1.5">one-time payment</span>
              </div>
              <p className="text-[14px] sm:text-[15px] text-charcoal/70 mb-6 leading-relaxed">
                {siteConfig.pricing.luxury.tagline}
              </p>
              <div className="w-full h-px bg-champagne/60 mb-6" />
              <ul className="space-y-3 mb-8">
                {siteConfig.pricing.luxury.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-charcoal/80">
                    <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/buy/mor-pankh?plan=luxury"
              className="w-full py-3 min-h-[44px] rounded-full border border-wine text-wine hover:bg-wine hover:text-white font-body font-semibold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center cursor-pointer"
            >
              <span>{siteConfig.pricing.luxury.ctaText}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════ 6. FAQS SECTION (Always in DOM for SEO) ════════════════ */}
      <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="inline-block px-8 py-2.5 rounded-full bg-wine/10 text-wine font-heading text-2xl sm:text-3xl font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQAccordionItem
              key={index}
              index={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openFaqIndex === index}
              onToggle={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </section>

      {/* ════════════════ 7. ABOUT SECTION ════════════════ */}
      <section id="about" className="bg-[#3D0A17] text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative overflow-hidden scroll-mt-20">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-wine/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-custom mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="inline-block px-8 py-2 rounded-full bg-white/10 text-white font-heading text-2xl sm:text-3xl font-bold border border-white/15">
              Why we built Aahvaaan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Monogram "A" inside Gold Arch */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-t-[140px] rounded-b-3xl overflow-hidden border-2 border-gold/70 shadow-2xl bg-gradient-to-b from-[#512D38] to-[#1E050D] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-gold/60 flex items-center justify-center mb-4 bg-white/5 shadow-inner">
                  <span className="font-heading text-5xl font-bold text-gold-light">आ</span>
                </div>
                <span className="font-heading text-xl font-bold tracking-wider text-white">
                  Aahvaaan
                </span>
                <span className="text-xs text-gold-light uppercase tracking-widest mt-1 font-semibold">
                  By Vow &amp; Vision
                </span>
              </div>
            </div>

            {/* Right Column: Original Story Copy */}
            <div className="md:col-span-7 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 text-gold-light text-[13px] font-semibold uppercase tracking-wider">
                <Sparkles size={12} className="text-gold" />
                <span>Our story</span>
              </div>

              <p className="font-body text-[15px] sm:text-base text-white/90 leading-relaxed">
                Wedding cards are a beautiful tradition, but sending them to hundreds of people is not. Aahvaaan keeps the warmth of a hand-delivered card and removes the chaos: one link, a personal touch for the people who matter most, and one place to see who is coming.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-[13px] sm:text-sm text-gold-light">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-gold" />
                  <span>Made for Indian Weddings</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-gold" />
                  <span>Shared via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 8. CONTACT SECTION ════════════════ */}
      <section id="contact" className="py-16 pb-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-wine tracking-tight mb-2">
            Planning a wedding? Tell us about it.
          </h2>
          <p className="font-body text-[15px] sm:text-base text-charcoal/75 max-w-md mx-auto mt-2">
            Share your date and city and we'll reply within a day.
          </p>
        </div>

        <div className="bg-[#FAF4EE] rounded-[36px] p-6 sm:p-10 border border-champagne/70 shadow-xs max-w-2xl mx-auto">
          {contactSubmitted ? (
            <div className="py-8 text-center text-emerald-800">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-2" />
              <h4 className="font-heading text-lg font-bold">Message Received</h4>
              <p className="text-[14px] sm:text-[15px] text-charcoal/70 mt-1">
                Thank you for sharing your details. We will reply within a day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {contactError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {contactError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase font-bold tracking-wider text-wine mb-1.5">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-champagne bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] uppercase font-bold tracking-wider text-wine mb-1.5">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-champagne bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase font-bold tracking-wider text-wine mb-1.5">
                    CITY
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur, Delhi, Mumbai"
                    value={contactForm.city}
                    onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-champagne bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] uppercase font-bold tracking-wider text-wine mb-1.5">
                    WEDDING DATE (OR MONTH)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. November 2027"
                    value={contactForm.weddingDate}
                    onChange={(e) => setContactForm({ ...contactForm, weddingDate: e.target.value })}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-champagne bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] uppercase font-bold tracking-wider text-wine mb-1.5">
                  MESSAGE (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your wedding plans or any questions..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-champagne bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 min-h-[44px] rounded-full bg-gradient-to-r from-wine to-[#9E2A47] hover:from-[#9E2A47] hover:to-wine text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center cursor-pointer"
                >
                  Send details
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ─── Sticky Bottom Mobile CTA (Phase 3 + Cleanup Requirement B.5) ─── */}
      <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-champagne/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3 md:hidden">
        <div className="flex flex-col pl-1">
          <span className="font-heading text-xs font-bold text-wine leading-tight">Mor Pankh · № 01</span>
          <span className="text-[11px] text-charcoal/60 leading-none">Royal interactive invitation</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi, I'd like to know more about Aahvaaan")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="min-h-[44px] min-w-[44px] px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.588-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.072-.489-1.503-.618-2.457-2.148-2.532-2.247-.075-.1-1.008-1.341-1.008-2.557 0-1.216.638-1.815.864-2.062.226-.247.494-.309.658-.309.165 0 .33.002.474.009.153.007.357-.058.558.423.208.498.71 1.733.772 1.859.062.125.103.272.021.436-.083.164-.124.267-.247.411-.124.144-.26.321-.372.431-.124.123-.253.257-.109.504.144.247.64 1.056 1.372 1.708.943.839 1.739 1.098 1.986 1.221.247.124.391.103.535-.062.144-.165.618-.72.783-.967.165-.247.33-.206.556-.124.226.083 1.44.679 1.687.803.247.123.412.185.474.288.062.103.062.6-.082 1.005z"/>
            </svg>
          </a>
          <Link
            to="/templates/mor-pankh"
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-gradient-to-r from-wine via-[#6B3D4A] to-[#8C3A50] hover:brightness-110 active:scale-95 text-white font-body font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md border border-[#B69A70]/50"
          >
            <span>Preview Mor Pankh</span>
            <ChevronRight size={14} className="text-gold-light" />
          </Link>
        </div>
      </div>
    </div>
  );
}
