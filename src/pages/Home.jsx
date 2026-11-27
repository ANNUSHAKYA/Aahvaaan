import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, MapPin, Users, Calendar, Edit3, Sparkles,
  ChevronRight, Plus, Minus, Send, CheckCircle2, Music,
  Clock, ShieldCheck, Heart, Share2, Eye
} from 'lucide-react';
import templates from '../data/templates';
import config from '../data/config';
import SEO from '../components/SEO';
import { checkRateLimit, recordRateLimitAction } from '../utils/rateLimiter';
import InteractiveDiyaHook from '../components/home/InteractiveDiyaHook';

// ─── FAQ Accordion Item Component ───
function FAQAccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div
      className={`border border-champagne/80 transition-all duration-300 overflow-hidden bg-white shadow-2xs ${
        isOpen ? 'rounded-3xl bg-[#FFFBF7]' : 'rounded-full hover:border-wine/40'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-4 px-6 sm:px-8 flex items-center justify-between text-left gap-4 font-body text-xs sm:text-sm font-semibold text-wine hover:text-gold transition-colors"
      >
        <span>{question}</span>
        <span className="w-6 h-6 rounded-full bg-champagne/30 text-wine flex items-center justify-center shrink-0">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden px-6 sm:px-8 pb-5 text-xs text-charcoal/80 leading-relaxed border-t border-champagne/30 pt-3"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState(null);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactError(null);
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    // Rate limit: max 3 submissions per 15 minutes
    const rl = checkRateLimit('contact_form', 3, 15);
    if (!rl.allowed) {
      setContactError(rl.error);
      return;
    }

    recordRateLimitAction('contact_form');
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: 'Can I edit my invitation after it is published?',
      a: 'Yes. You can save Draft changes as often as you like, and push those changes live up to 3 times within your 6-month active window. Live changes reflect instantly for all guest links without resharing.',
    },
    {
      q: 'What do I get with every invitation?',
      a: 'You get your chosen invitation template, a common shareable link for everyone, 5 free personalized guest invitations, instant RSVP tracking with dietary breakdown, Google Maps directions, calendar reminders, background music, and 3 live updates valid for 6 months.',
    },
    {
      q: 'How do the 4 signature collections differ?',
      a: 'Each collection is crafted around a specific celebration aesthetic: Champagne & Rose (delicate romantic florals and antique gold), Sage & Ivory (organic botanicals and calming sage), Royal Maroon & Gold (grand Rajasthani palace heritage and damask motifs), and Blush & Lavender (ethereal pastels and dreamy layered cards).',
    },
    {
      q: 'Can guests RSVP from both common and personalized links?',
      a: 'Yes! On the common link, guests enter their name and phone to submit their RSVP. On personalized links, the invitation already knows the guest by name, greets them warmly, and lets them reply or update their response in one tap.',
    },
    {
      q: 'What if I need more than 5 personalized guest links?',
      a: 'You can upgrade your guest limit anytime directly from your dashboard with add-on tiers for 25, 50, 100, or unlimited guests.',
    },
    {
      q: 'Can I track live views and who opened their invitation?',
      a: 'Yes! Your host dashboard tracks total page views, unique visitors, device breakdown (mobile vs desktop), and shows exactly which personalized guests have opened their invitation.',
    },
    {
      q: 'How long will my invitation remain viewable?',
      a: 'Your invitation remains viewable online indefinitely as a cherished memory. Live updates and editing are supported for 6 months from publishing.',
    },
    {
      q: 'Why choose Aahvaaan over static PDFs or video cards?',
      a: 'Unlike static PDFs or video files, Aahvaaan gives your guests an interactive website with music, live countdown, Google Maps navigation, calendar downloads, and instant RSVP tracking for you.',
    },
  ];

  return (
    <div className="bg-ivory min-h-screen font-body overflow-x-hidden">
      <SEO
        title="Aahvaaan | Luxury Digital Wedding Invitations by Vow & Vision"
        description="Four signature Indian wedding collections with personalized envelope reveals, live RSVP tracking, and Google Maps directions."
      />
      {/* ════════════════ 1. 3D HERO SECTION (BALCONY PALACE ARCH STYLE) ════════════════ */}
      <section className="bg-gradient-to-b from-[#18030B] via-[#2D0B16] to-[#512D38] text-white pt-24 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 relative overflow-hidden">
        {/* Soft 3D ambient glows */}
        <div className="absolute top-1/4 left-5 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#8C3A50]/25 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
        <div className="absolute bottom-5 right-5 sm:right-10 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#B69A70]/20 rounded-full blur-[110px] sm:blur-[150px] pointer-events-none" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-40 bg-gold/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content (Balcony typography & layout) */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-5 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold/40 text-gold-light text-xs font-semibold tracking-wider uppercase shadow-xs"
              >
                <Sparkles size={13} className="text-gold animate-pulse" />
                <span>Bespoke Digital Invitations</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-3xl xs:text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.12] tracking-tight"
              >
                Make your first impression unforgettable.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-heading text-xl sm:text-2xl lg:text-3xl text-gold-light/95 font-normal tracking-wide"
              >
                Wedding Invitations
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="font-body text-xs sm:text-sm text-white/85 leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Ditch static PDFs and video files. Give your guests an interactive celebration website with personalized envelope reveals, live countdown, Google Maps navigation, background wedding music, and instant WhatsApp RSVPs.
              </motion.p>

              {/* Action Buttons: Pill styled like Balcony reference */}
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
                  <span>View templates</span>
                  <ArrowRight size={16} className="text-gold-light" />
                </Link>

                <Link
                  to="/invitations"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-gold/40 text-gold-light hover:bg-white/10 active:scale-95 text-xs sm:text-sm font-semibold transition-all backdrop-blur-xs"
                >
                  <span>Explore Collections</span>
                </Link>
              </motion.div>

              {/* ─── INTERACTIVE HERO HOOK: TAP THE DIYAS (COMPACT) ─── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="pt-1"
              >
                <InteractiveDiyaHook />
              </motion.div>

              {/* Trust Metrics Pill */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-xs text-white/75"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-gold font-bold">★★★★★</span>
                  <span className="font-semibold text-white">1,200+</span> Weddings
                </div>
                <span className="hidden xs:inline text-white/40">•</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>5 Free Personal Links</span>
                </div>
                <span className="hidden xs:inline text-white/40">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gold" />
                  <span>3 Live Updates Included</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Architectural Palace Arch Window (Matching Balcony reference) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end items-end relative pt-4 lg:pt-0">
              {/* Outer architectural arch container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] lg:max-w-[460px] mx-auto"
              >
                {/* Backing palace wall shadow depth & warm candlelight glow */}
                <div className="absolute -inset-2.5 rounded-t-[200px] sm:rounded-t-[240px] rounded-b-3xl bg-gradient-to-b from-[#B69A70]/40 via-[#8C3A50]/30 to-transparent blur-xl -z-10" />

                {/* Outer Architectural Palace Trim (Double Frame Effect) */}
                <div className="p-1.5 sm:p-2 rounded-t-[195px] sm:rounded-t-[235px] rounded-b-3xl bg-gradient-to-b from-[#E9D8CC] via-[#B69A70] to-[#512D38] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
                  {/* 3D Palace Architectural Arch Bezel */}
                  <div className="relative rounded-t-[185px] sm:rounded-t-[225px] rounded-b-2xl overflow-hidden border-[4px] sm:border-[6px] border-[#B69A70] bg-[#FAF7F2]">
                    {/* Subtle inner depth shadow for 3D alcove feel */}
                    <div className="absolute inset-0 shadow-[inset_0_20px_35px_rgba(0,0,0,0.55)] pointer-events-none z-20 rounded-t-[180px] sm:rounded-t-[220px]" />

                    {/* Top arch decorative keystone filigree */}
                    <div className="absolute top-2.5 sm:top-3.5 inset-x-0 flex justify-center z-30 pointer-events-none">
                      <span className="bg-[#512D38]/95 text-gold-light border border-gold/60 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-heading px-3.5 sm:px-4 py-1 rounded-full shadow-lg backdrop-blur-md">
                        The Royal Heritage
                      </span>
                    </div>

                    {/* Main Couple Portrait inside the Arch */}
                    <div className="relative aspect-[3/4.4] w-full overflow-hidden bg-wine group">
                      <img
                        src="/hero-couple.jpg"
                        alt="Aahvaaan Royal Wedding Couple"
                        className="w-full h-full object-cover object-top filter brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="eager"
                      />

                      {/* Rich gradient at the base for luxury text overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-[#18030B] via-[#512D38]/80 to-transparent z-10 pointer-events-none" />

                      {/* Bottom Royal Names & Tagline */}
                      <div className="absolute bottom-3.5 sm:bottom-5 inset-x-0 text-center z-20 text-white px-3 sm:px-4">
                        <p className="text-gold-light text-[10px] sm:text-[11px] font-heading tracking-[0.2em] uppercase font-medium">
                          || श्री गणेशाय नमः ||
                        </p>
                        <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide text-white drop-shadow-lg leading-tight mt-0.5">
                          Ananya &amp; Kabir
                        </h3>
                        <p className="text-[11px] sm:text-xs text-champagne/90 font-light mt-0.5 sm:mt-1">
                          Interactive Celebration Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Live Badge (Left side) - carefully tuned for mobile screens */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-2 -left-2 sm:-top-3 sm:-left-6 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-2.5 px-2.5 sm:px-3.5 shadow-xl border border-gold/50 flex items-center gap-2 sm:gap-2.5 z-40 text-charcoal"
                >
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-wine block leading-none">
                      Live RSVP Active
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-charcoal/70">
                      Sharma Family • Attending (3)
                    </span>
                  </div>
                </motion.div>

                {/* Floating Personal Link Badge (Right side) - carefully tuned for mobile screens */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-6 bg-gradient-to-r from-wine to-[#8C3A50] text-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 px-3 sm:px-4 shadow-xl border border-gold/50 flex items-center gap-2 sm:gap-2.5 z-40"
                >
                  <span className="text-sm sm:text-base select-none">💌</span>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold block leading-none text-gold-light">
                      Personal Link
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-white/85">
                      aahvaaan.com/invite/kabir-ananya
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 2. 4 SIGNATURE COLLECTIONS ════════════════ */}
      <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine/10 text-wine text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles size={13} className="text-gold" />
            <span>The Royal Collection</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-3">
            Mor Pankh · № 01
          </h2>
          <p className="font-body text-xs sm:text-sm text-charcoal/65 max-w-xl mx-auto">
            Every celebration deserves a majestic beginning. Experience our signature royal interactive wedding invitation featuring 3D arch gate opening, live music, and personalized guest reveals.
          </p>
        </div>

        {/* Featured Template Card */}
        <div className="max-w-2xl mx-auto">
          {templates.map((tmpl, index) => (
            <Link
              key={tmpl.id}
              to={`/invitations/${tmpl.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-champagne/70 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group relative"
            >
              {/* Preview Graphic (16:10) */}
              <div className="aspect-[16/10] overflow-hidden bg-ivory relative border-b border-champagne/40">
                <img
                  src={tmpl.image}
                  alt={tmpl.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Collection Pill */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-champagne/60">
                  <span className="font-heading text-[11px] font-semibold text-wine tracking-wide">
                    {tmpl.collection}
                  </span>
                </div>

                {/* Price Pill */}
                <div className="absolute top-4 right-4 bg-wine text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                  {tmpl.priceDisplay}
                </div>
              </div>

              {/* Card Body Info */}
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

                {/* 5 Signature Colour Swatches */}
                <div className="pt-4 border-t border-champagne/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider">
                      Signature Palette
                    </span>
                    <span className="text-[10px] text-charcoal/40 font-mono">
                      5 Shades
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tmpl.colors.map((c, i) => (
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

        {/* Center CTA Button */}
        <div className="text-center mt-12">
          <Link
            to="/invitations/mor-pankh"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0E4D4F] via-[#235B54] to-[#082D2E] hover:opacity-95 text-white font-body font-semibold text-xs sm:text-sm shadow-md hover:shadow-xl transition-all hover:scale-105"
          >
            <span>Experience Mor Pankh Live</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ════════════════ 3. 3D SHARING COMPARISON SECTION ════════════════ */}
      <section id="sharing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine/10 text-wine text-xs font-semibold tracking-wider uppercase mb-2">
            <span>Seamless WhatsApp Sharing</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-2">
            Two Ways to Share
          </h2>
          <p className="font-body text-xs sm:text-sm text-charcoal/65 max-w-md mx-auto">
            Choose between broadcast-ready common links or warm personalized guest links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Common Link */}
          <div className="bg-[#FAF7F2] rounded-[36px] p-6 sm:p-8 border border-champagne/60 text-center shadow-xs flex flex-col items-center hover:shadow-md transition-shadow">
            <h3 className="font-heading text-2xl font-bold text-wine mb-1">
              Common link
            </h3>
            <p className="font-body text-xs text-charcoal/70 mb-5">
              A single invitation link shared with everyone.
            </p>

            {/* URL Box */}
            <div className="w-full max-w-xs py-2 px-4 rounded-full bg-white border border-champagne text-[11px] font-mono text-charcoal/70 mb-6 truncate shadow-2xs">
              aahvaaan.com/invite/patidar-family-2027
            </div>

            {/* Mockup Phone Frame */}
            <div className="w-60 sm:w-64 aspect-[9/17] bg-slate-900 rounded-[38px] p-2.5 shadow-xl border-2 border-slate-700 relative flex flex-col overflow-hidden">
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-1 z-20" />
              <div className="flex-1 bg-gradient-to-b from-[#FAF7F2] to-[#E9D8CC] rounded-[30px] p-4 flex flex-col items-center justify-center text-center relative border border-champagne/80">
                <span className="font-heading text-[9px] text-wine uppercase tracking-widest mb-1">
                  Wedding Invitation
                </span>
                <p className="font-heading text-xs font-bold text-wine leading-tight mb-2">
                  We cordially invite you to grace the auspicious occasion of our wedding...
                </p>
                <div className="w-8 h-0.5 bg-gold/50 rounded-full" />
              </div>

              {/* Realistic Sticky Note */}
              <div className="absolute bottom-6 right-3 bg-[#FEF08A] text-charcoal/90 p-3 rounded-xl shadow-lg -rotate-3 text-[11px] font-semibold max-w-[130px] leading-tight border border-amber-300">
                Best for quick and bulk sharing.
              </div>
            </div>
          </div>

          {/* Card 2: Personalized Link */}
          <div className="bg-[#FAF7F2] rounded-[36px] p-6 sm:p-8 border border-champagne/60 text-center shadow-xs flex flex-col items-center hover:shadow-md transition-shadow">
            <h3 className="font-heading text-2xl font-bold text-wine mb-1">
              Personalized link
            </h3>
            <p className="font-body text-xs text-charcoal/70 mb-5">
              Every guest receives a personal greeting.
            </p>

            {/* URL Box */}
            <div className="w-full max-w-xs py-2 px-4 rounded-full bg-white border border-champagne text-[11px] font-mono text-charcoal/70 mb-6 truncate shadow-2xs">
              aahvaaan.com/invite/r/mrsharma&family123
            </div>

            {/* Mockup Phone Frame */}
            <div className="w-60 sm:w-64 aspect-[9/17] bg-slate-900 rounded-[38px] p-2.5 shadow-xl border-2 border-slate-700 relative flex flex-col overflow-hidden">
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-1 z-20" />
              <div className="flex-1 bg-gradient-to-b from-[#FAF7F2] to-[#E9D8CC] rounded-[30px] p-4 flex flex-col items-center justify-center text-center relative border border-champagne/80">
                <span className="font-heading text-xs sm:text-sm font-bold text-wine mb-1">
                  Mr. Sharma and Family
                </span>
                <p className="font-body text-[10px] text-charcoal/70 leading-tight mb-2">
                  We warmly invite you to grace the auspicious celebrations of our family...
                </p>
                <div className="w-8 h-0.5 bg-gold/50 rounded-full" />
              </div>

              {/* Realistic Sticky Note */}
              <div className="absolute bottom-6 right-3 bg-[#FEF08A] text-charcoal/90 p-3 rounded-xl shadow-lg rotate-2 text-[11px] font-semibold max-w-[140px] leading-tight border border-amber-300">
                Best if you want to make guests feel personally invited.
              </div>
            </div>
          </div>
        </div>

        {/* ─── "With every invitation, you get" & Live Updates ─── */}
        <div className="max-w-5xl mx-auto space-y-6 mt-12">
          {/* Top Inclusions Card */}
          <div className="bg-[#FAF7F2] rounded-[28px] p-8 sm:p-10 border border-champagne text-center shadow-xs">
            <h4 className="font-heading text-2xl sm:text-3xl font-bold text-wine mb-4">
              With every invitation, you get
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-base sm:text-lg font-semibold text-charcoal">
              <span className="font-bold text-wine">Common link</span>
              <span className="text-gold font-bold text-xl">+</span>
              <span className="font-bold text-wine">5 personalized guest links free</span>
            </div>
            <p className="text-xs text-charcoal/60 mt-2">
              (You can increase the number of guests anytime by purchasing.)
            </p>
          </div>

          {/* Bottom Live Updates Banner */}
          <div className="bg-gradient-to-br from-[#512D38] via-[#6B3D4A] to-[#3D1E28] text-white rounded-[28px] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden border border-[#B69A70]/30">
            {/* Ambient gold & rose glow highlights */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B69A70]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#C99191]/15 rounded-full blur-3xl pointer-events-none" />

            <h4 className="font-heading text-2xl sm:text-3xl font-bold mb-3 tracking-tight relative z-10 text-white">
              Your guests always see the latest details.
            </h4>
            <p className="font-body text-xs sm:text-sm text-white/85 max-w-xl mx-auto leading-relaxed mb-6 relative z-10">
              Change your mind about the venue? Caught a typo? Update your invitation and every guest link reflects it instantly. No resharing needed.
            </p>
            <p className="font-body text-sm sm:text-base text-white/95 relative z-10">
              Up to <span className="text-[#B69A70] font-bold text-2xl sm:text-3xl mx-1 font-heading">3</span> updates within <span className="text-[#B69A70] font-bold text-2xl sm:text-3xl mx-1 font-heading">6</span> months of going live
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ 4. 3D FEATURES SECTION ════════════════ */}
      <section id="features" className="bg-[#512D38] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient atmospheric warm gold & rose glows */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#B69A70]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#C99191]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header Badge */}
          <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-20 bg-white/10 blur-2xl rounded-full pointer-events-none" />
            <span className="inline-block px-10 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white font-heading text-3xl sm:text-4xl font-bold tracking-tight shadow-inner border border-white/15">
              Features
            </span>
          </div>

          {/* Row 1: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Instant Directions */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Antique Gold Glow Pin Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5 relative group">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <MapPin size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                Instant Directions
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Guests can open the venue location and get directions in a single tap.
              </p>
            </div>

            {/* Card 2: RSVP Tracking */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Antique Gold Glow Users Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5 relative">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Users size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                RSVP Tracking
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Collect guest responses effortlessly and know who's attending.
              </p>
            </div>

            {/* Card 3: Add to Calendar */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Antique Gold Glow Calendar Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5 relative">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Calendar size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                Add to Calendar
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Add the event to guests' calendars instantly - Google, Apple or Outlook.
              </p>
            </div>
          </div>

          {/* Row 2: 2 Centered Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            {/* Card 4: Live Updates */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Antique Gold Glow Edit Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5 relative">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Edit3 size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                Live Updates
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Update event details anytime, and changes reflect instantly for all guests.
              </p>
            </div>

            {/* Card 5: Interactive Experience */}
            <div className="bg-[#FAF7F2] rounded-[28px] p-8 text-charcoal shadow-2xl border border-champagne text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Antique Gold Glow Sparkle Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B69A70]/20 to-[#512D38]/10 flex items-center justify-center mb-5 relative">
                <div className="w-11 h-11 rounded-xl border-2 border-[#B69A70] flex items-center justify-center shadow-[0_0_15px_rgba(182,154,112,0.3)] bg-white">
                  <Sparkles size={22} className="text-[#512D38] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-wine mb-2">
                Interactive Experience
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                More than a static invitation - an engaging experience guests can interact with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 5. ABOUT US SECTION ════════════════ */}
      <section id="about" className="bg-[#3D0A17] text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative overflow-hidden">
        {/* Subtle background ambient glows */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-wine/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-custom mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-8 py-2 rounded-full bg-white/10 text-white font-heading text-2xl sm:text-3xl font-bold border border-white/15">
              About us
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Royal Couple Portrait Arched Card */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-t-[140px] rounded-b-3xl overflow-hidden border-2 border-gold/60 shadow-2xl bg-[#512D38]">
                <img
                  src="/hero-couple.jpg"
                  alt="Aahvaaan Royal Wedding Inspiration"
                  className="w-full h-full object-cover object-top filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#512D38]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 inset-x-0 text-center text-white px-4">
                  <span className="font-heading text-base font-bold tracking-wider block drop-shadow-md">
                    Vow &amp; Vision
                  </span>
                  <span className="text-[10px] text-gold-light uppercase tracking-widest block mt-0.5">
                    Crafting Royal Indian Celebrations
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Story Copy */}
            <div className="md:col-span-7 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-light text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={12} className="text-gold" />
                <span>Our Heritage &amp; Promise</span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-light leading-tight">
                Invitations made simple. Celebrations made special.
              </h3>

              <p className="font-body text-xs sm:text-sm text-white/80 leading-relaxed">
                At Aahvaaan by Vow &amp; Vision, we create luxury digital wedding invitations that honour timeless Indian traditions while delivering effortless modern convenience. From creating personalized envelopes for family elders to monitoring live guest RSVPs, everything comes together in one elegant, thoughtful experience so you can spend less time managing invitations and more time celebrating.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gold-light">
                <div className="flex items-center gap-1.5">
                  <Heart size={14} className="text-rose" />
                  <span>Handcrafted for Indian Traditions</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>Personalized &amp; Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 6. FAQS SECTION ════════════════ */}
      <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-8 py-2.5 rounded-full bg-wine/10 text-wine font-heading text-2xl sm:text-3xl font-bold">
            FAQs
          </span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQAccordionItem
              key={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openFaqIndex === index}
              onToggle={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </section>

      {/* ════════════════ 7. GET IN TOUCH (CONTACT) SECTION ════════════════ */}
      <section id="contact" className="py-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-8 py-2 rounded-full bg-wine/10 text-wine font-heading text-2xl sm:text-3xl font-bold">
            Get in touch
          </span>
          <p className="font-body text-xs text-charcoal/65 max-w-md mx-auto mt-3">
            Questions about a template, an order, or an invitation you're working on? Send us a note and we'll get back to you by email.
          </p>
        </div>

        <div className="bg-[#FAF4EE] rounded-[36px] p-6 sm:p-10 border border-champagne/70 shadow-xs max-w-2xl mx-auto">
          {contactSubmitted ? (
            <div className="py-8 text-center text-emerald-800">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-2" />
              <h4 className="font-heading text-lg font-bold">Message Sent!</h4>
              <p className="text-xs text-charcoal/70 mt-1">
                Thank you for reaching out. We will get back to you shortly.
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

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-wine mb-1.5">
                  SUBJECT (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-wine mb-1.5">
                  MESSAGE
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you need help with..."
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
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
