import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Clock, Camera, Users,
  ChevronDown, ExternalLink, ArrowLeft, ArrowRight,
  Sparkles, ShoppingBag, Smartphone, Monitor, RotateCcw,
  Check, UserCheck, Utensils, Volume2, VolumeX, Music, Edit3
} from 'lucide-react';
import templates from '../data/templates';
import config from '../data/config';
import useCountdown from '../hooks/useCountdown';
import useWeddingAudio from '../hooks/useWeddingAudio';

// ─── Custom Envelope & Gate Opening Animation per Palette ───
function EnvelopeOpening({ template, guestName, onOpen }) {
  const { sampleData, palette, themeStyles } = template;
  const initials = `${sampleData.bride.charAt(0)} & ${sampleData.groom.charAt(0)}`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ backgroundColor: `${themeStyles.bgPrimary}fa` }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center max-w-md w-full px-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Collection Name */}
          <span
            className="inline-block text-xs uppercase tracking-[0.25em] font-semibold py-1 px-4 rounded-full mb-4 shadow-xs border"
            style={{
              backgroundColor: themeStyles.badgeBg,
              color: themeStyles.badgeText,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            {template.collection}
          </span>

          {/* Guest Personal Salutation */}
          <p
            className="font-heading text-lg italic mb-2"
            style={{ color: themeStyles.textSecondary }}
          >
            Cordially Inviting
          </p>
          <h2
            className="font-heading text-2xl sm:text-3xl font-bold mb-6"
            style={{ color: themeStyles.textPrimary }}
          >
            {guestName}
          </h2>

          {/* Envelope & Palace Gate Graphic */}
          <div className="relative w-72 h-52 mx-auto mb-6 drop-shadow-2xl">
            <svg viewBox="0 0 288 208" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Envelope Body */}
              <rect
                x="8"
                y="40"
                width="272"
                height="160"
                rx="12"
                fill={themeStyles.bgSecondary}
                stroke={themeStyles.accentSecondary}
                strokeWidth="1.5"
              />

              {/* Envelope Inner Liner */}
              <rect
                x="20"
                y="52"
                width="248"
                height="136"
                rx="8"
                fill={themeStyles.bgPrimary}
              />

              {/* Decorative Arch Border */}
              <rect
                x="28"
                y="60"
                width="232"
                height="120"
                rx="4"
                fill="none"
                stroke={themeStyles.accentPrimary}
                strokeWidth="0.8"
                strokeDasharray="4 4"
                opacity="0.8"
              />

              {/* Card Letter Content */}
              <text
                x="144"
                y="95"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="16"
                fill={themeStyles.textPrimary}
                fontWeight="700"
              >
                {sampleData.bride.split(' ')[0]} & {sampleData.groom.split(' ')[0]}
              </text>
              <text
                x="144"
                y="118"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
                fontSize="10"
                fill={themeStyles.textSecondary}
                letterSpacing="1"
              >
                {new Date(sampleData.weddingDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </text>
              <text
                x="144"
                y="138"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="10"
                fill={themeStyles.accentSecondary}
                fontStyle="italic"
              >
                {sampleData.location}
              </text>

              {/* Animated Flap */}
              <motion.path
                d="M8 40 L144 135 L280 40"
                fill={themeStyles.bgSecondary}
                stroke={themeStyles.accentSecondary}
                strokeWidth="1.5"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: [0, 0, 180] }}
                transition={{ duration: 2.2, delay: 0.8, times: [0, 0.3, 1] }}
                style={{ transformOrigin: '144px 40px' }}
              />

              {/* Wax Seal with Couple Monogram */}
              <motion.circle
                cx="144"
                cy="90"
                r="20"
                fill={themeStyles.buttonBg}
                stroke={themeStyles.accentSecondary}
                strokeWidth="1.5"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: [1, 1, 0], scale: [1, 1, 0.8] }}
                transition={{ duration: 2.2, delay: 0.8, times: [0, 0.3, 0.6] }}
              />
              <motion.text
                x="144"
                y="95"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="11"
                fill={themeStyles.buttonText}
                fontWeight="700"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0] }}
                transition={{ duration: 2.2, delay: 0.8, times: [0, 0.3, 0.6] }}
              >
                {initials}
              </motion.text>
            </svg>
          </div>

          <p
            className="font-heading text-2xl sm:text-3xl font-semibold mb-2"
            style={{ color: themeStyles.textPrimary }}
          >
            Auspicious Wedding Invitation
          </p>
          <p
            className="font-body text-xs tracking-wider mb-6"
            style={{ color: themeStyles.textSecondary }}
          >
            Tap below to open your personalized invitation
          </p>
        </motion.div>

        {/* Tap to Open CTA */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={onOpen}
          className="px-8 py-3.5 rounded-full font-body text-xs uppercase tracking-widest font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          style={{
            backgroundColor: themeStyles.buttonBg,
            color: themeStyles.buttonText,
          }}
        >
          <span>Open Invitation</span>
          <Heart size={15} fill="currentColor" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Countdown Section ───
