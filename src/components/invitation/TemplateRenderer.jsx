import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Clock, Camera, Users,
  ExternalLink, Check, Utensils, Sparkles, Volume2, VolumeX
} from 'lucide-react';
import useCountdown from '../../hooks/useCountdown';
import MaharajaRoyalInvitation from './templates/MaharajaRoyalInvitation';
import InteractiveStoryInvitation from './templates/InteractiveStoryInvitation';
import MorPankhInvitation from './templates/MorPankhInvitation';

// ─── Add to Calendar Helper ───
export function downloadEventCalendar(event, bride, groom) {
  const formatDate = (dateStr, timeStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const m = (timeStr || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (m) {
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const p = m[3].toUpperCase();
        if (p === 'PM' && h !== 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;
        d.setHours(h, min, 0, 0);
      }
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    } catch {
      return '';
    }
  };

  const start = formatDate(event.date, event.time);
  const brideFirst = (bride || 'Bride').split(' ')[0];
  const groomFirst = (groom || 'Groom').split(' ')[0];
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aahvaaan//WeddingInvitation//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `SUMMARY:${brideFirst} & ${groomFirst}'s ${event.name || 'Wedding Celebration'}`,
    `DESCRIPTION:${event.description || ''}${event.dressCode ? ` | Dress Code: ${event.dressCode}` : ''}`,
    `LOCATION:${event.venue || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(event.name || 'ceremony').toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Auspicious Countdown Section ───
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
            className="flex-1 py-3 px-2 rounded-xl shadow-xs border text-center transition-transform hover:scale-105"
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

// ─── Envelope Opening Animation Component ───
export function InvitationEnvelope({
  template,
  content,
  guestName,
  onOpen,
}) {
  const { themeStyles, collection } = template;
  const brideName = content.brideName || content.bride || 'Bride';
  const groomName = content.groomName || content.groom || 'Groom';
  const weddingDate = content.weddingDate || '2027-02-22';
  const location = content.location || content.venue || 'Jaipur, Rajasthan';
  const initials = `${brideName.charAt(0)} & ${groomName.charAt(0)}`;

  const formattedDate = new Date(weddingDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto"
      style={{ backgroundColor: `${themeStyles.bgPrimary}fa` }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center max-w-sm sm:max-w-md w-full px-2 py-6">
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6"
        >
          {/* Collection Name */}
          <span
            className="inline-block text-[11px] uppercase tracking-[0.25em] font-semibold py-1 px-4 rounded-full mb-3 shadow-xs border"
            style={{
              backgroundColor: themeStyles.badgeBg,
              color: themeStyles.badgeText,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            {collection || template.name}
          </span>

          {/* Guest Personal Salutation */}
          <p
            className="font-heading text-base italic mb-1"
            style={{ color: themeStyles.textSecondary }}
          >
            Cordially Inviting
          </p>
          <h2
            className="font-heading text-2xl sm:text-3xl font-bold mb-4"
            style={{ color: themeStyles.textPrimary }}
          >
            {guestName || 'Respected Guest & Family'}
          </h2>

          {/* Envelope Graphic */}
          <div className="relative w-64 sm:w-72 h-48 mx-auto mb-5 drop-shadow-xl">
            <svg viewBox="0 0 288 208" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer Envelope */}
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
              {/* Inner Liner */}
              <rect
                x="20"
                y="52"
                width="248"
                height="136"
                rx="8"
                fill={themeStyles.bgPrimary}
              />
              {/* Inner Border */}
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
              <text
                x="144"
                y="95"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="16"
                fill={themeStyles.textPrimary}
                fontWeight="700"
              >
                {brideName.split(' ')[0]} & {groomName.split(' ')[0]}
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
                {formattedDate}
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
                {location}
              </text>

              {/* Animated Flap */}
              <motion.path
                d="M8 40 L144 135 L280 40"
                fill={themeStyles.bgSecondary}
                stroke={themeStyles.accentSecondary}
                strokeWidth="1.5"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: [0, 0, 180] }}
                transition={{ duration: 2, delay: 0.6, times: [0, 0.3, 1] }}
                style={{ transformOrigin: '144px 40px' }}
              />

              {/* Wax Seal with Monogram */}
              <motion.circle
                cx="144"
                cy="90"
                r="19"
                fill={themeStyles.buttonBg}
                stroke={themeStyles.accentSecondary}
                strokeWidth="1.5"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: [1, 1, 0], scale: [1, 1, 0.8] }}
                transition={{ duration: 2, delay: 0.6, times: [0, 0.3, 0.6] }}
              />
              <motion.text
                x="144"
                y="94"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="10"
                fill={themeStyles.buttonText}
                fontWeight="700"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0] }}
                transition={{ duration: 2, delay: 0.6, times: [0, 0.3, 0.6] }}
              >
                {initials}
              </motion.text>
            </svg>
          </div>

          <p
            className="font-heading text-xl sm:text-2xl font-semibold mb-1"
            style={{ color: themeStyles.textPrimary }}
          >
            Auspicious Wedding Invitation
          </p>
          <p
            className="font-body text-xs tracking-wider mb-5"
            style={{ color: themeStyles.textSecondary }}
          >
            Tap below to open your personalized invitation
          </p>
        </motion.div>

        {/* Tap to Open CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={onOpen}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full font-body text-xs uppercase tracking-widest font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto active:scale-95"
          style={{
            backgroundColor: themeStyles.buttonBg,
            color: themeStyles.buttonText,
          }}
        >
          <span>Open Invitation</span>
          <Heart size={14} fill="currentColor" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Default Interactive RSVP Form ───
function DefaultRSVPForm({ themeStyles }) {
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
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6 px-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: `${themeStyles.accentPrimary}30` }}
        >
          <Heart size={22} style={{ color: themeStyles.textPrimary }} />
        </div>
        <h4
          className="font-heading text-xl font-bold mb-2"
          style={{ color: themeStyles.textPrimary }}
        >
          Response Received!
        </h4>
        <p className="font-body text-xs max-w-xs mx-auto mb-2" style={{ color: themeStyles.textSecondary }}>
          {rsvp.attending === 'yes'
            ? 'We are delighted and look forward to celebrating with you!'
            : 'Thank you for letting us know. Your blessings remain with us!'}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold underline mt-2"
          style={{ color: themeStyles.buttonBg }}
        >
          Change Response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleRSVP} className="space-y-4 max-w-md mx-auto text-left">
      <div>
        <label className="block font-body text-xs font-semibold mb-1" style={{ color: themeStyles.textPrimary }}>
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
        <label className="block font-body text-xs font-semibold mb-1.5" style={{ color: themeStyles.textPrimary }}>
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
                rsvp.attending === opt.value ? 'shadow-sm text-white' : 'bg-white border'
              }`}
              style={{
                backgroundColor: rsvp.attending === opt.value ? themeStyles.buttonBg : undefined,
                color: rsvp.attending === opt.value ? themeStyles.buttonText : themeStyles.textSecondary,
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
            <label className="block font-body text-xs font-semibold mb-1" style={{ color: themeStyles.textPrimary }}>
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
            <label className="block font-body text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: themeStyles.textPrimary }}>
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
        <label className="block font-body text-xs font-semibold mb-1" style={{ color: themeStyles.textPrimary }}>
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
        className="w-full py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold shadow-sm transition-all"
        style={{
          backgroundColor: themeStyles.buttonBg,
          color: themeStyles.buttonText,
        }}
      >
        Submit RSVP Response
      </button>
    </form>
  );
}

// ─── PURE DATA-DRIVEN TEMPLATE RENDERER ───
export default function TemplateRenderer({
  template,
  content = {},
  guestName,
  rsvpComponent = null,
  showEnvelope = false,
  onOpenEnvelope = null,
}) {
  // Default & Primary: Mor Pankh Royal Invitation
  if (
    !template?.id ||
    template?.id === 'mor-pankh' ||
    template?.alias === 'mor-pankh' ||
    template?.id === 'rose-watercolor' ||
    template?.alias === 'champagne-and-rose' ||
    template?.id === 'lotus-lagoon' ||
    template?.id === 'lotus-royale' ||
    template?.id === 'royal-maroon-and-gold' ||
    template?.alias === 'royal-maroon-and-gold'
  ) {
    return (
      <MorPankhInvitation
        template={template}
        content={content}
        guestName={guestName}
        rsvpComponent={rsvpComponent}
      />
    );
  }

  // Fallback to Mor Pankh
  return (
    <MorPankhInvitation
      template={template}
      content={content}
      guestName={guestName}
      rsvpComponent={rsvpComponent}
    />
  );
  const themeStyles = template.themeStyles || {
    bgPrimary: '#FAF6F0',
    bgSecondary: '#E9D7CC',
    textPrimary: '#704B50',
    textSecondary: '#65575A',
    accentPrimary: '#C99B91',
    accentSecondary: '#B69A70',
    buttonBg: '#704B50',
    buttonText: '#FAF6F0',
    cardBg: '#FFFFFF',
    badgeBg: '#E9D7CC',
    badgeText: '#704B50',
  };

  // Safe normalized fields from content JSON
  const brideName = content.brideName || content.bride || 'Bride';
  const groomName = content.groomName || content.groom || 'Groom';
  const brideFormal = content.brideFormal || `Kum. ${brideName}`;
  const groomFormal = content.groomFormal || `Chi. ${groomName}`;
  const shloka = content.shloka || '|| वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ||';
  const weddingDate = content.weddingDate || '2027-02-22';
  const location = content.location || 'Jaipur, Rajasthan';
  const venue = content.venue || 'The Oberoi Rajvilas, Jaipur';
  const mapUrl = content.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(venue)}`;
  const coupleStory = content.coupleStory || content.story || 'Together with our families, we joyfully invite you to share in our celebration of love, friendship, and sacred union.';

  // Lineage handling
  const lineage = content.lineage || {};
  const groomLineage = {
    parents: lineage.groomParents || content.groomLineage?.parents || 'Parents of Groom',
    grandparents: lineage.groomGrandparents || content.groomLineage?.grandparents || 'Grandparents of Groom',
  };
  const brideLineage = {
    parents: lineage.brideParents || content.brideLineage?.parents || 'Parents of Bride',
    grandparents: lineage.brideGrandparents || content.brideLineage?.grandparents || 'Grandparents of Bride',
  };

  // Events handling
  const events = Array.isArray(content.events) && content.events.length > 0
    ? content.events
    : [
        {
          name: 'Mehendi & High Tea',
          date: weddingDate,
          time: '3:00 PM',
          venue: venue,
          icon: '🌿',
          description: 'Henna, laughter and celebratory folk music.',
          dressCode: 'Pastels & Florals',
        },
        {
          name: 'The Sacred Pheras',
          date: weddingDate,
          time: '6:00 PM',
          venue: venue,
          icon: '💍',
          description: 'Sacred vows around the holy fire as twilight descends.',
          dressCode: 'Traditional Indian Elegance',
        },
      ];

  // Compliments / Elders
  const compliments = Array.isArray(content.compliments) && content.compliments.length > 0
    ? content.compliments
    : [
        { relation: 'With Blessings From', names: 'All Relatives & Elders of the Family' },
      ];

  // Gallery
  const gallery = Array.isArray(content.gallery) && content.gallery.length > 0
    ? content.gallery
    : [
        'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&fit=crop&q=80',
      ];

  const formattedWeddingDate = new Date(weddingDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full text-center selection:bg-amber-100 font-body" style={{ backgroundColor: themeStyles.bgPrimary }}>
      {/* Optional Envelope Modal */}
      <AnimatePresence>
        {showEnvelope && onOpenEnvelope && (
          <InvitationEnvelope
            template={template}
            content={content}
            guestName={guestName}
            onOpen={onOpenEnvelope}
          />
        )}
      </AnimatePresence>

      {/* ════ SECTION 1: AUSPICIOUS SHLOKA & GUEST SALUTATION ════ */}
      <section
        className="pt-16 pb-12 px-4 sm:px-8 border-b transition-colors"
        style={{
          backgroundColor: themeStyles.bgPrimary,
          borderColor: `${themeStyles.accentPrimary}40`,
        }}
      >
        {/* Sanskrit Shloka */}
        <div className="max-w-xl mx-auto mb-6">
          <p
            className="font-heading text-sm sm:text-base tracking-widest font-bold mb-2 leading-relaxed"
            style={{ color: themeStyles.accentSecondary }}
          >
            {shloka}
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
            {guestName || 'Respected Guest & Family'}
          </h2>
          <p
            className="font-body text-xs sm:text-sm italic leading-relaxed"
            style={{ color: themeStyles.textSecondary }}
          >
            We cordially invite you to grace the auspicious occasion of the marriage of our children and bestow your heartfelt blessings upon the new couple.
          </p>
        </motion.div>
      </section>

      {/* ════ SECTION 2: FORMAL FAMILY LINEAGE (Chi. & Kum.) ════ */}
      <section
        className="py-14 px-4 sm:px-8 border-b"
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
                {groomFormal}
              </h3>
              <div className="space-y-2 text-xs font-body" style={{ color: themeStyles.textSecondary }}>
                <p>
                  <strong className="block text-[10px] uppercase tracking-wider opacity-60">Son of:</strong>
                  {groomLineage.parents}
                </p>
                <p>
                  <strong className="block text-[10px] uppercase tracking-wider opacity-60">Grandson of:</strong>
                  {groomLineage.grandparents}
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
                {brideFormal}
              </h3>
              <div className="space-y-2 text-xs font-body" style={{ color: themeStyles.textSecondary }}>
                <p>
                  <strong className="block text-[10px] uppercase tracking-wider opacity-60">Daughter of:</strong>
                  {brideLineage.parents}
                </p>
                <p>
                  <strong className="block text-[10px] uppercase tracking-wider opacity-60">Granddaughter of:</strong>
                  {brideLineage.grandparents}
                </p>
              </div>
            </div>
          </div>

          {/* Ceremony Date & Venue Callout */}
          <div className="mt-8 text-center">
            <div
              className="inline-block py-3.5 px-8 rounded-full border shadow-xs max-w-lg w-full sm:w-auto"
              style={{
                backgroundColor: themeStyles.cardBg,
                borderColor: `${themeStyles.accentPrimary}60`,
              }}
            >
              <p
                className="font-heading text-xl sm:text-2xl font-bold mb-0.5"
                style={{ color: themeStyles.textPrimary }}
              >
                {formattedWeddingDate}
              </p>
              <p
                className="font-body text-xs"
                style={{ color: themeStyles.textSecondary }}
              >
                {venue}
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
          targetDate={weddingDate}
          themeStyles={themeStyles}
        />
      </section>

      {/* ════ SECTION 4: CEREMONY ITINERARY ════ */}
      <section
        className="py-14 px-4 sm:px-8 border-b"
        style={{
          backgroundColor: themeStyles.bgSecondary,
          borderColor: `${themeStyles.accentPrimary}40`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
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
            {events.map((evt, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-6 sm:p-7 shadow-xs border transition-all hover:shadow-md text-left"
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
                    {evt.icon || '🌸'}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                      <h3
                        className="font-heading text-2xl font-bold"
                        style={{ color: themeStyles.textPrimary }}
                      >
                        {evt.name}
                      </h3>
                      {evt.time && (
                        <span
                          className="font-body text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: `${themeStyles.accentPrimary}30`,
                            color: themeStyles.textPrimary,
                          }}
                        >
                          {evt.time}
                        </span>
                      )}
                    </div>

                    {evt.date && (
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
                    )}

                    {evt.description && (
                      <p className="font-body text-xs sm:text-sm leading-relaxed mb-3 text-charcoal/75">
                        {evt.description}
                      </p>
                    )}

                    {evt.dressCode && (
                      <p className="font-body text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: themeStyles.textPrimary }}>
                        <Sparkles size={12} className="text-amber-500" />
                        <span>Dress Code: {evt.dressCode}</span>
                      </p>
                    )}

                    {/* Venue & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-champagne/40">
                      <span className="font-body text-xs flex items-center gap-1.5 text-charcoal/70">
                        <MapPin size={13} className="text-amber-600 flex-shrink-0" />
                        <span className="truncate max-w-[220px]">{evt.venue || venue}</span>
                      </span>

                      <div className="flex items-center gap-3">
                        <a
                          href={mapUrl}
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
                          onClick={() => downloadEventCalendar(evt, brideName, groomName)}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ SECTION 5: WITH BEST COMPLIMENTS FROM (शुभकामनाएं) ════ */}
      {compliments.length > 0 && (
        <section
          className="py-14 px-4 sm:px-8 border-b"
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
              {compliments.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border shadow-xs"
                  style={{
                    backgroundColor: themeStyles.cardBg,
                    borderColor: `${themeStyles.accentPrimary}60`,
                  }}
                >
                  <span
                    className="font-heading text-xs font-bold block mb-0.5"
                    style={{ color: themeStyles.accentSecondary }}
                  >
                    {c.relation}
                  </span>
                  <span className="font-body text-xs sm:text-sm font-semibold text-charcoal">
                    {c.names}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ SECTION 6: A NOTE FROM US (Love Story) ════ */}
      <section
        className="py-14 px-4 sm:px-8 border-b"
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
            "{coupleStory}"
          </p>
        </div>
      </section>

      {/* ════ SECTION 7: MOMENTS OF US (Photo Gallery) ════ */}
      {gallery.length > 0 && (
        <section
          className="py-14 px-4 sm:px-8 border-b"
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
              {gallery.map((photo, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border shadow-xs transition-transform hover:scale-102"
                  style={{ borderColor: `${themeStyles.accentPrimary}60` }}
                >
                  <img
                    src={photo}
                    alt={`Couple memory ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ SECTION 8: RSVP SECTION ════ */}
      <section
        className="py-14 px-4 sm:px-8 border-b"
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
            {rsvpComponent ? rsvpComponent : <DefaultRSVPForm themeStyles={themeStyles} />}
          </div>
        </div>
      </section>
    </div>
  );
}
