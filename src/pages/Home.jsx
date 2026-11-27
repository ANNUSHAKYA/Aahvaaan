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
      {/* ════════════════ 1. 3D HERO SECTION ════════════════ */}
      <section className="bg-gradient-to-br from-[#1A030A] via-[#3D0A17] to-[#6B1D2F] text-white pt-28 sm:pt-36 pb-20 sm:pb-28 relative overflow-hidden">
        {/* Soft 3D ambient glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-wine/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-wine/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold/40 text-gold-light text-xs font-semibold tracking-wider uppercase"
              >
                <Sparkles size={13} className="text-gold" />
                <span>Bespoke Digital Wedding Invitations</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl lg:text-[4rem] font-bold text-white leading-[1.12] tracking-tight"
              >
                Make your first impression unforgettable.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-heading text-xl sm:text-2xl text-gold-light/95 pt-1 font-light"
              >
                Four signature collections crafted for Indian royalty.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="font-body text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Ditch static PDFs and video files. Give your guests an interactive celebration website with personalized envelope reveals, live countdown, Google Maps navigation, background wedding music, and instant WhatsApp RSVPs.
              </motion.p>

              {/* ─── INTERACTIVE HERO HOOK: TAP THE DIYAS (MOBILE-FIRST) ─── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="pt-2 pb-1"
              >
                <InteractiveDiyaHook />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                <Link
                  to="/invitations"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-wine to-[#9E2A47] hover:from-[#9E2A47] hover:to-wine text-white font-body font-semibold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span>Explore 4 Collections</span>
                  <ArrowRight size={16} />
                </Link>

                <a
                  href="#templates"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-gold/40 text-gold-light hover:bg-white/10 text-xs sm:text-sm font-semibold transition-all backdrop-blur-xs"
                >
                  <span>View designs</span>
                </a>
              </motion.div>

              {/* Trust Metrics Pill */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-white/70"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-gold font-bold">★★★★★</span>
                  <span className="font-semibold text-white">1,200+</span> Weddings
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>5 Free Personal Links</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gold" />
                  <span>3 Live Updates Included</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: 3D Perspective Device & Card Showcase (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center perspective-1000">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] preserve-3d">
                {/* ─── Layer 1: Background 3D Tilted Card ─── */}
                <motion.div
                  initial={{ opacity: 0, rotateY: 10, rotateX: 10 }}
                  animate={{ opacity: 1, rotateY: -8, rotateX: 6, z: -30 }}
                  transition={{ duration: 0.8 }}
                  className="absolute -top-6 -right-6 w-full h-[420px] rounded-[36px] bg-gradient-to-br from-[#FAF7F2] via-[#F2ECE2] to-[#E9D8CC] border-2 border-gold/50 shadow-2xl p-5 overflow-hidden hidden sm:block pointer-events-none opacity-85"
                  style={{
                    transform: 'rotateY(-12deg) rotateX(8deg) rotateZ(3deg) translateZ(-40px)',
                  }}
                >
                  <div className="border border-gold/40 h-full rounded-[28px] p-4 flex flex-col justify-between text-charcoal">
                    <div className="text-center pt-2">
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-gold block">
                        THE MAHARAJA COLLECTION
                      </span>
                      <p className="font-heading text-lg font-bold text-wine mt-1">
                        Royal Maroon & Gold
                      </p>
                    </div>
                    <div className="text-center pb-2">
                      <span className="text-xs text-charcoal/60 font-serif italic">
                        || श्री गणेशाय नमः ||
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* ─── Layer 2: Main 3D Tilted Smartphone Mockup ─── */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative w-full aspect-[9/18.5] bg-[#0E0306] rounded-[44px] p-3 shadow-3d-phone border-[3px] border-gold/60 overflow-hidden"
                  style={{
                    transform: 'perspective(1200px) rotateY(-10deg) rotateX(6deg) rotateZ(-1deg)',
                  }}
                >
                  {/* Dynamic Island Notch */}
                  <div className="w-24 h-5 bg-black rounded-full mx-auto mb-2 z-30 relative shadow-inner" />

                  {/* Smartphone Screen Content */}
                  <div className="h-[calc(100%-28px)] rounded-[34px] overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#E9D8CC] p-4 flex flex-col justify-between text-center relative border border-champagne/80 shadow-inner">
                    {/* Top Gold Corner Filigree */}
                    <div className="absolute top-2 left-2 text-[10px] text-gold opacity-60">✦</div>
                    <div className="absolute top-2 right-2 text-[10px] text-gold opacity-60">✦</div>

                    {/* Header */}
                    <div className="pt-2">
                      <span className="text-[9px] font-heading tracking-[0.25em] text-gold uppercase block font-bold mb-1">
                        THE ROMANCE COLLECTION
                      </span>
                      <span className="text-[10px] text-charcoal/70 font-serif italic block">
                        || वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ||
                      </span>
                    </div>

                    {/* Couple Names & Invitation Body */}
                    <div className="my-auto py-2">
                      <span className="text-[10px] uppercase font-semibold tracking-widest text-charcoal/60 block mb-1">
                        We Joyfully Invite You To Celebrate
                      </span>
                      <h2 className="font-heading text-2xl font-bold text-wine leading-tight">
                        Ananya
                      </h2>
                      <div className="font-heading text-base font-bold text-gold my-0.5">
                        &
                      </div>
                      <h2 className="font-heading text-2xl font-bold text-wine leading-tight">
                        Kabir
                      </h2>

                      {/* 3D Wax Seal Badge */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#851C34] to-[#4A0E1C] mx-auto my-3 flex items-center justify-center text-white font-heading font-bold text-sm shadow-md border-2 border-gold/70 relative">
                        <span className="drop-shadow-xs">ॐ</span>
                        <div className="absolute -bottom-1 w-3 h-3 bg-wine rotate-45 border-b border-r border-gold/60" />
                      </div>

                      {/* Wedding Date & Venue */}
                      <p className="font-heading text-xs font-semibold text-charcoal">
                        Sunday, 22 February 2027
                      </p>
                      <p className="font-body text-[10px] text-charcoal/60 mt-0.5">
                        The Oberoi Udaivilas, Udaipur
                      </p>

                      {/* Live Countdown Pills */}
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        <div className="bg-white/80 border border-champagne px-2 py-1 rounded-md shadow-2xs">
                          <span className="text-[10px] font-bold text-wine block leading-none">248</span>
                          <span className="text-[7px] text-charcoal/50 uppercase block">Days</span>
                        </div>
                        <div className="bg-white/80 border border-champagne px-2 py-1 rounded-md shadow-2xs">
                          <span className="text-[10px] font-bold text-wine block leading-none">14</span>
                          <span className="text-[7px] text-charcoal/50 uppercase block">Hours</span>
                        </div>
                        <div className="bg-white/80 border border-champagne px-2 py-1 rounded-md shadow-2xs">
                          <span className="text-[10px] font-bold text-wine block leading-none">32</span>
                          <span className="text-[7px] text-charcoal/50 uppercase block">Mins</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Mockup */}
                    <div className="pt-2">
                      <div className="w-full py-2 rounded-full bg-wine text-white text-[11px] font-semibold tracking-wide shadow-xs flex items-center justify-center gap-1">
                        <span>RSVP & View Schedule</span>
                        <ChevronRight size={13} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ─── Layer 3: Floating 3D Micro-Widgets ─── */}
                {/* Floating Top-Left Pill: Live RSVP Notification */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 px-3.5 shadow-xl border border-gold/40 flex items-center gap-2.5 z-40 text-charcoal"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-wine block leading-none">
                      Live RSVP Received
                    </span>
                    <span className="text-[9px] text-charcoal/60">
                      Sharma Family • Attending (3)
                    </span>
                  </div>
                </motion.div>

                {/* Floating Bottom-Right Pill: Personalized Envelope View */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -right-2 sm:-right-6 bg-gradient-to-r from-wine to-[#8B223B] text-white rounded-2xl p-2.5 px-4 shadow-xl border border-gold/40 flex items-center gap-2.5 z-40"
                >
                  <span className="text-base select-none">💌</span>
                  <div>
                    <span className="text-[10px] font-bold block leading-none text-gold-light">
                      Personal Link Opened
                    </span>
                    <span className="text-[9px] text-white/80">
                      Personalized Guest Greeting Active
                    </span>
                  </div>
                </motion.div>
              </div>
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
              <span className="font-bold text-[#8A4A28]">Common link</span>
              <span className="text-[#D97706] font-bold text-xl">+</span>
              <span className="font-bold text-[#8A4A28]">5 personalized guest links free</span>
            </div>
            <p className="text-xs text-charcoal/60 mt-2">
              (You can increase the number of guests anytime by purchasing.)
            </p>
          </div>

          {/* Bottom Live Updates Banner (Matches Screenshot 2) */}
          <div className="bg-[#5C2D91] text-white rounded-[28px] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <h4 className="font-heading text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
              Your guests always see the latest details.
            </h4>
            <p className="font-body text-xs sm:text-sm text-white/85 max-w-xl mx-auto leading-relaxed mb-6">
              Change your mind about the venue? Caught a typo? Update your invitation and every guest link reflects it instantly. No resharing needed.
            </p>
            <p className="font-body text-sm sm:text-base text-white/95">
              Up to <span className="text-[#F59E0B] font-bold text-2xl sm:text-3xl mx-1">3</span> updates within <span className="text-[#F59E0B] font-bold text-2xl sm:text-3xl mx-1">6</span> months of going live
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ 4. 3D FEATURES SECTION (Exact Screenshot 6 Match) ════════════════ */}
      <section id="features" className="bg-[#2D0A38] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient atmospheric purple glows */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#8B2BE2]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#6B1D4F]/20 rounded-full blur-[140px] pointer-events-none" />

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
            <div className="bg-white rounded-[28px] p-8 text-charcoal shadow-2xl border border-gray-100 text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Neon Glow Pin Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#C026D3]/10 flex items-center justify-center mb-5 relative group">
                <div className="w-11 h-11 rounded-xl border-2 border-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.35)] bg-white">
                  <MapPin size={22} className="text-[#7C3AED] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal mb-2">
                Instant Directions
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Guests can open the venue location and get directions in a single tap.
              </p>
            </div>

            {/* Card 2: RSVP Tracking */}
            <div className="bg-white rounded-[28px] p-8 text-charcoal shadow-2xl border border-gray-100 text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Neon Glow Users Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#C026D3]/10 flex items-center justify-center mb-5 relative">
                <div className="w-11 h-11 rounded-xl border-2 border-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.35)] bg-white">
                  <Users size={22} className="text-[#7C3AED] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal mb-2">
                RSVP Tracking
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Collect guest responses effortlessly and know who's attending.
              </p>
            </div>

            {/* Card 3: Add to Calendar */}
            <div className="bg-white rounded-[28px] p-8 text-charcoal shadow-2xl border border-gray-100 text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Neon Glow Calendar Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#C026D3]/10 flex items-center justify-center mb-5 relative">
                <div className="w-11 h-11 rounded-xl border-2 border-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.35)] bg-white">
                  <Calendar size={22} className="text-[#7C3AED] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal mb-2">
                Add to Calendar
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Add the event to guests' calendars instantly - Google, Apple or Outlook.
              </p>
            </div>
          </div>

          {/* Row 2: 2 Centered Cards (Matches Screenshot 6) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            {/* Card 4: Live Updates */}
            <div className="bg-white rounded-[28px] p-8 text-charcoal shadow-2xl border border-gray-100 text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Neon Glow Edit Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#C026D3]/10 flex items-center justify-center mb-5 relative">
                <div className="w-11 h-11 rounded-xl border-2 border-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.35)] bg-white">
                  <Edit3 size={22} className="text-[#7C3AED] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal mb-2">
                Live Updates
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Update event details anytime, and changes reflect instantly for all guests.
              </p>
            </div>

            {/* Card 5: Interactive Experience */}
            <div className="bg-white rounded-[28px] p-8 text-charcoal shadow-2xl border border-gray-100 text-center flex flex-col items-center hover:-translate-y-1.5 transition-all duration-300">
              {/* 3D Neon Glow Sparkle Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#C026D3]/10 flex items-center justify-center mb-5 relative">
                <div className="w-11 h-11 rounded-xl border-2 border-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.35)] bg-white">
                  <Sparkles size={22} className="text-[#7C3AED] stroke-[2.2]" />
                </div>
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold text-charcoal mb-2">
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
      <section id="about" className="bg-[#3D0C1A] text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="mb-8">
            <span className="inline-block px-8 py-2 rounded-full bg-white/10 text-white font-heading text-2xl sm:text-3xl font-bold">
              About us
            </span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-gold-light mb-3">
            Invitations made simple. Celebrations made special.
          </h3>

          <p className="font-body text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl mx-auto">
            At Aahvaaan by Vow & Vision, we create luxury digital wedding invitations that honour timeless Indian traditions while delivering effortless modern convenience. From creating personalized envelopes for family elders to monitoring live guest RSVPs, everything comes together in one elegant, thoughtful experience so you can spend less time managing invitations and more time celebrating.
          </p>
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
