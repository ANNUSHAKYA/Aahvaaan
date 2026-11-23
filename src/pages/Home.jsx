import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, IndianRupee, Smartphone, MessageCircle,
  Star, Users, ArrowRight, Sparkles, Heart, Check,
  MapPin, Calendar, Clock, RotateCcw, Eye, ShoppingBag,
  Share2, ShieldCheck, ChevronDown, Flame, CheckCircle2
} from 'lucide-react';
import templates from '../data/templates';
import packages from '../data/pricing';
import TemplateCard from '../components/TemplateCard';
import SectionHeading from '../components/SectionHeading';
import { FloralDivider, GoldOrnament } from '../components/Ornaments';

// ─── Interactive Diya Component (Hero Easter Egg) ───
function InteractiveDiya({ id, label, isLit, onToggle, style }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      style={style}
      className="group relative flex flex-col items-center cursor-pointer focus:outline-none transition-transform hover:scale-110 active:scale-95"
      title={isLit ? 'Tap to extinguish diya' : 'Tap to light the diya!'}
    >
      {/* Animated Flame */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 5 }}
            animate={{ scale: [1, 1.15, 0.95, 1], opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative mb-0.5"
          >
            {/* Outer Glow */}
            <div className="absolute -inset-2 bg-amber-400/40 rounded-full blur-md animate-pulse" />
            {/* Core Flame SVG */}
            <svg viewBox="0 0 24 32" className="w-5 h-7 relative z-10 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]">
              <path
                d="M12 2C12 2 4 14 4 21C4 26 7.5 30 12 30C16.5 30 20 26 20 21C20 14 12 2 12 2Z"
                fill="url(#flameGrad)"
              />
              <path
                d="M12 10C12 10 7 17 7 21C7 24 9.2 27 12 27C14.8 27 17 24 17 21C17 17 12 10 12 10Z"
                fill="#FEF3C7"
              />
              <defs>
                <linearGradient id="flameGrad" x1="12" y1="2" x2="12" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F59E0B" />
                  <stop offset="0.6" stopColor="#EF4444" />
                  <stop offset="1" stopColor="#B45309" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clay Diya Base */}
      <svg viewBox="0 0 48 24" className="w-10 h-5 drop-shadow-sm">
        <path
          d="M4 10 C 10 18, 38 18, 44 10 C 46 14, 38 22, 24 22 C 10 22, 2 14, 4 10 Z"
          fill="#B69A70"
          stroke="#704B50"
          strokeWidth="0.8"
        />
        <ellipse cx="24" cy="10" rx="20" ry="4" fill="#C5A15E" />
      </svg>
      <span className="text-[10px] font-body text-charcoal/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </button>
  );
}

