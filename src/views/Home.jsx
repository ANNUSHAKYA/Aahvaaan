import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import InteractiveDiyaHook from '../components/home/InteractiveDiyaHook';
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
          className="w-full text-left py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 font-heading text-lg sm:text-xl font-bold text-wine hover:text-gold transition-colors cursor-pointer"
        >
          <span>{question}</span>
          <span className="w-7 h-7 rounded-full bg-ivory border border-champagne flex items-center justify-center shrink-0 text-wine">
            {isOpen ? <Minus size={14} /> : <Plus size={14} />}
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
        <p className="font-body text-xs sm:text-sm text-charcoal/80 leading-relaxed pt-1 border-t border-champagne/40">
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
        ? 'Guests open their invitation link on WhatsApp, select their attendance status and dietary preferences, and submit their response instantly.'
        : 'RSVP replies will land directly in your dashboard (Coming soon). In the meantime, guests can tap your WhatsApp button on the invitation to confirm their presence.',
    },
    {
      q: 'Can I add more named links later?',
      a: 'Yes, from the dashboard.',
    },
    {
      q: `What happens after ${siteConfig.updateWindowMonths} months?`,
      a: 'The invitation stays viewable; editing locks.',
    },
    {
      q: 'How is this different from a PDF or video invite?',
      a: 'A static file cannot play background shehnai, guide your guests with Google Maps navigation, or let you update venue changes after sending. Aahvaaan gives your guests an interactive celebration web page that you can update whenever plans shift.',
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
            <div className="lg:col-span-6 text-center lg:text-left space-y-5 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold/40 text-gold-light text-xs font-semibold tracking-wider uppercase shadow-xs"
              >
                <Sparkles size={13} className="text-gold animate-pulse" />
                <span>Digital invitations, made for Indian weddings</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-3xl xs:text-4xl sm:text-5xl lg:text-[3.65rem] font-bold text-white leading-[1.14] tracking-tight"
              >
                Let the celebration begin the moment they open the link.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-body text-xs sm:text-sm text-white/85 leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Aahvaaan turns your wedding card into a living invitation: a diya to light, a greeting by name for every family, music, maps and RSVPs, all in one link made for WhatsApp.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pt-2 flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4"
              >
                <Link
                  to="/templates"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-wine via-[#6B3D4A] to-[#8C3A50] hover:brightness-110 active:scale-95 hover:scale-105 text-white font-body font-semibold text-sm shadow-[0_10px_25px_-5px_rgba(81,45,56,0.6)] border border-[#B69A70]/60 transition-all duration-300"
                >
                  <span>Browse designs</span>
                  <ChevronRight size={16} className="text-gold-light" />
                </Link>

                <a
                  href="#diya-reveal"
                  onClick={handleScrollToSection('diya-reveal')}
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-gold/40 text-gold-light hover:bg-white/10 active:scale-95 text-xs sm:text-sm font-semibold transition-all backdrop-blur-xs cursor-pointer"
                >
                  <span>Try the diya reveal</span>
                </a>
              </motion.div>

              {/* ─── INTERACTIVE HERO HOOK: TAP THE DIYAS ─── */}
              <motion.div
                id="diya-reveal"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="pt-1 scroll-mt-24"
              >
                <InteractiveDiyaHook />
              </motion.div>

              {/* Honest Chips (Zero fake stats) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs text-white/85"
              >
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  No app needed for guests
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  Built for WhatsApp sharing
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  Edit after you share
                </div>
              </motion.div>
            </div>

            {/* Right Column: Architectural Palace Arch Window */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end items-end relative pt-4 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] lg:max-w-[460px] mx-auto"
              >
                {/* Backing palace wall shadow depth */}
                <div className="absolute -inset-2.5 rounded-t-[200px] sm:rounded-t-[240px] rounded-b-3xl bg-gradient-to-b from-[#B69A70]/40 via-[#8C3A50]/30 to-transparent blur-xl -z-10" />

                {/* Outer Architectural Palace Trim */}
                <div className="p-1.5 sm:p-2 rounded-t-[195px] sm:rounded-t-[235px] rounded-b-3xl bg-gradient-to-b from-[#E9D8CC] via-[#B69A70] to-[#512D38] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
                  <div className="relative rounded-t-[185px] sm:rounded-t-[225px] rounded-b-2xl overflow-hidden border-[4px] sm:border-[6px] border-[#B69A70] bg-[#FAF7F2]">
                    <div className="absolute inset-0 shadow-[inset_0_20px_35px_rgba(0,0,0,0.55)] pointer-events-none z-20 rounded-t-[180px] sm:rounded-t-[220px]" />

                    {/* Top arch keystone */}
                    <div className="absolute top-2.5 sm:top-3.5 inset-x-0 flex justify-center z-30 pointer-events-none">
                      <span className="bg-[#512D38]/95 text-gold-light border border-gold/60 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-heading px-3.5 sm:px-4 py-1 rounded-full shadow-lg backdrop-blur-md">
                        Mor Pankh · Sample Design
                      </span>
                    </div>

                    {/* Main Couple Portrait inside the Arch */}
                    <div className="relative aspect-[3/4.4] w-full overflow-hidden bg-wine group">
                      <img
                        src="/hero-couple.jpg"
                        alt="Ananya & Kabir Wedding Invitation Sample"
                        className="w-full h-full object-cover object-top filter brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="eager"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-[#18030B] via-[#512D38]/80 to-transparent z-10 pointer-events-none" />

                      {/* Bottom Royal Names & Fictional Venue */}
                      <div className="absolute bottom-3.5 sm:bottom-5 inset-x-0 text-center z-20 text-white px-3 sm:px-4">
                        <p className="text-gold-light text-[10px] sm:text-[11px] font-heading tracking-[0.2em] uppercase font-medium">
                          || श्री गणेशाय नमः ||
                        </p>
                        <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide text-white drop-shadow-lg leading-tight mt-0.5">
                          Ananya &amp; Kabir
                        </h3>
                        <p className="text-[11px] sm:text-xs text-champagne/90 font-light mt-0.5 sm:mt-1">
                          Rajmahal Gardens, Jaipur (sample)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card Left: Sample RSVP */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-2 -left-2 sm:-top-3 sm:-left-6 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-2.5 px-2.5 sm:px-3.5 shadow-xl border border-gold/50 flex items-center gap-2 sm:gap-2.5 z-40 text-charcoal"
                >
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-wine block leading-none">
                      Sample RSVP
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-charcoal/70">
                      Sharma Family • Attending (3)
                    </span>
                  </div>
                </motion.div>

                {/* Floating Card Right: Sample Link */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-6 bg-gradient-to-r from-wine to-[#8C3A50] text-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 px-3 sm:px-4 shadow-xl border border-gold/50 flex items-center gap-2 sm:gap-2.5 z-40"
                >
                  <span className="text-sm sm:text-base select-none">💌</span>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold block leading-none text-gold-light">
                      Sample link
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-white/85">
                      aahvaaan.com/n/sharma-family-sample
                    </span>
                  </div>
                </motion.div>
              </motion.div>
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
          <p className="font-body text-xs sm:text-sm text-charcoal/65 max-w-xl mx-auto">
            Our signature interactive wedding invitation featuring 3D arch gates, ceremony schedule, wedding music, and personal family envelopes.
          </p>
        </div>

        {/* Featured Template Card */}
        <div className="max-w-2xl mx-auto">
          {templates.map((tmpl) => (
            <Link
              key={tmpl.id}
              to={`/invitations/${tmpl.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-champagne/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group relative"
            >
              <div className="aspect-[16/10] overflow-hidden bg-ivory relative border-b border-champagne/40">
                <img
                  src={tmpl.image}
                  alt={tmpl.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-champagne/60">
                  <span className="font-heading text-[11px] font-semibold text-wine tracking-wide">
                    {tmpl.collection}
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-wine text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                  {tmpl.priceDisplay}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
                    {tmpl.category}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-wine group-hover:text-gold transition-colors mb-2">
                    {tmpl.name}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-5">
                    {tmpl.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-champagne/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider">
                      Palette Options
                    </span>
                    <span className="text-[10px] text-charcoal/40 font-mono">
                      {tmpl.colors?.length || 4} Shades
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tmpl.colors?.map((c, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-champagne shadow-2xs hover:scale-125 transition-transform cursor-pointer"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.hex})`}
                      />
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-champagne/30 flex items-center justify-between">
                    <span className="text-xs font-semibold text-wine group-hover:text-gold transition-colors">
                      Customize this design
                    </span>
                    <span className="w-8 h-8 rounded-full bg-ivory text-wine group-hover:bg-wine group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0E4D4F] via-[#235B54] to-[#082D2E] hover:opacity-95 text-white font-body font-semibold text-xs sm:text-sm shadow-md hover:shadow-xl transition-all hover:scale-105"
          >
            <span>Browse all designs</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ════════════════ 3. SHARING SECTION (#send) ════════════════ */}
      <section id="send" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine/10 text-wine text-xs font-semibold tracking-wider uppercase mb-2">
            <span>WhatsApp Sharing</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-2">
            One invitation, two ways to send it
          </h2>
          <p className="font-body text-xs sm:text-sm text-charcoal/65 max-w-md mx-auto">
            Reach the whole family at once, or greet each household by name.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Open link */}
          <div className="bg-[#FAF7F2] rounded-[36px] p-6 sm:p-8 border border-champagne/60 text-center shadow-xs flex flex-col items-center hover:shadow-md transition-shadow">
            <h3 className="font-heading text-2xl font-bold text-wine mb-1">
              Open link
            </h3>
            <p className="font-body text-xs text-charcoal/70 mb-5 max-w-xs">
              One link for your entire guest list. Drop it into family groups and let everyone in.
            </p>

            {/* URL Box */}
            <div className="w-full max-w-xs py-2 px-4 rounded-full bg-white border border-champagne text-[11px] font-mono text-charcoal/70 mb-6 truncate shadow-2xs">
              aahvaaan.com/i/sample
            </div>

            {/* Mockup Phone Frame with Royal Arch Lotus Background */}
            <div className="w-60 sm:w-64 aspect-[9/17] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl border-2 border-slate-700 relative flex flex-col overflow-hidden">
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-1 z-30" />
              <div className="flex-1 rounded-[32px] overflow-hidden relative flex flex-col items-center justify-between p-4 text-center border border-gold/40 shadow-inner">
                <img
                  src="/invitation-frame.jpg"
                  alt="Royal Wedding Frame"
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#3D0A17]/25 pointer-events-none" />

                <div className="relative z-20 pt-8 sm:pt-10">
                  <span className="text-[10px] text-gold-light font-serif italic block drop-shadow-sm">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  <span className="font-heading text-[8px] sm:text-[9px] text-[#E9D8CC] uppercase tracking-[0.25em] font-semibold block mt-0.5">
                    Wedding Invitation
                  </span>
                </div>

                <div className="relative z-20 my-auto px-2 max-w-[200px]">
                  <p className="font-petit text-xl sm:text-2xl text-white drop-shadow-md leading-tight">
                    Kabir &amp; Ananya
                  </p>
                  <div className="w-6 h-0.5 bg-gold/70 rounded-full mx-auto my-1.5" />
                  <p className="font-body text-[10px] text-[#FAF7F2]/90 leading-tight drop-shadow-xs">
                    Cordially invite you &amp; family to celebrate our holy union
                  </p>
                  <p className="font-heading text-[9px] text-gold-light mt-1.5 tracking-wider font-semibold">
                    Rajmahal Gardens, Jaipur (sample)
                  </p>
                </div>

                <div className="relative z-20 pb-3 w-full">
                  <div className="py-1 px-3 rounded-full bg-wine/85 backdrop-blur-xs border border-gold/50 text-gold-light text-[9px] font-semibold uppercase tracking-wider shadow-sm">
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
            <p className="font-body text-xs text-charcoal/70 mb-5 max-w-xs">
              A link made for one household. When it opens, the envelope greets them by name.
            </p>

            {/* URL Box */}
            <div className="w-full max-w-xs py-2 px-4 rounded-full bg-white border border-champagne text-[11px] font-mono text-charcoal/70 mb-6 truncate shadow-2xs">
              aahvaaan.com/n/sharma-family-sample
            </div>

            {/* Mockup Phone Frame with Royal Arch Lotus Background */}
            <div className="w-60 sm:w-64 aspect-[9/17] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl border-2 border-slate-700 relative flex flex-col overflow-hidden">
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-1 z-30" />
              <div className="flex-1 rounded-[32px] overflow-hidden relative flex flex-col items-center justify-between p-4 text-center border border-gold/40 shadow-inner">
                <img
                  src="/invitation-frame.jpg"
                  alt="Personalized Royal Frame"
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />
                <div className="absolute inset-0 bg-[#3D0A17]/25 pointer-events-none" />

                <div className="relative z-20 pt-8 sm:pt-10">
                  <span className="text-[10px] text-gold-light font-serif italic block drop-shadow-sm">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  <span className="font-heading text-[8px] sm:text-[9px] text-[#E9D8CC] uppercase tracking-[0.25em] font-semibold block mt-0.5">
                    Personalized Envelope
                  </span>
                </div>

                <div className="relative z-20 my-auto px-2 max-w-[200px]">
                  <span className="text-[8px] uppercase tracking-widest text-gold-light font-bold block mb-0.5">
                    Namaste
                  </span>
                  <p className="font-petit text-lg sm:text-xl text-white drop-shadow-md leading-tight">
                    Sharma Family
                  </p>
                  <div className="w-6 h-0.5 bg-gold/70 rounded-full mx-auto my-1.5" />
                  <p className="font-body text-[10px] text-[#FAF7F2]/90 leading-tight drop-shadow-xs">
                    With joyous hearts, we invite you to grace our wedding celebration
                  </p>
                  <p className="font-heading text-[9px] text-gold-light mt-1.5 tracking-wider font-semibold">
                    Rajmahal Gardens, Jaipur (sample)
                  </p>
                </div>

                <div className="relative z-20 pb-3 w-full">
                  <div className="py-1 px-3 rounded-full bg-gradient-to-r from-wine to-[#8C3A50] border border-gold/50 text-gold-light text-[9px] font-semibold uppercase tracking-wider shadow-sm">
                    Open Your Envelope 💌
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── "Every order comes with" & Updates Block ─── */}
        <div className="max-w-5xl mx-auto space-y-6 mt-12">
          {/* Top Inclusions Card */}
          <div className="bg-[#FAF7F2] rounded-[28px] p-8 sm:p-10 border border-champagne text-center shadow-xs">
            <h4 className="font-heading text-2xl sm:text-3xl font-bold text-wine mb-4">
              Every order comes with
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-base sm:text-lg font-semibold text-charcoal">
              <span className="font-bold text-wine">1 open link</span>
              <span className="text-gold font-bold text-xl">+</span>
              <span className="font-bold text-wine">{siteConfig.namedLinksIncluded} named links</span>
            </div>
            <p className="text-xs text-charcoal/70 mt-2 font-medium">
              Need more named links? Add them any time from your dashboard.
            </p>
          </div>

          {/* Bottom Updates Block */}
          <div className="bg-gradient-to-br from-[#512D38] via-[#6B3D4A] to-[#3D1E28] text-white rounded-[28px] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden border border-[#B69A70]/30">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B69A70]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#C99191]/15 rounded-full blur-3xl pointer-events-none" />

            <h4 className="font-heading text-2xl sm:text-3xl font-bold mb-3 tracking-tight relative z-10 text-white">
              Venue changed? Fix it once, everyone sees it.
            </h4>
            <p className="font-body text-xs sm:text-sm text-white/85 max-w-xl mx-auto leading-relaxed mb-6 relative z-10">
              Edit your invitation and every link you've already shared shows the new details. No second round of forwarding.
            </p>
            <p className="font-body text-sm sm:text-base text-white/95 relative z-10">
              <span className="text-[#B69A70] font-bold text-2xl sm:text-3xl mx-1 font-heading">
                {siteConfig.liveUpdatesIncluded}
              </span>{' '}
              live updates, for{' '}
              <span className="text-[#B69A70] font-bold text-2xl sm:text-3xl mx-1 font-heading">
                {siteConfig.updateWindowMonths}
              </span>{' '}
              months after you publish.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ 4. FEATURES SECTION (6 Cards, 3x2 Grid) ════════════════ */}
      <section id="features" className="bg-[#512D38] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#B69A70]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#C99191]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16 relative">
            <span className="inline-block px-10 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white font-heading text-3xl sm:text-4xl font-bold tracking-tight shadow-inner border border-white/15">
              Features
            </span>
          </div>

          {/* 3x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. One-tap Maps */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <MapPin size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                One-tap Maps
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                The venue opens straight in the guest's maps app.
              </p>
            </div>

            {/* 2. RSVP inbox */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300 relative">
              {!siteConfig.features.rsvpInboxLive && (
                <div className="absolute top-4 right-4 bg-gold/20 text-[#512D38] border border-gold/40 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Coming soon
                </div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Users size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                RSVP inbox
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Replies land in one dashboard.
              </p>
            </div>

            {/* 3. Save the date */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Calendar size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                Save the date
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Adds the wedding to Google, Apple or Outlook calendars.
              </p>
            </div>

            {/* 4. Edit after sharing */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Edit3 size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                Edit after sharing
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Update details without resending the link.
              </p>
            </div>

            {/* 5. Diya reveal & music */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Flame size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                Diya reveal &amp; music
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
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
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                Named envelopes
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Each family opens an envelope with their own name on it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 5. ABOUT SECTION ════════════════ */}
      <section id="about" className="bg-[#3D0A17] text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-wine/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-custom mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-8 py-2 rounded-full bg-white/10 text-white font-heading text-2xl sm:text-3xl font-bold border border-white/15">
              Why we built Aahvaaan
            </span>
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
                <span className="text-[11px] text-gold-light uppercase tracking-widest mt-1 font-semibold">
                  By Vow &amp; Vision
                </span>
              </div>
            </div>

            {/* Right Column: Original Story Copy */}
            <div className="md:col-span-7 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-light text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={12} className="text-gold" />
                <span>Our Heritage &amp; Purpose</span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-light leading-tight">
                Why we built Aahvaaan
              </h3>

              <p className="font-body text-xs sm:text-sm text-white/85 leading-relaxed">
                Wedding cards are a beautiful tradition, but sending them to hundreds of people is not. Aahvaaan keeps the warmth of a hand-delivered card and removes the chaos: one link, a personal touch for the people who matter most, and one place to see who is coming.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gold-light">
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

      {/* ════════════════ 6. FAQS SECTION (Always in DOM for SEO) ════════════════ */}
      <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <span className="inline-block px-8 py-2.5 rounded-full bg-wine/10 text-wine font-heading text-2xl sm:text-3xl font-bold">
            Frequently Asked Questions
          </span>
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

      {/* ════════════════ 7. CONTACT SECTION ════════════════ */}
      <section id="contact" className="py-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-wine tracking-tight mb-2">
            Planning a wedding? Tell us about it.
          </h2>
          <p className="font-body text-xs sm:text-sm text-charcoal/70 max-w-md mx-auto mt-2">
            Share your date and city and we'll reply within a day.
          </p>
        </div>

        <div className="bg-[#FAF4EE] rounded-[36px] p-6 sm:p-10 border border-champagne/70 shadow-xs max-w-2xl mx-auto">
          {contactSubmitted ? (
            <div className="py-8 text-center text-emerald-800">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-2" />
              <h4 className="font-heading text-lg font-bold">Message Received</h4>
              <p className="text-xs text-charcoal/70 mt-1">
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
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-wine mb-1.5">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-wine mb-1.5">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-wine mb-1.5">
                    CITY
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur, Delhi, Mumbai"
                    value={contactForm.city}
                    onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-wine mb-1.5">
                    WEDDING DATE (OR MONTH)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. November 2027"
                    value={contactForm.weddingDate}
                    onChange={(e) => setContactForm({ ...contactForm, weddingDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-wine mb-1.5">
                  MESSAGE (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your wedding plans or any questions..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-wine to-[#9E2A47] hover:from-[#9E2A47] hover:to-wine text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  Send details
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