function CountdownSection({ targetDate, themeStyles }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const units = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' },
  ];

  return (
    <div className="py-12 px-4 text-center">
      <span
        className="font-body text-[11px] uppercase tracking-[0.25em] font-semibold block mb-2"
        style={{ color: themeStyles.accentSecondary }}
      >
        Auspicious Countdown
      </span>
      <h3
        className="font-heading text-2xl sm:text-3xl font-bold mb-8"
        style={{ color: themeStyles.textPrimary }}
      >
        Until The Sacred Vows
      </h3>

      <div className="flex justify-center gap-3 sm:gap-4 max-w-sm mx-auto">
        {units.map((u, i) => (
          <div
            key={i}
            className="flex-1 py-3 px-2 rounded-xl shadow-xs border text-center"
            style={{
              backgroundColor: themeStyles.cardBg,
              borderColor: `${themeStyles.accentPrimary}50`,
            }}
          >
            <span
              className="font-heading text-2xl sm:text-3xl font-bold block"
              style={{ color: themeStyles.textPrimary }}
            >
              {String(u.value).padStart(2, '0')}
            </span>
            <span
              className="font-body text-[10px] uppercase tracking-wider block mt-0.5"
              style={{ color: themeStyles.textSecondary }}
            >
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RSVP Interactive Form ───
function RSVPBox({ themeStyles }) {
  const [rsvp, setRsvp] = useState({
    name: '',
    attending: '',
    guests: '1',
    diet: 'Pure Vegetarian',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleRSVP = (e) => {
    e.preventDefault();
    if (!rsvp.name || !rsvp.attending) return;
    try {
      const existing = JSON.parse(localStorage.getItem('aahvaaan_rsvps') || '[]');
      existing.push({ ...rsvp, time: new Date().toISOString() });
      localStorage.setItem('aahvaaan_rsvps', JSON.stringify(existing));
    } catch (err) {
      // Ignore
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: `${themeStyles.accentPrimary}30` }}
        >
          <Heart size={22} style={{ color: themeStyles.textPrimary }} />
        </div>
        <h4
          className="font-heading text-2xl font-bold mb-2"
          style={{ color: themeStyles.textPrimary }}
        >
          Response Received!
        </h4>
        <p className="font-body text-xs text-charcoal/70 max-w-xs mx-auto mb-4">
          {rsvp.attending === 'yes'
            ? 'We are delighted and look forward to celebrating with you!'
            : 'Thank you for letting us know. Your blessings remain with us!'}
        </p>
        <p className="font-body text-[11px] text-charcoal/40 italic">
          (Interactive Demo: Responses are stored locally in your browser)
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleRSVP} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block font-body text-xs font-semibold mb-1 text-charcoal">
          Your Full Name / Family Name
        </label>
        <input
          type="text"
          required
          value={rsvp.name}
          onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
          placeholder="e.g. Rajesh & Sunita Sharma"
          className="w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs font-body focus:outline-none"
          style={{ borderColor: `${themeStyles.accentPrimary}60` }}
        />
      </div>

      <div>
        <label className="block font-body text-xs font-semibold mb-1.5 text-charcoal">
          Will you grace the celebration?
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { value: 'yes', label: 'Joyfully Attend' },
            { value: 'no', label: 'Regretfully Decline' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRsvp({ ...rsvp, attending: opt.value })}
              className={`py-2 px-3 rounded-lg text-xs font-body font-medium transition-all ${
                rsvp.attending === opt.value
                  ? 'shadow-sm text-white'
                  : 'bg-white border text-charcoal'
              }`}
              style={{
                backgroundColor: rsvp.attending === opt.value ? themeStyles.buttonBg : undefined,
                borderColor: `${themeStyles.accentPrimary}60`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {rsvp.attending === 'yes' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-body text-xs font-semibold mb-1 text-charcoal">
              Number of Guests
            </label>
            <select
              value={rsvp.guests}
              onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}
              className="w-full px-3 py-2 bg-white border rounded-lg text-xs font-body focus:outline-none"
              style={{ borderColor: `${themeStyles.accentPrimary}60` }}
            >
              {[1, 2, 3, 4, 5, '6+'].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-body text-xs font-semibold mb-1 text-charcoal flex items-center gap-1">
              <Utensils size={12} /> Food Preference
            </label>
            <select
              value={rsvp.diet}
              onChange={(e) => setRsvp({ ...rsvp, diet: e.target.value })}
              className="w-full px-3 py-2 bg-white border rounded-lg text-xs font-body focus:outline-none"
              style={{ borderColor: `${themeStyles.accentPrimary}60` }}
            >
              <option value="Pure Vegetarian">Pure Vegetarian</option>
              <option value="Jain (No Onion/Garlic)">Jain (No Onion/Garlic)</option>
              <option value="Multi-Cuisine">Multi-Cuisine</option>
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block font-body text-xs font-semibold mb-1 text-charcoal">
          Warm Blessings & Wishes for the Couple (Optional)
        </label>
        <textarea
          rows={2}
          value={rsvp.note}
          onChange={(e) => setRsvp({ ...rsvp, note: e.target.value })}
          placeholder="Write your heartfelt blessings..."
          className="w-full px-3.5 py-2 bg-white border rounded-lg text-xs font-body focus:outline-none"
          style={{ borderColor: `${themeStyles.accentPrimary}60` }}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold shadow-sm transition-all text-white"
        style={{ backgroundColor: themeStyles.buttonBg }}
      >
        Submit RSVP Response
      </button>

      <p className="font-body text-[10px] text-charcoal/40 text-center">
        Demo RSVP preview • Client invitations sync automatically to WhatsApp / Google Sheets
      </p>
    </form>
  );
}

// ─── Add to Calendar Helper ───
function downloadEventCalendar(event, bride, groom) {
  const formatDate = (dateStr, timeStr) => {
    const d = new Date(dateStr);
    const m = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (m) {
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2], 10);
      const p = m[3].toUpperCase();
      if (p === 'PM' && h !== 12) h += 12;
      if (p === 'AM' && h === 12) h = 0;
      d.setHours(h, min, 0, 0);
    }
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const start = formatDate(event.date, event.time);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aahvaaan//WeddingInvitation//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `SUMMARY:${bride.split(' ')[0]} & ${groom.split(' ')[0]}'s ${event.name}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.venue}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.name.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Main Preview Page Component ───
export default function InvitationPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find template or default to first
  const template = templates.find((t) => t.id === id) || templates[0];
  const { sampleData, palette, themeStyles } = template;

  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [viewMode, setViewMode] = useState('full'); // 'full' or 'mobile'
  const [guestName, setGuestName] = useState('The Patidar Family');
  const [customGuestActive, setCustomGuestActive] = useState(false);
  const { isPlaying, toggle: toggleAudio, start: startAudio } = useWeddingAudio();

  const formattedDate = new Date(sampleData.weddingDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="pt-20 min-h-screen bg-ivory">
      {/* Envelope & Palace Gate Opening Overlay */}
      <AnimatePresence>
        {!envelopeOpen && (
          <EnvelopeOpening
            template={template}
            guestName={guestName}
            onOpen={() => {
              setEnvelopeOpen(true);
              startAudio();
            }}
          />
        )}
      </AnimatePresence>

      {/* Top Floating Action Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-champagne sticky top-16 md:top-20 z-40 shadow-xs">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Back & Info */}
          <div className="flex items-center gap-3">
            <Link
              to="/invitations"
              className="inline-flex items-center gap-1.5 text-charcoal/70 hover:text-wine font-body text-xs font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Designs</span>
            </Link>

            <span className="hidden sm:inline-block text-charcoal/30">|</span>

            <div className="hidden sm:flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-champagne"
                style={{ backgroundColor: themeStyles.buttonBg }}
              />
              <span className="font-heading text-sm font-bold text-wine">
                {template.name}
              </span>
              <span className="text-xs text-gold font-body">
                ({template.collection})
              </span>
            </div>
          </div>

          {/* Interactive Guest Name Personalization Tester */}
          <div className="hidden lg:flex items-center gap-2 bg-ivory px-3 py-1 rounded-full border border-champagne">
            <UserCheck size={13} className="text-gold" />
            <span className="text-[11px] font-body text-charcoal/70">Test Guest Greeting:</span>
            {!customGuestActive ? (
              <div className="flex items-center gap-1.5">
                <select
                  value={guestName}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setCustomGuestActive(true);
                      setGuestName('');
                    } else {
                      setGuestName(e.target.value);
                    }
                  }}
                  className="bg-transparent text-xs font-semibold text-wine focus:outline-none cursor-pointer"
                >
                  <option value="The Patidar Family">The Patidar Family</option>
                  <option value="Mr. & Mrs. Sharma">Mr. & Mrs. Sharma</option>
                  <option value="Kapoor Family (Chacha-Chachi)">Kapoor Family (Chacha-Chachi)</option>
                  <option value="Arjun & Dearest Friends">Arjun & Dearest Friends</option>
                  <option value="__custom__">Type Custom Name...</option>
                </select>
                <button
                  type="button"
                  onClick={() => setCustomGuestActive(true)}
                  className="text-gold hover:text-wine p-0.5"
                  title="Type custom name"
                >
                  <Edit3 size={11} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Gupta Family"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-32 px-2 py-0.5 text-xs bg-white border border-champagne rounded text-wine font-semibold focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setCustomGuestActive(false)}
                  className="text-[10px] text-charcoal/60 hover:text-wine underline"
                >
                  Presets
                </button>
              </div>
            )}
          </div>

          {/* Controls: Ambient Music, Replay Envelope, Device Toggle, Buy Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Wedding Shehnai & Tanpura Player */}
            <button
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-wine text-white shadow-xs'
                  : 'bg-ivory text-charcoal/70 border border-champagne hover:border-wine hover:text-wine'
              }`}
              title={isPlaying ? 'Pause Traditional Shehnai Music' : 'Play Traditional Shehnai Music'}
            >
              {isPlaying ? (
                <>
                  <Volume2 size={14} className="text-gold" />
                  <span className="hidden sm:inline">Shehnai Music</span>
                  <span className="flex items-end gap-0.5 h-3 ml-0.5">
                    <span className="w-0.5 h-3 bg-gold rounded-full animate-pulse" />
                    <span className="w-0.5 h-2 bg-gold rounded-full animate-bounce" />
                    <span className="w-0.5 h-2.5 bg-gold rounded-full animate-pulse delay-75" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={14} />
                  <span className="hidden sm:inline">Play Shehnai</span>
                </>
              )}
            </button>

            {/* Replay Envelope button */}
            <button
              onClick={() => setEnvelopeOpen(false)}
              className="p-2 rounded-lg text-charcoal/60 hover:text-wine hover:bg-champagne/30 text-xs font-body flex items-center gap-1 transition-all"
              title="Replay Envelope Opening Animation"
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">Replay</span>
            </button>

            {/* View Mode Toggle (Mobile Simulator vs Full Screen) */}
            <div className="bg-champagne/40 rounded-lg p-0.5 flex items-center">
              <button
                onClick={() => setViewMode('full')}
                className={`p-1.5 rounded-md text-xs transition-all ${
                  viewMode === 'full' ? 'bg-white text-wine shadow-xs' : 'text-charcoal/60'
                }`}
                title="Full Screen View"
              >
                <Monitor size={15} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md text-xs transition-all ${
                  viewMode === 'mobile' ? 'bg-white text-wine shadow-xs' : 'text-charcoal/60'
                }`}
                title="Mobile Device Frame Preview"
              >
                <Smartphone size={15} />
              </button>
            </div>

            {/* PROMINENT "BUY THIS TEMPLATE" CTA */}
            <Link
              to={`/buy/${template.id}`}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 sm:px-4 rounded-lg bg-wine hover:bg-gold text-white font-body text-xs uppercase tracking-wider font-semibold shadow-md transition-all duration-300"
            >
              <ShoppingBag size={14} />
              <span>Buy This Template</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Preview Container: either Full width or enclosed Mobile Simulator Frame */}
      <div className={`mx-auto ${viewMode === 'mobile' ? 'max-w-md py-10 px-4' : 'w-full'}`}>
        <div
          className={`overflow-hidden transition-all duration-500 ${
            viewMode === 'mobile'
              ? 'rounded-[40px] border-[10px] border-charcoal shadow-2xl relative'
              : 'shadow-none'
          }`}
          style={{ backgroundColor: themeStyles.bgPrimary }}
        >
          {/* Mobile phone camera notch in simulator mode */}
          {viewMode === 'mobile' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-charcoal rounded-full z-30" />
          )}

          {/* ════ SECTION 1: AUSPICIOUS SHLOKA & GUEST SALUTATION ════ */}
          <section
            className="pt-16 pb-12 px-6 sm:px-10 text-center border-b"
            style={{
              backgroundColor: themeStyles.bgPrimary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            {/* Sanskrit Shloka */}
            <div className="max-w-xl mx-auto mb-6">
              <p
                className="font-heading text-sm sm:text-base tracking-widest font-bold mb-2"
                style={{ color: themeStyles.accentSecondary }}
              >
                {sampleData.shloka}
              </p>
              <div
                className="w-12 h-0.5 mx-auto opacity-60"
                style={{ backgroundColor: themeStyles.accentSecondary }}
              />
            </div>

            {/* Personalized Guest Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-2xl max-w-lg mx-auto border shadow-xs"
              style={{
                backgroundColor: themeStyles.cardBg,
                borderColor: `${themeStyles.accentPrimary}60`,
              }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.25em] font-semibold block mb-1"
                style={{ color: themeStyles.accentSecondary }}
              >
                Personal Invitation For
              </span>
              <h2
                className="font-heading text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: themeStyles.textPrimary }}
              >
                {guestName}
              </h2>
              <p
                className="font-body text-xs sm:text-sm italic leading-relaxed"
                style={{ color: themeStyles.textSecondary }}
              >
                We cordially invite you to grace the auspicious occasion of the marriage of our children and bestow your blessings upon the new couple.
              </p>
            </motion.div>
          </section>

          {/* ════ SECTION 2: FORMAL FAMILY LINEAGE (Chi. & Kum.) ════ */}
          <section
            className="py-16 px-6 sm:px-10 border-b"
            style={{
              backgroundColor: themeStyles.bgSecondary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <span
                  className="font-body text-[11px] uppercase tracking-[0.25em] font-semibold block mb-1"
                  style={{ color: themeStyles.accentSecondary }}
                >
                  Subh Vivaah
                </span>
                <h2
                  className="font-heading text-3xl sm:text-4xl font-bold mb-2"
                  style={{ color: themeStyles.textPrimary }}
                >
                  The Bride & The Groom
                </h2>
                <div
                  className="w-14 h-0.5 mx-auto"
                  style={{ backgroundColor: themeStyles.accentSecondary }}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Groom Card */}
                <div
                  className="p-6 rounded-2xl border text-center shadow-xs"
                  style={{
                    backgroundColor: themeStyles.cardBg,
                    borderColor: `${themeStyles.accentPrimary}60`,
                  }}
                >
                  <span
                    className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3 inline-block"
                    style={{
                      backgroundColor: `${themeStyles.accentPrimary}30`,
                      color: themeStyles.textPrimary,
                    }}
                  >
                    Groom
                  </span>
                  <h3
                    className="font-heading text-2xl font-bold mb-3"
                    style={{ color: themeStyles.textPrimary }}
                  >
                    {sampleData.groomFormal}
                  </h3>
                  <div className="space-y-2 text-xs font-body text-charcoal/80">
                    <p>
                      <strong className="block text-charcoal/50 text-[10px] uppercase tracking-wider">Son of:</strong>
                      {sampleData.groomLineage.parents}
                    </p>
                    <p>
                      <strong className="block text-charcoal/50 text-[10px] uppercase tracking-wider">Grandson of:</strong>
                      {sampleData.groomLineage.grandparents}
                    </p>
                  </div>
                </div>

                {/* Bride Card */}
                <div
                  className="p-6 rounded-2xl border text-center shadow-xs"
                  style={{
                    backgroundColor: themeStyles.cardBg,
                    borderColor: `${themeStyles.accentPrimary}60`,
                  }}
                >
                  <span
                    className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3 inline-block"
                    style={{
                      backgroundColor: `${themeStyles.accentPrimary}30`,
                      color: themeStyles.textPrimary,
                    }}
                  >
                    Bride
                  </span>
                  <h3
                    className="font-heading text-2xl font-bold mb-3"
                    style={{ color: themeStyles.textPrimary }}
                  >
                    {sampleData.brideFormal}
                  </h3>
                  <div className="space-y-2 text-xs font-body text-charcoal/80">
                    <p>
                      <strong className="block text-charcoal/50 text-[10px] uppercase tracking-wider">Daughter of:</strong>
                      {sampleData.brideLineage.parents}
                    </p>
                    <p>
                      <strong className="block text-charcoal/50 text-[10px] uppercase tracking-wider">Granddaughter of:</strong>
                      {sampleData.brideLineage.grandparents}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ceremony Date & Venue Callout */}
              <div className="mt-8 text-center">
                <div
                  className="inline-block py-3 px-8 rounded-full border shadow-xs"
                  style={{
                    backgroundColor: themeStyles.cardBg,
                    borderColor: `${themeStyles.accentPrimary}60`,
                  }}
                >
                  <p
                    className="font-heading text-xl sm:text-2xl font-bold"
                    style={{ color: themeStyles.textPrimary }}
                  >
                    {formattedDate}
                  </p>
                  <p
                    className="font-body text-xs text-charcoal/70"
                  >
                    {sampleData.venue}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ════ SECTION 3: COUNTDOWN TIMER ════ */}
          <section
            style={{
              backgroundColor: themeStyles.bgPrimary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
            className="border-b"
          >
            <CountdownSection
              targetDate={sampleData.weddingDate}
              themeStyles={themeStyles}
            />
          </section>

          {/* ════ SECTION 4: CEREMONY ITINERARY (Arched Cards like Balcony) ════ */}
          <section
            className="py-16 px-6 sm:px-10 border-b"
            style={{
              backgroundColor: themeStyles.bgSecondary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <span
                  className="font-body text-[11px] uppercase tracking-[0.25em] font-semibold block mb-2"
                  style={{ color: themeStyles.accentSecondary }}
                >
                  Wedding Itinerary
                </span>
                <h2
                  className="font-heading text-3xl sm:text-4xl font-bold mb-3"
                  style={{ color: themeStyles.textPrimary }}
                >
                  Ceremonies
                </h2>
                <div
                  className="w-14 h-0.5 mx-auto"
                  style={{ backgroundColor: themeStyles.accentSecondary }}
                />
              </div>

              <div className="space-y-6">
                {sampleData.events.map((evt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-2xl p-6 sm:p-7 shadow-sm border transition-all hover:shadow-md relative overflow-hidden"
                    style={{
                      backgroundColor: themeStyles.cardBg,
                      borderColor: `${themeStyles.accentPrimary}60`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="text-3xl p-3 rounded-2xl flex-shrink-0"
                        style={{ backgroundColor: `${themeStyles.bgPrimary}` }}
                      >
                        {evt.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                          <h3
                            className="font-heading text-2xl font-bold"
                            style={{ color: themeStyles.textPrimary }}
                          >
                            {evt.name}
                          </h3>
                          <span
                            className="font-body text-xs font-semibold px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: `${themeStyles.accentPrimary}30`,
                              color: themeStyles.textPrimary,
                            }}
                          >
                            {evt.time}
                          </span>
                        </div>

                        <p
                          className="font-body text-xs font-medium flex items-center gap-1.5 mb-2.5"
                          style={{ color: themeStyles.accentSecondary }}
                        >
                          <Calendar size={13} />
                          {new Date(evt.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>

                        <p
                          className="font-body text-xs sm:text-sm leading-relaxed mb-4 text-charcoal/75"
                        >
                          {evt.description}
                        </p>

                        {/* Venue address & actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-champagne/40">
                          <span
                            className="font-body text-xs flex items-center gap-1.5 text-charcoal/70"
                          >
                            <MapPin size={13} className="text-gold" />
                            {evt.venue}
                          </span>

                          <div className="flex items-center gap-3">
                            <a
                              href={sampleData.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-body text-xs font-semibold flex items-center gap-1 hover:underline"
                              style={{ color: themeStyles.buttonBg }}
                            >
                              <span>Get Directions</span>
                              <ExternalLink size={12} />
                            </a>

                            <span className="text-charcoal/20">|</span>

                            <button
                              type="button"
                              onClick={() =>
                                downloadEventCalendar(evt, sampleData.bride, sampleData.groom)
                              }
                              className="font-body text-xs font-semibold hover:underline flex items-center gap-1"
                              style={{ color: themeStyles.accentSecondary }}
                            >
                              <Clock size={12} />
                              Add to Calendar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════ SECTION 5: WITH BEST COMPLIMENTS FROM (शुभकामनाएं) ════ */}
          <section
            className="py-16 px-6 sm:px-10 border-b"
            style={{
              backgroundColor: themeStyles.bgPrimary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <span
                className="font-body text-[11px] uppercase tracking-[0.25em] font-semibold block mb-2"
                style={{ color: themeStyles.accentSecondary }}
              >
                स्नेही स्वजन • With Best Compliments From
              </span>
              <h2
                className="font-heading text-3xl font-bold mb-3"
                style={{ color: themeStyles.textPrimary }}
              >
                Our Families & Elders
              </h2>
              <div
                className="w-14 h-0.5 mx-auto mb-8"
                style={{ backgroundColor: themeStyles.accentSecondary }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {sampleData.compliments.map((c, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border shadow-xs"
                    style={{
                      backgroundColor: themeStyles.cardBg,
                      borderColor: `${themeStyles.accentPrimary}60`,
                    }}
                  >
                    <span
                      className="font-heading text-xs font-bold block"
                      style={{ color: themeStyles.accentSecondary }}
                    >
                      {c.relation}
                    </span>
                    <span className="font-body text-sm font-semibold text-charcoal">
                      {c.names}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ════ SECTION 6: A NOTE FROM US (Love Story) ════ */}
          <section
            className="py-16 px-6 sm:px-10 border-b"
            style={{
              backgroundColor: themeStyles.bgSecondary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            <div className="max-w-xl mx-auto text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${themeStyles.accentPrimary}30` }}
              >
                <Heart size={20} style={{ color: themeStyles.textPrimary }} />
              </div>

              <span
                className="font-body text-[11px] uppercase tracking-[0.25em] font-semibold block mb-2"
                style={{ color: themeStyles.accentSecondary }}
              >
                A Note From Us
              </span>

              <h2
                className="font-heading text-3xl font-bold mb-6"
                style={{ color: themeStyles.textPrimary }}
              >
                Our Story
              </h2>

              <p
                className="font-body text-sm sm:text-base leading-relaxed italic"
                style={{ color: themeStyles.textSecondary }}
              >
                "{sampleData.coupleStory}"
              </p>
            </div>
          </section>

          {/* ════ SECTION 7: MOMENTS OF US (Photo Gallery) ════ */}
          <section
            className="py-16 px-6 sm:px-10 border-b"
            style={{
              backgroundColor: themeStyles.bgPrimary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <span
                  className="font-body text-[11px] uppercase tracking-[0.25em] font-semibold block mb-2"
                  style={{ color: themeStyles.accentSecondary }}
                >
                  Pre-Wedding Memories
                </span>
                <h2
                  className="font-heading text-3xl font-bold mb-3"
                  style={{ color: themeStyles.textPrimary }}
                >
                  Moments of Us
                </h2>
                <div
                  className="w-14 h-0.5 mx-auto"
                  style={{ backgroundColor: themeStyles.accentSecondary }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sampleData.gallery.map((photo, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-square rounded-xl overflow-hidden border shadow-xs"
                    style={{ borderColor: `${themeStyles.accentPrimary}60` }}
                  >
                    <img
                      src={photo}
                      alt={`Couple photo ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ════ SECTION 8: YOUR PRESENCE MEANS THE WORLD TO US (RSVP) ════ */}
          <section
            className="py-16 px-6 sm:px-10 border-b"
            style={{
              backgroundColor: themeStyles.bgSecondary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <span
                  className="font-body text-[11px] uppercase tracking-[0.25em] font-semibold block mb-2"
                  style={{ color: themeStyles.accentSecondary }}
                >
                  Your Presence Means The World To Us
                </span>
                <h2
                  className="font-heading text-3xl font-bold mb-3"
                  style={{ color: themeStyles.textPrimary }}
                >
                  RSVP
                </h2>
                <div
                  className="w-14 h-0.5 mx-auto"
                  style={{ backgroundColor: themeStyles.accentSecondary }}
                />
              </div>

              <div
                className="p-6 sm:p-8 rounded-2xl shadow-sm border"
                style={{
                  backgroundColor: themeStyles.cardBg,
                  borderColor: `${themeStyles.accentPrimary}60`,
                }}
              >
                <RSVPBox themeStyles={themeStyles} />
              </div>
            </div>
          </section>

          {/* ════ SECTION 9: PROMINENT BOTTOM CTA ════ */}
          <section
            className="py-16 px-6 text-center"
            style={{
              backgroundColor: themeStyles.bgPrimary,
            }}
          >
            <div className="max-w-xl mx-auto">
              <p
                className="font-body text-xs uppercase tracking-[0.25em] font-semibold mb-2"
                style={{ color: themeStyles.accentSecondary }}
              >
                Love This Invitation Style?
              </p>
              <h3
                className="font-heading text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: themeStyles.textPrimary }}
              >
                Customise {template.name} for Your Wedding
              </h3>
              <p
                className="font-body text-sm leading-relaxed mb-8"
                style={{ color: themeStyles.textSecondary }}
              >
                Choose from Starter (₹999), Signature (₹1,499), or Luxury (₹1,999). Receive your live link with RSVP tracking, Google Maps, and WhatsApp delivery in 24–48 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={`/buy/${template.id}`}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg font-body text-xs uppercase tracking-widest font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: themeStyles.buttonBg,
                    color: themeStyles.buttonText,
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>Buy This Template Now</span>
                </Link>

                <Link
                  to="/invitations"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg font-body text-xs uppercase tracking-widest font-semibold border transition-all duration-300"
                  style={{
                    borderColor: themeStyles.buttonBg,
                    color: themeStyles.buttonBg,
                  }}
                >
                  <span>Explore All 4 Signature Designs</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Bottom Sticky Bar (Balcony-Style Persistent CTA) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl bg-white/95 backdrop-blur-md border border-champagne/80 shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-body text-charcoal/60 uppercase tracking-wider block">
            {template.name} • {template.collection}
          </span>
          <span className="font-heading text-base sm:text-lg font-bold text-wine">
            {template.priceDisplay || 'Starts at ₹999'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/buy/${template.id}`}
            className="inline-flex items-center gap-1.5 py-2.5 px-4 sm:px-6 rounded-xl bg-wine hover:bg-gold text-white font-body text-xs uppercase tracking-wider font-semibold shadow-md transition-all duration-300"
          >
            <ShoppingBag size={14} />
            <span>Buy This Template</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