// ─── Interactive FAQ Accordion Item ───
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-champagne/60 last:border-none">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left gap-4 font-heading text-lg sm:text-xl font-bold text-wine hover:text-gold transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gold transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="font-body text-xs sm:text-sm text-charcoal/75 leading-relaxed pb-5 pr-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  // Diya lighting interactive state
  const [litDiyas, setLitDiyas] = useState({ 1: true, 2: false, 3: true });
  const toggleDiya = (id) => {
    setLitDiyas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Active showcase template index (for Balcony-style interactive live switcher)
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);
  const activeTemplate = templates[activeTemplateIdx] || templates[0];
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  // FAQ accordion state
  const [openFAQ, setOpenFAQ] = useState(0);

  // Features inspired by Balcony + tailored for Indian weddings
  const features = [
    {
      icon: MapPin,
      title: 'Instant Venue Directions',
      desc: 'Guests can open exact palace, resort, or banquet locations and get GPS driving directions in a single tap on Google Maps.',
      tag: 'Zero Guest Confusion',
    },
    {
      icon: Users,
      title: 'Real-Time RSVP Tracking',
      desc: 'Collect guest responses effortlessly with headcounts, ceremony attendance, and warm wishes stored seamlessly.',
      tag: 'Save Catering Costs',
    },
    {
      icon: Calendar,
      title: '1-Tap Add to Calendar',
      desc: 'Guests easily sync Haldi, Mehendi, Sangeet, Pheras, and Reception directly into their Google, Apple, or Outlook calendars.',
      tag: 'Never Miss An Event',
    },
    {
      icon: RotateCcw,
      title: 'Instant Live Updates',
      desc: 'Changed a ceremony time or caught a typo? Update your invitation link instantly without costly reprint delays or re-couriering.',
      tag: 'Eco-Friendly & Smart',
    },
    {
      icon: Sparkles,
      title: 'Interactive Envelope Opening',
      desc: 'Replicate the magic of opening a royal shahi card with animated wax seals, fluttering flaps, and musical ambiance.',
      tag: 'Unforgettable First Impression',
    },
    {
      icon: Heart,
      title: 'Love Story & Photo Gallery',
      desc: 'Introduce your families and showcase your pre-wedding shoot with responsive, high-resolution photo galleries.',
      tag: 'Cinematic Storytelling',
    },
  ];

  const faqs = [
    {
      q: 'How do our guests open and view the wedding invitation?',
      a: 'Guests simply tap your link on WhatsApp, SMS, or email. The invitation opens instantly in their mobile browser—no downloads, passwords, or app installations required. It works flawlessly across iPhone, Android, tablets, and laptops.',
    },
    {
      q: 'Can we update details after sending the invitation link?',
      a: 'Yes, absolutely! Unlike printed paper cards where a timing shift or venue change means expensive reprinting, digital invitations update live. Any change you make reflects immediately for everyone opening the link.',
    },
    {
      q: 'Can we personalize guest names (e.g. "Dear Sharma Family")?',
      a: 'Yes! With our Signature and Luxury packages, we can provide personalized guest links where each recipient sees their family name and custom greeting upon opening their invitation.',
    },
    {
      q: 'What wedding ceremonies can we include?',
      a: 'You can include all traditional Indian wedding ceremonies: Ganesh Sthapana, Mehendi, Haldi, Sangeet, Tilak, Baraat, Pheras/Wedding, Reception, and Vidai. Each ceremony has its own date, time, venue, map pin, and calendar link.',
    },
    {
      q: 'How long does it take to receive our invitation?',
      a: 'Once you submit your wedding details and choose your template, our design team delivers your live private preview link within 24 to 48 hours for your review and approval.',
    },
    {
      q: 'How does the order and payment process work?',
      a: 'You choose your signature template and package (Starter ₹999, Signature ₹1,499, or Luxury ₹1,999) on our website, which generates a pre-formatted order request on WhatsApp. You review your details directly with our design team before any payment is finalized.',
    },
  ];

  return (
    <>
      {/* ════ SECTION 1: HERO (With Balcony-style interactive touches & Diya lighting) ════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-ivory pt-24 pb-16">
        {/* Subtle royal damask watermark */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%23B69A70'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 bg-champagne/60 border border-gold/40 px-3.5 py-1.5 rounded-full mb-6">
                <Sparkles size={14} className="text-gold" />
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-wine">
                  Next-Gen Digital Wedding Invites
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-wine leading-[1.12] mb-6">
                Make your first impression{' '}
                <span className="text-gold italic font-serif">unforgettable.</span>
              </h1>

              <p className="font-body text-base sm:text-lg text-charcoal/80 leading-relaxed mb-8 max-w-xl">
                Ditch static PDFs and paper cards. Create a stunning, interactive wedding website invitation with tap-to-open envelope animations, Google Maps directions, live RSVPs, and WhatsApp sharing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href="#explore-templates"
                  className="btn-primary text-xs uppercase tracking-widest font-semibold px-8 py-4 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  <span>Explore Templates</span>
                </a>
                <Link
                  to="/buy"
                  className="btn-secondary text-xs uppercase tracking-widest font-semibold px-8 py-4 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Choose Package & Buy</span>
                </Link>
              </div>

              {/* Interactive Diya row with playful prompt */}
              <div className="p-4 rounded-xl bg-white/70 border border-champagne/60 backdrop-blur-xs max-w-md">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-heading font-bold text-wine flex items-center gap-1.5">
                      <Flame size={14} className="text-amber-500 fill-amber-500" />
                      Light the Diyas for Auspicious Blessings
                    </span>
                    <span className="text-[11px] font-body text-charcoal/60 block">
                      Tap the diyas below to ignite wedding warmth
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <InteractiveDiya id={1} label="Shubh" isLit={litDiyas[1]} onToggle={toggleDiya} />
                    <InteractiveDiya id={2} label="Laabh" isLit={litDiyas[2]} onToggle={toggleDiya} />
                    <InteractiveDiya id={3} label="Aanand" isLit={litDiyas[3]} onToggle={toggleDiya} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual: Realistic Mobile Mockup with Floating Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Phone Frame Simulator Container */}
              <div className="relative max-w-[320px] sm:max-w-[340px] mx-auto">
                <div className="rounded-[40px] border-[8px] border-charcoal bg-white shadow-2xl overflow-hidden aspect-[9/18.5] relative">
                  {/* Phone Speaker Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-charcoal rounded-full z-30" />

                  {/* Simulated Mobile Invitation Screen */}
                  <div className="w-full h-full overflow-y-auto bg-[#FAF6F0] p-4 pt-10 text-center font-body flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-gold font-semibold py-0.5 px-2 bg-champagne rounded-full border border-gold/30">
                        The Romance Collection
                      </span>
                      <h3 className="font-heading text-2xl font-bold text-wine mt-2">
                        Ananya & Kabir
                      </h3>
                      <p className="text-[11px] text-charcoal/60 italic mb-3">
                        22 February 2027 • Udaipur
                      </p>

                      {/* Mockup Card */}
                      <div className="rounded-xl overflow-hidden shadow-sm border border-champagne aspect-[4/3] mb-3 relative">
                        <img
                          src="https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=500&fit=crop&q=80"
                          alt="Wedding invite preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-wine/70 to-transparent flex items-end p-2 text-white text-[10px] font-heading">
                          The Oberoi Udaivilas, Lake Pichola
                        </div>
                      </div>

                      {/* Mini Schedule Pills */}
                      <div className="space-y-1.5 text-left text-[10px] mb-3">
                        <div className="bg-white p-2 rounded-lg border border-champagne/60 flex items-center justify-between">
                          <span className="font-semibold text-wine">🌿 Mehendi</span>
                          <span className="text-gold">Feb 20 • 2 PM</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-champagne/60 flex items-center justify-between">
                          <span className="font-semibold text-wine">🎶 Sangeet</span>
                          <span className="text-gold">Feb 21 • 7:30 PM</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-champagne/60 flex items-center justify-between">
                          <span className="font-semibold text-wine">💍 Pheras</span>
                          <span className="text-gold">Feb 22 • 5:30 PM</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA in Mockup */}
                    <div className="pt-2 border-t border-champagne/50">
                      <Link
                        to="/invitations/champagne-and-rose"
                        className="block w-full py-2 bg-wine text-white rounded-lg text-[10px] uppercase tracking-wider font-semibold hover:bg-gold transition-colors"
                      >
                        Tap to Open Full Invite →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Social Proof 1 */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-6 bg-white p-3 rounded-xl shadow-xl border border-champagne hidden sm:flex items-center gap-2.5 z-20"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <p className="font-heading text-xs font-bold text-wine">100% WhatsApp Ready</p>
                    <p className="text-[10px] font-body text-charcoal/60">Rich Preview Cards</p>
                  </div>
                </motion.div>

                {/* Floating Social Proof 2 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -top-3 -right-6 bg-white p-3 rounded-xl shadow-xl border border-champagne hidden sm:flex items-center gap-2 z-20"
                >
                  <Star size={16} className="text-gold fill-gold" />
                  <div>
                    <span className="font-heading text-xs font-bold text-wine">4.9/5 Rating</span>
                    <span className="text-[10px] font-body text-charcoal/50 block">Over 1,200+ Couples</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════ SECTION 2: EXPLORE TEMPLATES GRID (Matching Loom Video UI & Balcony Reference) ════ */}
      <section id="explore-templates" className="section-padding bg-ivory border-t border-champagne/50">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            {/* Signature lavender pill badge as recorded in Loom video */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f3e8ff] text-[#7e22ce] border border-[#d8b4fe]/60 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles size={13} className="text-[#9333ea]" />
              <span>Explore Templates</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-wine mb-4">
              Explore 4 Signature Collections
            </h2>
            <p className="font-body text-sm sm:text-base text-charcoal/75 leading-relaxed">
              Every celebration deserves a beautiful beginning. Each template features a bespoke 5-shade colour palette, authentic ceremonial itinerary, and interactive mobile preview.
            </p>
          </div>

          {/* 2x2 Responsive Grid of Template Cards (Matching Loom Video Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {templates.map((template, idx) => (
              <TemplateCard key={template.id} template={template} index={idx} />
            ))}
          </div>

          {/* Live Simulator Jump Pill */}
          <div className="mt-12 text-center">
            <a
              href="#templates-showcase"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-wine bg-white px-5 py-2.5 rounded-full border border-champagne shadow-xs hover:border-gold hover:text-gold transition-colors"
            >
              <span>Test Live Phone Simulator Below</span>
              <ChevronDown size={14} className="text-gold animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* ════ SECTION 3: BALCONY-STYLE INTERACTIVE TEMPLATE SHOWCASE & PHONE SIMULATOR ════ */}
      <section id="templates-showcase" className="section-padding bg-white border-t border-champagne/50">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Signature Collections"
            title="Explore 4 Signature Wedding Invitations"
            description="Unlike generic templates, each of our 4 signature collections features a bespoke color palette, custom typography, and tailored cultural aesthetics. Click through to test the live simulator."
          />

          {/* Interactive Collection Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {templates.map((tmpl, idx) => {
              const isActive = activeTemplateIdx === idx;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setActiveTemplateIdx(idx);
                    setEnvelopeOpened(false);
                  }}
                  className={`px-4 sm:px-6 py-2.5 rounded-full font-body text-xs sm:text-sm font-semibold transition-all duration-300 border flex items-center gap-2 ${
                    isActive
                      ? 'bg-wine text-white border-wine shadow-md scale-105'
                      : 'bg-ivory text-charcoal border-champagne hover:border-wine hover:text-wine'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-champagne/60"
                    style={{ backgroundColor: tmpl.themeStyles.buttonBg }}
                  />
                  <span>{tmpl.name}</span>
                </button>
              );
            })}
          </div>

          {/* Side-by-Side Interactive Experience */}
          <div className="grid lg:grid-cols-12 gap-10 items-center bg-ivory rounded-3xl p-6 sm:p-10 border border-champagne/60 card-shadow">
            {/* Left: Template Details & Palette */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gold block mb-2">
                  {activeTemplate.collection}
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold text-wine mb-3">
                  {activeTemplate.name}
                </h3>
                <p className="font-body text-sm sm:text-base text-charcoal/80 leading-relaxed">
                  {activeTemplate.description}
                </p>
              </div>

              {/* 5-Shade Palette Swatches */}
              <div className="bg-white p-5 rounded-xl border border-champagne/60">
                <span className="font-body text-xs uppercase tracking-wider font-semibold text-charcoal/70 block mb-3">
                  Signature 5-Shade Colour Palette:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {activeTemplate.colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 bg-ivory px-3 py-1.5 rounded-lg border border-champagne/50">
                      <span
                        className="w-4 h-4 rounded-full border border-champagne shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-body text-xs text-charcoal/80 font-medium">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Ceremony Highlights */}
              <div>
                <span className="font-body text-xs uppercase tracking-wider font-semibold text-charcoal/70 block mb-2">
                  Sample Wedding Events Included:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-body">
                  {activeTemplate.sampleData.events.map((evt, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-champagne/50 text-center">
                      <span className="text-lg block mb-0.5">{evt.icon}</span>
                      <span className="font-semibold text-wine block truncate">{evt.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Direct Actions */}
              <div className="pt-4 border-t border-champagne/50 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-charcoal/50 font-body block">Starting Price</span>
                  <span className="font-heading text-3xl font-bold text-wine">
                    {activeTemplate.priceDisplay}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/invitations/${activeTemplate.id}`}
                    className="btn-secondary py-3 px-5 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Eye size={15} />
                    Full Preview
                  </Link>
                  <Link
                    to={`/buy/${activeTemplate.id}`}
                    className="btn-primary py-3 px-6 text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <ShoppingBag size={15} />
                    Buy This Template
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Phone Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px]">
                <div
                  className="rounded-[36px] border-[8px] border-charcoal shadow-2xl overflow-hidden aspect-[9/18.5] relative"
                  style={{ backgroundColor: activeTemplate.themeStyles.bgPrimary }}
                >
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-charcoal rounded-full z-30" />

                  {/* Simulator Screen */}
                  <div className="w-full h-full overflow-y-auto p-4 pt-8 text-center flex flex-col justify-between">
                    <div>
                      <span
                        className="text-[9px] uppercase tracking-widest font-semibold py-0.5 px-2 rounded-full inline-block mb-1"
                        style={{
                          backgroundColor: activeTemplate.themeStyles.badgeBg,
                          color: activeTemplate.themeStyles.badgeText,
                        }}
                      >
                        {activeTemplate.collection}
                      </span>

                      <h4
                        className="font-heading text-2xl font-bold mt-1"
                        style={{ color: activeTemplate.themeStyles.textPrimary }}
                      >
                        {activeTemplate.sampleData.bride.split(' ')[0]} & {activeTemplate.sampleData.groom.split(' ')[0]}
                      </h4>

                      <p
                        className="text-[11px] font-body mb-3"
                        style={{ color: activeTemplate.themeStyles.textSecondary }}
                      >
                        {new Date(activeTemplate.sampleData.weddingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })} • {activeTemplate.sampleData.location}
                      </p>

                      {/* Interactive Tap-to-Open Envelope Mock */}
                      <div
                        onClick={() => setEnvelopeOpened(!envelopeOpened)}
                        className="cursor-pointer p-4 rounded-xl border border-dashed transition-all hover:scale-102 mb-3"
                        style={{
                          backgroundColor: activeTemplate.themeStyles.bgSecondary,
                          borderColor: activeTemplate.themeStyles.accentPrimary,
                        }}
                      >
                        <div className="text-2xl mb-1">{envelopeOpened ? '💌' : '✉️'}</div>
                        <span
                          className="font-heading text-sm font-bold block"
                          style={{ color: activeTemplate.themeStyles.textPrimary }}
                        >
                          {envelopeOpened ? 'Envelope Opened!' : 'Tap to Open Envelope'}
                        </span>
                        <span className="text-[10px] font-body text-charcoal/60 block">
                          {envelopeOpened ? 'Tap again to close' : 'Interactive royal wax seal'}
                        </span>
                      </div>

                      {/* Mini Events List */}
                      <div className="space-y-1.5 text-left text-[10px]">
                        {activeTemplate.sampleData.events.slice(0, 3).map((e, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-lg border flex items-center justify-between"
                            style={{
                              backgroundColor: activeTemplate.themeStyles.cardBg,
                              borderColor: `${activeTemplate.themeStyles.accentPrimary}40`,
                            }}
                          >
                            <span
                              className="font-semibold"
                              style={{ color: activeTemplate.themeStyles.textPrimary }}
                            >
                              {e.icon} {e.name}
                            </span>
                            <span style={{ color: activeTemplate.themeStyles.accentSecondary }}>
                              {e.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3">
                      <Link
                        to={`/invitations/${activeTemplate.id}`}
                        className="block w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white shadow-sm"
                        style={{ backgroundColor: activeTemplate.themeStyles.buttonBg }}
                      >
                        Open Full Design Experience →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ SECTION 3: FEATURES GRID (Balcony-Style High-Impact Visual Cards) ════ */}
      <section className="section-padding bg-ivory">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Thoughtfully Engineered"
            title="Everything Your Guests Need, in One Link"
            description="Traditional wedding cards get misplaced or forgotten. Vow & Vision invitations give your guests a smooth, interactive mobile experience that makes attending effortless."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 sm:p-8 rounded-2xl card-shadow border border-champagne/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-champagne/40 flex items-center justify-center text-wine">
                      <item.icon size={22} />
                    </div>
                    <span className="font-body text-[10px] uppercase tracking-wider font-bold text-gold bg-champagne/30 px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-wine mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-champagne/40 flex items-center text-gold text-xs font-semibold gap-1">
                  <span>Included in All Packages</span>
                  <Check size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SECTION 4: SMART SHARING (Balcony-Style: Common Link vs Personalized Links) ════ */}
      <section className="section-padding bg-white border-t border-champagne/50">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Effortless WhatsApp Sharing"
            title="Want to Greet Guests by Name?"
            description="Deliver your wedding invitation in whichever way suits your celebration. From broadcast family links to bespoke individual greetings."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Common Link Card */}
            <div className="bg-ivory rounded-2xl p-6 sm:p-8 border border-champagne/70 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-wine/10 flex items-center justify-center text-wine mb-4">
                  <Share2 size={22} />
                </div>
                <span className="text-[11px] font-body uppercase tracking-wider font-bold text-gold block mb-1">
                  Option A
                </span>
                <h3 className="font-heading text-2xl font-bold text-wine mb-2">
                  Common Invitation Link
                </h3>
                <p className="font-body text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-6">
                  A single universal web link you can share with everyone in family WhatsApp groups, broadcast lists, and social media. Perfect for rapid sharing without managing individual lists.
                </p>

                <ul className="space-y-2.5 text-xs font-body text-charcoal/80 mb-8">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-gold" /> One link for your entire guest list
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-gold" /> Best for quick and bulk WhatsApp sharing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-gold" /> Generates a beautiful WhatsApp rich preview card
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-white rounded-lg border border-champagne text-xs font-mono text-wine">
                aahvaaan.com/invite/ananya-kabir
              </div>
            </div>

            {/* Personalized Link Card */}
            <div className="bg-wine text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-gold text-white text-[10px] uppercase tracking-widest font-bold py-1 px-3 rounded-full">
                Signature & Luxury
              </div>

              <div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gold mb-4">
                  <Users size={22} />
                </div>
                <span className="text-[11px] font-body uppercase tracking-wider font-bold text-gold-light block mb-1">
                  Option B
                </span>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  Personalized Guest Link
                </h3>
                <p className="font-body text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                  Greet guests individually with their names! When uncle, aunt, or close college friends open their invitation link, it displays a warm personal greeting: <em>"Dear Sharma Family, you are warmly invited..."</em>
                </p>

                <ul className="space-y-2.5 text-xs font-body text-white/90 mb-8">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-gold" /> Individualized greeting for VIP relatives & close friends
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-gold" /> Pre-fills guest names in their RSVP form
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-gold" /> Feels profoundly intimate and royal
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-white/10 rounded-lg border border-white/20 text-xs font-mono text-gold-light">
                aahvaaan.com/invite/ananya-kabir?guest=Sharma+Family
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ SECTION 5: LIVE UPDATES VS PAPER CARDS ════ */}
      <section className="py-14 bg-champagne/30 border-y border-champagne">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="font-body text-xs uppercase tracking-[0.25em] font-semibold text-gold block mb-2">
            No Reprinting Headaches
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-wine mb-4">
            Your Guests Always See the Latest Details
          </h2>
          <p className="font-body text-sm sm:text-base text-charcoal/80 leading-relaxed mb-6">
            Delayed flight? Baraat shifted by an hour? Found a typo? With traditional paper invites, you would be helpless. With Vow & Vision, you update your invitation in real-time, and every guest link instantly reflects the newest schedule.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-body text-wine font-semibold">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-gold" /> Free revision updates</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-gold" /> Zero re-printing costs</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-gold" /> Instant sync across all devices</span>
          </div>
        </div>
      </section>

      {/* ════ SECTION 6: PACKAGES ════ */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Transparent Pricing"
            title="Choose Your Package"
            description="Affordable starting prices across all 4 signature collections. No hidden surprises."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl overflow-hidden p-8 flex flex-col justify-between transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-wine text-white ring-2 ring-gold shadow-2xl scale-[1.02]'
                    : 'bg-white text-charcoal card-shadow border border-champagne/60'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gold text-white text-center font-body text-xs font-semibold tracking-wider uppercase py-2">
                    ★ Most Popular Package
                  </div>
                )}

                <div className={pkg.popular ? 'pt-4' : ''}>
                  <h3 className={`font-heading text-2xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-wine'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`font-body text-xs mb-6 ${pkg.popular ? 'text-white/70' : 'text-charcoal/60'}`}>
                    {pkg.tagline}
                  </p>

                  <div className="mb-6 pb-6 border-b border-champagne/40">
                    <span className={`font-heading text-5xl font-bold ${pkg.popular ? 'text-gold' : 'text-wine'}`}>
                      {pkg.priceDisplay}
                    </span>
                    <span className={`font-body text-xs ml-2 ${pkg.popular ? 'text-white/60' : 'text-charcoal/50'}`}>
                      starting price
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-body text-xs leading-relaxed">
                        <Check size={16} className={`flex-shrink-0 mt-0.5 ${pkg.popular ? 'text-gold' : 'text-gold'}`} />
                        <span className={pkg.popular ? 'text-white/90' : 'text-charcoal/80'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/buy?package=${pkg.id}`}
                  className={`block text-center py-3.5 px-6 rounded-lg font-body text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-gold text-white hover:bg-gold-light shadow-md'
                      : 'bg-wine text-white hover:bg-wine-light'
                  }`}
                >
                  {pkg.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SECTION 7: FAQS ACCORDION ════ */}
      <section className="section-padding bg-ivory border-t border-champagne/50">
        <div className="container-custom mx-auto max-w-3xl">
          <SectionHeading
            subtitle="Got Questions?"
            title="Frequently Asked Questions"
            description="Everything you need to know about our digital wedding invitations, customization, and WhatsApp sharing."
          />

          <div className="bg-white rounded-2xl p-6 sm:p-8 card-shadow border border-champagne/60">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.q}
                answer={faq.a}
                isOpen={openFAQ === idx}
                onToggle={() => setOpenFAQ(openFAQ === idx ? -1 : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════ SECTION 8: FINAL CTA BANNER ════ */}
      <section className="relative section-padding bg-wine overflow-hidden text-white">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B69A70' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative container-custom mx-auto text-center">
          <FloralDivider className="text-gold/50 mx-auto mb-8" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Your Wedding Deserves an Unforgettable Beginning.
            </h2>
            <p className="font-body text-base text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
              Join hundreds of happy couples across India. Browse our 4 signature collections, pick your favorite, and receive your live WhatsApp invitation in 24–48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/invitations" className="btn-gold text-xs uppercase tracking-widest px-8 py-4 font-semibold shadow-lg">
                Explore Signature Designs
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-body font-semibold text-xs uppercase tracking-widest rounded-md hover:bg-white/10 transition-all duration-300">
                Contact For Bespoke Request
              </Link>
            </div>
          </motion.div>
          <FloralDivider className="text-gold/50 mx-auto mt-8" />
        </div>
      </section>
    </>
  );
}
