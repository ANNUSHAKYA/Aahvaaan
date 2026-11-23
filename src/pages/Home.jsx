import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, MapPin, Users, Calendar, Edit3, Sparkles,
  ChevronRight, Plus, Minus, Send, CheckCircle2, ShieldCheck
} from 'lucide-react';
import templates from '../data/templates';
import config from '../data/config';

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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: 'Can I edit my invitation after it is published?',
      a: 'Yes. You can save Draft changes as often as you like, and push those changes live up to 3 times within your 6-month active window.',
    },
    {
      q: 'What do I get when I buy an invitation?',
      a: 'You get your chosen invitation template, a common shareable link, 5 free personalized guest links, instant RSVP tracking, Google Maps directions, countdown timer, and 3 live updates valid for 6 months.',
    },
    {
      q: 'Can guests RSVP from the common link?',
      a: 'Yes! Guests viewing the common link simply enter their name and phone number to RSVP. Guests opening a personalized link have their greeting and details already pre-filled.',
    },
    {
      q: 'What if I want to personalize more than 5 guests?',
      a: 'You can easily upgrade your guest limit anytime directly from your dashboard with add-on packages for 25, 50, 100, or unlimited guests.',
    },
    {
      q: 'Can I see who has viewed my invitation?',
      a: 'Yes! Your host dashboard tracks total page views, unique visitors, device types (mobile vs desktop), and shows exactly which personalized guests have opened their invitation.',
    },
    {
      q: 'How long will my invitation remain active?',
      a: 'Your invitation remains live and viewable for guests indefinitely. Live editing and updates are supported for 6 months from publishing.',
    },
    {
      q: "What if some guests don't respond?",
      a: 'Your dashboard automatically highlights pending RSVPs in amber and gives you a one-tap WhatsApp reminder button with a polite prefilled message.',
    },
    {
      q: 'Why choose Aahvaaan instead of a typical digital invitation image or video?',
      a: 'Unlike static PDFs or video files, Aahvaaan gives your guests an interactive website with music, live countdown, Google Maps navigation, calendar downloads, and instant RSVP tracking for you.',
    },
  ];

  return (
    <div className="bg-ivory min-h-screen font-body overflow-x-hidden">
      {/* ════════════════ 1. HERO SECTION ════════════════ */}
      <section className="bg-gradient-to-r from-[#24050E] via-[#4A0E1C] to-[#6B1D2F] text-white pt-28 sm:pt-36 pb-16 sm:pb-24 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wine/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-4">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.8rem] font-bold text-white leading-[1.12] tracking-tight">
                Make your first impression unforgettable.
              </h1>

              <p className="font-heading text-2xl sm:text-3xl text-gold-light/90 pt-1">
                Wedding Invitations
              </p>

              <div className="pt-4">
                <Link
                  to="/invitations"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-wine to-[#9E2A47] hover:from-[#9E2A47] hover:to-wine text-white font-body font-semibold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span>View templates</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Graphic: Arched Palace Balcony Window (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm aspect-[4/5] rounded-t-full border-4 border-gold/40 shadow-2xl overflow-hidden relative bg-[#1A030A] flex items-center justify-center group">
                <img
                  src="/assets/hero-bg.jpg"
                  alt="Royal Couple on Palace Balcony"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback royal backdrop if image path unavailable
                    e.target.style.display = 'none';
                  }}
                />
                {/* Visual Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#24050E]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                  <span className="font-heading text-xs text-gold-light uppercase tracking-widest block drop-shadow-sm">
                    Aahvaaan Signature Collection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 2. EXPLORE TEMPLATES SECTION ════════════════ */}
      <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Section Heading Badge */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-8 py-2.5 rounded-full bg-wine/10 text-wine font-heading text-2xl sm:text-3xl font-bold">
            Explore Templates
          </span>
        </div>

        {/* 2x2 Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {templates.slice(0, 4).map((tmpl) => (
            <Link
              key={tmpl.id}
              to={`/invitations/${tmpl.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-champagne/60 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group"
            >
              {/* Preview Graphic */}
              <div className="aspect-[16/10] overflow-hidden bg-ivory relative border-b border-champagne/40">
                <img
                  src={tmpl.image}
                  alt={tmpl.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {tmpl.featured && (
                  <span className="absolute top-4 left-4 bg-wine text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Popular
                  </span>
                )}
              </div>

              {/* Card Footer Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-wine group-hover:text-gold transition-colors mb-1.5">
                    {tmpl.name}
                  </h3>
                  <p className="font-body text-xs text-charcoal/65 leading-relaxed line-clamp-2">
                    {tmpl.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-champagne/40 flex items-center justify-between">
                  <span className="font-heading text-base font-bold text-wine">
                    ₹{tmpl.startingPrice || 1499}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-ivory text-wine group-hover:bg-wine group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Center CTA Button */}
        <div className="text-center mt-12">
          <Link
            to="/invitations"
            className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-wine to-[#9E2A47] hover:from-[#9E2A47] hover:to-wine text-white font-body text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            View all templates
          </Link>
        </div>
      </section>

      {/* ════════════════ 3. SHARING COMPARISON SECTION ════════════════ */}
      <section id="sharing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Common Link */}
          <div className="bg-[#FAF4EE] rounded-[36px] p-6 sm:p-8 border border-champagne/60 text-center shadow-xs flex flex-col items-center">
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
              {/* Camera Notch */}
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-1 z-20" />
              {/* Screen Content */}
              <div className="flex-1 bg-gradient-to-b from-[#FAF6F0] to-[#E9D7CC] rounded-[30px] p-4 flex flex-col items-center justify-center text-center relative border border-champagne/80">
                <span className="font-heading text-[9px] text-wine uppercase tracking-widest mb-1">
                  Wedding Invitation
                </span>
                <p className="font-heading text-xs font-bold text-wine leading-tight mb-2">
                  We cordially invite you to grace the auspicious occasion of the marriage of...
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
          <div className="bg-[#FAF4EE] rounded-[36px] p-6 sm:p-8 border border-champagne/60 text-center shadow-xs flex flex-col items-center">
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
              {/* Camera Notch */}
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mb-1 z-20" />
              {/* Screen Content */}
              <div className="flex-1 bg-gradient-to-b from-[#FAF6F0] to-[#E9D7CC] rounded-[30px] p-4 flex flex-col items-center justify-center text-center relative border border-champagne/80">
                <span className="font-heading text-xs sm:text-sm font-bold text-wine mb-1">
                  Mr. Sharma and Family
                </span>
                <p className="font-body text-[10px] text-charcoal/70 leading-tight mb-2">
                  We cordially invite you to grace the auspicious celebrations...
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
          <div className="bg-[#FFF9F3] rounded-3xl p-6 sm:p-8 border border-champagne/70 text-center shadow-xs">
            <h4 className="font-heading text-xl sm:text-2xl font-bold text-wine mb-2">
              With every invitation, you get
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-charcoal/80">
              <span className="font-bold text-wine">Common link</span>
              <span className="text-gold font-bold text-lg">+</span>
              <span className="font-bold text-wine">5 personalized guest links free</span>
            </div>
            <p className="text-[11px] text-charcoal/50 mt-1">
              (You can increase the number of guests anytime by purchasing.)
            </p>
          </div>

          {/* Bottom Live Updates Banner */}
          <div className="bg-gradient-to-r from-[#3D0C1A] via-[#521324] to-[#6B1D2F] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
            <h4 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
              Your guests always see the latest details.
            </h4>
            <p className="font-body text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed mb-4">
              Change your mind about the venue? Caught a typo? Update your invitation and every guest link reflects it instantly. No resharing needed.
            </p>
            <p className="font-body text-xs sm:text-sm text-white/90">
              Up to <strong className="text-gold font-bold text-lg sm:text-xl">3</strong> updates within <strong className="text-gold font-bold text-lg sm:text-xl">6</strong> months of going live
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ 4. FEATURES GRID SECTION ════════════════ */}
      <section id="features" className="bg-[#2D0A14] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Heading Badge */}
          <div className="text-center mb-14">
            <span className="inline-block px-8 py-2 rounded-full bg-white/10 text-white font-heading text-2xl sm:text-3xl font-bold">
              Features
            </span>
          </div>

          {/* 5 Clean White Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Instant Directions */}
            <div className="bg-white rounded-3xl p-7 text-charcoal shadow-xl border border-champagne/40 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 text-wine flex items-center justify-center mb-4">
                <MapPin size={24} className="text-wine" />
              </div>
              <h4 className="font-heading text-base font-bold text-wine mb-2">
                Instant Directions
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Guests can open the venue location and get directions in a single tap.
              </p>
            </div>

            {/* Card 2: RSVP Tracking */}
            <div className="bg-white rounded-3xl p-7 text-charcoal shadow-xl border border-champagne/40 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 text-wine flex items-center justify-center mb-4">
                <Users size={24} className="text-wine" />
              </div>
              <h4 className="font-heading text-base font-bold text-wine mb-2">
                RSVP Tracking
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Collect guest responses effortlessly and know who's attending.
              </p>
            </div>

            {/* Card 3: Add to Calendar */}
            <div className="bg-white rounded-3xl p-7 text-charcoal shadow-xl border border-champagne/40 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 text-wine flex items-center justify-center mb-4">
                <Calendar size={24} className="text-wine" />
              </div>
              <h4 className="font-heading text-base font-bold text-wine mb-2">
                Add to Calendar
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Add the event to guests' calendars instantly - Google, Apple or Outlook.
              </p>
            </div>
          </div>

          {/* Row 2 (2 cards centered) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-6">
            {/* Card 4: Live Updates */}
            <div className="bg-white rounded-3xl p-7 text-charcoal shadow-xl border border-champagne/40 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 text-wine flex items-center justify-center mb-4">
                <Edit3 size={24} className="text-wine" />
              </div>
              <h4 className="font-heading text-base font-bold text-wine mb-2">
                Live Updates
              </h4>
              <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                Update event details anytime, and changes reflect instantly for all guests.
              </p>
            </div>

            {/* Card 5: Interactive Experience */}
            <div className="bg-white rounded-3xl p-7 text-charcoal shadow-xl border border-champagne/40 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-wine/10 text-wine flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-wine" />
              </div>
              <h4 className="font-heading text-base font-bold text-wine mb-2">
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
            At Aahvaaan, we make beautiful digital invitations that are simple to edit, easy to share, and designed to make every guest feel special. Our invitations make things easier for hosts too, from creating and personalising invitations to keeping track of who's coming. Everything comes together in one simple, thoughtful experience, so you can spend less time managing invitations and more time enjoying your celebration.
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
