import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Clock, Camera, Users,
  ExternalLink, Share2, Sparkles, Utensils,
  Volume2, VolumeX, Check, AlertCircle, ArrowLeft
} from 'lucide-react';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import templates from '../data/templates';
import config from '../data/config';
import useCountdown from '../hooks/useCountdown';
import useWeddingAudio from '../hooks/useWeddingAudio';

// ─── Opening Envelope & Gate Animation ───
function PublicEnvelopeOpening({ invitation, guestName, onOpen }) {
  const { template, brideName, groomName, weddingDate, location } = invitation;
  const themeStyles = template.themeStyles || {};
  const initials = `${brideName?.charAt(0) || 'A'} & ${groomName?.charAt(0) || 'K'}`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto"
      style={{ backgroundColor: `${themeStyles.bgPrimary || '#FAF6F0'}fa` }}
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
            className="inline-block text-[10px] uppercase tracking-[0.25em] font-semibold py-1 px-3.5 rounded-full mb-3 shadow-xs border"
            style={{
              backgroundColor: themeStyles.badgeBg || '#E9D7CC',
              color: themeStyles.badgeText || '#704B50',
              borderColor: `${themeStyles.accentPrimary || '#B69A70'}40`,
            }}
          >
            {template.collection || 'Wedding Invitation'}
          </span>

          {/* Guest Personal Salutation */}
          <p
            className="font-heading text-base italic mb-1"
            style={{ color: themeStyles.textSecondary || '#65575A' }}
          >
            Cordially Inviting
          </p>
          <h2
            className="font-heading text-2xl sm:text-3xl font-bold mb-4"
            style={{ color: themeStyles.textPrimary || '#704B50' }}
          >
            {guestName || 'Respected Guest & Family'}
          </h2>

          {/* Envelope Graphic */}
          <div className="relative w-64 sm:w-72 h-48 mx-auto mb-5 drop-shadow-xl">
            <svg viewBox="0 0 288 208" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="8"
                y="40"
                width="272"
                height="160"
                rx="12"
                fill={themeStyles.bgSecondary || '#E9D7CC'}
                stroke={themeStyles.accentSecondary || '#B69A70'}
                strokeWidth="1.5"
              />
              <rect
                x="20"
                y="52"
                width="248"
                height="136"
                rx="8"
                fill={themeStyles.bgPrimary || '#FAF6F0'}
              />
              <rect
                x="28"
                y="60"
                width="232"
                height="120"
                rx="4"
                fill="none"
                stroke={themeStyles.accentPrimary || '#C99B91'}
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
                fill={themeStyles.textPrimary || '#704B50'}
                fontWeight="700"
              >
                {brideName?.split(' ')[0]} & {groomName?.split(' ')[0]}
              </text>
              <text
                x="144"
                y="118"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
                fontSize="10"
                fill={themeStyles.textSecondary || '#65575A'}
                letterSpacing="1"
              >
                {weddingDate ? new Date(weddingDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }) : ''}
              </text>
              <text
                x="144"
                y="138"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="10"
                fill={themeStyles.accentSecondary || '#B69A70'}
                fontStyle="italic"
              >
                {location}
              </text>

              {/* Animated Flap */}
              <motion.path
                d="M8 40 L144 135 L280 40"
                fill={themeStyles.bgSecondary || '#E9D7CC'}
                stroke={themeStyles.accentSecondary || '#B69A70'}
                strokeWidth="1.5"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: [0, 0, 180] }}
                transition={{ duration: 2, delay: 0.6, times: [0, 0.3, 1] }}
                style={{ transformOrigin: '144px 40px' }}
              />

              {/* Wax Seal */}
              <motion.circle
                cx="144"
                cy="90"
                r="19"
                fill={themeStyles.buttonBg || '#704B50'}
                stroke={themeStyles.accentSecondary || '#B69A70'}
                strokeWidth="1.5"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: [1, 1, 0], scale: [1, 1, 0.8] }}
                transition={{ duration: 2, delay: 0.6, times: [0, 0.3, 0.6] }}
              />
              <motion.text
                x="144"
                y="95"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="10"
                fill={themeStyles.buttonText || '#FAF6F0'}
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
            style={{ color: themeStyles.textPrimary || '#704B50' }}
          >
            Auspicious Wedding Invitation
          </p>
          <p
            className="font-body text-[11px] tracking-wider mb-5"
            style={{ color: themeStyles.textSecondary || '#65575A' }}
          >
            Tap below to open your sacred invitation
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
            backgroundColor: themeStyles.buttonBg || '#704B50',
            color: themeStyles.buttonText || '#FAF6F0',
          }}
        >
          <span>Open Invitation</span>
          <Heart size={14} fill="currentColor" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Countdown Section ───
function PublicCountdown({ targetDate, themeStyles }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const units = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Mins' },
    { value: seconds, label: 'Secs' },
  ];

  return (
    <div className="py-10 px-4 text-center">
      <span
        className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold block mb-1"
        style={{ color: themeStyles.accentSecondary || '#B69A70' }}
      >
        Auspicious Countdown
      </span>
      <h3
        className="font-heading text-2xl font-bold mb-6"
        style={{ color: themeStyles.textPrimary || '#704B50' }}
      >
        Until The Sacred Vows
      </h3>

      <div className="flex justify-center gap-2.5 sm:gap-3 max-w-xs mx-auto">
        {units.map((u, i) => (
          <div
            key={i}
            className="flex-1 py-2.5 px-1.5 rounded-xl shadow-xs border text-center"
            style={{
              backgroundColor: themeStyles.cardBg || '#FFFFFF',
              borderColor: `${themeStyles.accentPrimary || '#B69A70'}40`,
            }}
          >
            <span
              className="font-heading text-2xl sm:text-3xl font-bold block leading-none"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              {String(u.value).padStart(2, '0')}
            </span>
            <span
              className="font-body text-[9px] uppercase tracking-wider block mt-1"
              style={{ color: themeStyles.textSecondary || '#65575A' }}
            >
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Live Supabase RSVP Form Component ───
function LiveRSVPForm({ invitation, guestName, guestCode, themeStyles }) {
  const [formData, setFormData] = useState({
    guestName: guestName || '',
    attending: '',
    guestCount: 1,
    dietary: 'Pure Vegetarian',
    wishes: '',
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    if (guestName && !formData.guestName) {
      setFormData((prev) => ({ ...prev, guestName }));
    }
  }, [guestName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guestName.trim()) {
      setStatus({ loading: false, success: false, error: 'Please enter your name.' });
      return;
    }
    if (!formData.attending) {
      setStatus({ loading: false, success: false, error: 'Please indicate whether you will attend.' });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.rpc('submit_public_rsvp', {
          p_slug: invitation.slug,
          p_guest_name: formData.guestName.trim(),
          p_attending: formData.attending,
          p_guest_count: parseInt(formData.guestCount, 10) || 1,
          p_dietary: formData.dietary,
          p_wishes: formData.wishes.trim() || null,
          p_guest_code: guestCode || null,
        });

        if (error) {
          throw error;
        }

        if (data && data.success === false) {
          setStatus({ loading: false, success: false, error: data.message });
          return;
        }
      }

      // Local storage fallback for offline resilience
      try {
        const existing = JSON.parse(localStorage.getItem(`aahvaaan_rsvp_${invitation.slug}`) || '[]');
        existing.push({ ...formData, submittedAt: new Date().toISOString() });
        localStorage.setItem(`aahvaaan_rsvp_${invitation.slug}`, JSON.stringify(existing));
      } catch (err) {
        // ignore
      }

      setStatus({ loading: false, success: true, error: null });
    } catch (err) {
      console.error('RSVP submission error:', err);
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Unable to submit RSVP. Please try again or WhatsApp the host directly.',
      });
    }
  };

  if (status.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: `${themeStyles.accentPrimary || '#B69A70'}30` }}
        >
          <Heart size={22} style={{ color: themeStyles.textPrimary || '#704B50' }} />
        </div>
        <h4
          className="font-heading text-2xl font-bold mb-2"
          style={{ color: themeStyles.textPrimary || '#704B50' }}
        >
          Dhanyavaad! RSVP Received
        </h4>
        <p className="font-body text-xs text-charcoal/70 max-w-xs mx-auto mb-3 leading-relaxed">
          {formData.attending === 'yes'
            ? 'We are overjoyed and eagerly await celebrating with you and your family!'
            : 'Thank you for letting us know. Your blessings remain warmly cherished.'}
        </p>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Check size={12} /> Confirmed in host guestbook
        </span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto text-left">
      {status.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      <div>
        <label className="block font-body text-xs font-semibold mb-1 text-charcoal">
          Your Full Name / Family Name
        </label>
        <input
          type="text"
          required
          value={formData.guestName}
          onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
          placeholder="e.g. Rajesh & Sunita Sharma"
          className="w-full px-3.5 py-2.5 bg-white border rounded-lg text-xs font-body focus:outline-none focus:ring-1 focus:ring-gold"
          style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
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
              onClick={() => setFormData({ ...formData, attending: opt.value })}
              className={`py-2.5 px-3 rounded-lg text-xs font-body font-medium transition-all ${
                formData.attending === opt.value
                  ? 'shadow-xs text-white font-semibold'
                  : 'bg-white border text-charcoal hover:bg-champagne/20'
              }`}
              style={{
                backgroundColor: formData.attending === opt.value ? (themeStyles.buttonBg || '#704B50') : undefined,
                borderColor: `${themeStyles.accentPrimary || '#B69A70'}60`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {formData.attending === 'yes' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-body text-xs font-semibold mb-1 text-charcoal">
              Number of Guests
            </label>
            <select
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
              className="w-full px-3 py-2 bg-white border rounded-lg text-xs font-body focus:outline-none"
              style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
              value={formData.dietary}
              onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
              className="w-full px-3 py-2 bg-white border rounded-lg text-xs font-body focus:outline-none"
              style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
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
          Warm Wishes for the Couple (Optional)
        </label>
        <textarea
          rows={2}
          value={formData.wishes}
          onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
          placeholder="Write your heartfelt blessings..."
          className="w-full px-3.5 py-2 bg-white border rounded-lg text-xs font-body focus:outline-none"
          style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
        />
      </div>

      <button
        type="submit"
        disabled={status.loading}
        className="w-full py-3 rounded-lg text-xs uppercase tracking-wider font-semibold shadow-sm transition-all text-white disabled:opacity-50"
        style={{ backgroundColor: themeStyles.buttonBg || '#704B50' }}
      >
        {status.loading ? 'Sending RSVP...' : 'Submit RSVP Response'}
      </button>
    </form>
  );
}

// ─── Add to Calendar Helper ───
function downloadEventCalendar(event, bride, groom) {
  const formatDate = (dateStr, timeStr) => {
    const d = new Date(dateStr);
    const m = timeStr?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
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
    `SUMMARY:${bride} & ${groom}'s ${event.name}`,
    `DESCRIPTION:${event.description || ''}`,
    `LOCATION:${event.venue || ''}`,
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

// ─── Main Public Invitation Page ───
export default function PublicInvitation() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const guestCode = searchParams.get('guest') || searchParams.get('g');

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const { isPlaying, toggle: toggleAudio, start: startAudio } = useWeddingAudio();

  // Load invitation from Supabase via get_public_invitation RPC
  useEffect(() => {
    let isMounted = true;

    async function fetchInvitation() {
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.rpc('get_public_invitation', {
            p_slug: slug,
            p_guest_code: guestCode || null,
          });

          if (!error && data) {
            if (isMounted) {
              setInvitation(data);
              setLoading(false);
            }
            // Record view asynchronously
            supabase.rpc('record_public_view', {
              p_slug: slug,
              p_guest_code: guestCode || null,
              p_user_agent: navigator.userAgent || null,
            }).catch(() => {});
            return;
          }
        }

        // Fallback: Check if matching sample invitation (e.g. ananya-kabir-2027) or template
        const sampleTmpl = templates.find((t) => t.id === 'champagne-and-rose') || templates[0];
        const fallbackData = {
          id: 'fallback-sample',
          slug: slug || 'ananya-kabir-2027',
          packageId: 'signature',
          brideName: sampleTmpl.sampleData.bride,
          groomName: sampleTmpl.sampleData.groom,
          brideFormal: sampleTmpl.sampleData.brideFormal,
          groomFormal: sampleTmpl.sampleData.groomFormal,
          shloka: sampleTmpl.sampleData.shloka,
          coupleStory: sampleTmpl.sampleData.coupleStory,
          brideLineage: sampleTmpl.sampleData.brideLineage,
          groomLineage: sampleTmpl.sampleData.groomLineage,
          compliments: sampleTmpl.sampleData.compliments,
          weddingDate: sampleTmpl.sampleData.weddingDate,
          location: sampleTmpl.sampleData.location,
          venue: sampleTmpl.sampleData.venue,
          mapUrl: sampleTmpl.sampleData.mapUrl,
          galleryPhotos: [],
          audioUrl: null,
          events: sampleTmpl.sampleData.events.map((e, idx) => ({
            id: `evt-${idx}`,
            name: e.name,
            date: e.date,
            time: e.time,
            venue: e.venue,
            mapUrl: sampleTmpl.sampleData.mapUrl,
            icon: e.icon,
            description: e.description,
          })),
          template: {
            id: sampleTmpl.id,
            name: sampleTmpl.name,
            collection: sampleTmpl.collection,
            category: sampleTmpl.category,
            palette: sampleTmpl.palette,
            colors: sampleTmpl.colors,
            themeStyles: sampleTmpl.themeStyles,
            imageUrl: sampleTmpl.image,
          },
          personalizedGuest: guestCode ? {
            salutationName: 'Respected Guest Family',
            guestCode,
          } : null,
        };

        if (isMounted) {
          setInvitation(fallbackData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        if (isMounted) setLoading(false);
      }
    }

    fetchInvitation();
    return () => {
      isMounted = false;
    };
  }, [slug, guestCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-wine border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-heading text-lg font-bold text-wine">Opening Sacred Invitation...</p>
          <span className="text-xs font-body text-charcoal/60">Aahvaaan by Vow & Vision</span>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl border border-champagne shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-wine mb-2">Invitation Not Found</h2>
          <p className="font-body text-xs text-charcoal/70 mb-6">
            The link you followed may have expired, or the ceremony link is waiting to be published by the host.
          </p>
          <Link to="/" className="btn-primary text-xs uppercase tracking-widest font-semibold px-6 py-3">
            Visit Aahvaaan Home
          </Link>
        </div>
      </div>
    );
  }

  const { template } = invitation;
  const themeStyles = template.themeStyles || {};
  const activeGuestName = invitation.personalizedGuest?.salutationName || 'The Invited Family';

  return (
    <div className="min-h-screen bg-ivory font-body antialiased">
      {/* Envelope Overlay */}
      <AnimatePresence>
        {!envelopeOpen && (
          <PublicEnvelopeOpening
            invitation={invitation}
            guestName={activeGuestName}
            onOpen={() => {
              setEnvelopeOpen(true);
              startAudio();
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Top Controls (Music Player & WhatsApp Share) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-champagne/60 px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Couple Monogram / Brand */}
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white font-heading font-bold text-[10px]"
              style={{ backgroundColor: themeStyles.buttonBg || '#704B50' }}
            >
              आ
            </span>
            <span
              className="font-heading text-sm font-bold truncate max-w-[150px]"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              {invitation.brideName?.split(' ')[0]} & {invitation.groomName?.split(' ')[0]}
            </span>
          </div>

          {/* Audio & Share Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleAudio}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                isPlaying
                  ? 'bg-wine text-white shadow-2xs'
                  : 'bg-ivory text-charcoal/70 border border-champagne'
              }`}
              title={isPlaying ? 'Pause music' : 'Play wedding music'}
            >
              {isPlaying ? (
                <>
                  <Volume2 size={13} className="text-gold" />
                  <span className="hidden min-[380px]:inline">Shehnai</span>
                  <span className="flex items-end gap-0.5 h-2.5 ml-0.5">
                    <span className="w-0.5 h-2.5 bg-gold rounded-full animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-gold rounded-full animate-bounce" />
                    <span className="w-0.5 h-2 bg-gold rounded-full animate-pulse delay-75" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  <span className="hidden min-[380px]:inline">Mute</span>
                </>
              )}
            </button>

            {/* WhatsApp Share Button */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Auspicious Wedding Invitation: ${invitation.brideName} & ${invitation.groomName} cordially invite you! Open your invitation here: ${window.location.href}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              title="Share on WhatsApp"
            >
              <Share2 size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Single-Column Mobile Invitation Content (Optimized at 360px) */}
      <main className="max-w-md mx-auto px-4 pb-24 pt-4 space-y-8">
        {/* Personalized Guest Badge (If personalized link) */}
        {invitation.personalizedGuest && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 rounded-xl border shadow-xs"
            style={{
              backgroundColor: themeStyles.cardBg || '#FFFFFF',
              borderColor: `${themeStyles.accentPrimary || '#B69A70'}40`,
            }}
          >
            <span
              className="text-[10px] uppercase tracking-widest font-bold block mb-0.5"
              style={{ color: themeStyles.accentSecondary || '#B69A70' }}
            >
              Welcome Respected
            </span>
            <span
              className="font-heading text-lg font-bold"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              {invitation.personalizedGuest.salutationName}
            </span>
          </motion.div>
        )}

        {/* Hero Card */}
        <section
          className="rounded-[28px] p-6 text-center border shadow-sm relative overflow-hidden"
          style={{
            backgroundColor: themeStyles.cardBg || '#FFFFFF',
            borderColor: `${themeStyles.accentPrimary || '#B69A70'}40`,
          }}
        >
          {/* Auspicious Shloka */}
          <p
            className="font-heading text-xs italic mb-4 leading-relaxed max-w-xs mx-auto"
            style={{ color: themeStyles.accentSecondary || '#B69A70' }}
          >
            {invitation.shloka}
          </p>

          <span
            className="text-[10px] uppercase tracking-[0.2em] font-semibold block mb-2"
            style={{ color: themeStyles.accentPrimary || '#C99B91' }}
          >
            With the blessings of our elders
          </span>

          <h1
            className="font-heading text-3xl sm:text-4xl font-bold mb-1"
            style={{ color: themeStyles.textPrimary || '#704B50' }}
          >
            {invitation.brideFormal || invitation.brideName}
          </h1>

          <span
            className="font-heading text-xl italic my-1 block"
            style={{ color: themeStyles.accentSecondary || '#B69A70' }}
          >
            and
          </span>

          <h1
            className="font-heading text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: themeStyles.textPrimary || '#704B50' }}
          >
            {invitation.groomFormal || invitation.groomName}
          </h1>

          <div
            className="w-16 h-0.5 mx-auto mb-4"
            style={{ backgroundColor: themeStyles.accentSecondary || '#B69A70' }}
          />

          <p
            className="font-heading text-lg font-bold"
            style={{ color: themeStyles.textPrimary || '#704B50' }}
          >
            {new Date(invitation.weddingDate).toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <p
            className="font-body text-xs text-charcoal/70 mt-1 mb-4"
          >
            {invitation.venue} • {invitation.location}
          </p>

          {invitation.mapUrl && (
            <a
              href={invitation.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-xs"
              style={{ backgroundColor: themeStyles.buttonBg || '#704B50' }}
            >
              <MapPin size={13} />
              <span>Instant Google Maps</span>
            </a>
          )}
        </section>

        {/* Live Countdown */}
        <PublicCountdown
          targetDate={invitation.weddingDate}
          themeStyles={themeStyles}
        />

        {/* Ceremonies Itinerary */}
        <section className="space-y-4">
          <div className="text-center">
            <span
              className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold block mb-1"
              style={{ color: themeStyles.accentSecondary || '#B69A70' }}
            >
              Wedding Itinerary
            </span>
            <h3
              className="font-heading text-2xl font-bold"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              Sacred Ceremonies
            </h3>
          </div>

          <div className="space-y-3">
            {invitation.events?.map((evt, idx) => (
              <div
                key={evt.id || idx}
                className="p-4 sm:p-5 rounded-2xl border shadow-xs"
                style={{
                  backgroundColor: themeStyles.cardBg || '#FFFFFF',
                  borderColor: `${themeStyles.accentPrimary || '#B69A70'}40`,
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{evt.icon || '💍'}</span>
                    <h4
                      className="font-heading text-lg font-bold"
                      style={{ color: themeStyles.textPrimary || '#704B50' }}
                    >
                      {evt.name}
                    </h4>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: themeStyles.badgeBg || '#E9D7CC',
                      color: themeStyles.badgeText || '#704B50',
                    }}
                  >
                    {evt.time}
                  </span>
                </div>

                <p className="text-xs text-charcoal/70 mb-3 leading-relaxed">
                  {evt.description}
                </p>

                <p className="text-[11px] text-charcoal/60 mb-3 flex items-center gap-1 font-medium">
                  <MapPin size={12} className="text-gold flex-shrink-0" />
                  <span>{evt.venue}</span>
                </p>

                {/* Instant Direction & Calendar buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-champagne/40">
                  <a
                    href={evt.mapUrl || invitation.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg border text-center font-body text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-champagne/20 transition-colors"
                    style={{
                      borderColor: themeStyles.buttonBg || '#704B50',
                      color: themeStyles.buttonBg || '#704B50',
                    }}
                  >
                    <MapPin size={12} />
                    <span>GPS Map</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadEventCalendar(evt, invitation.brideName, invitation.groomName)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-center font-body text-[11px] font-semibold text-white flex items-center justify-center gap-1 shadow-2xs hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: themeStyles.buttonBg || '#704B50' }}
                  >
                    <Calendar size={12} />
                    <span>Add to Cal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Couple Story (If available) */}
        {invitation.coupleStory && (
          <section
            className="p-5 rounded-2xl border text-center shadow-xs"
            style={{
              backgroundColor: themeStyles.bgSecondary || '#FAF6F0',
              borderColor: `${themeStyles.accentPrimary || '#B69A70'}40`,
            }}
          >
            <span
              className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold block mb-1"
              style={{ color: themeStyles.accentSecondary || '#B69A70' }}
            >
              Our Journey
            </span>
            <h3
              className="font-heading text-xl font-bold mb-3"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              The Story of Us
            </h3>
            <p
              className="font-heading text-xs sm:text-sm italic leading-relaxed"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              "{invitation.coupleStory}"
            </p>
          </section>
        )}

        {/* Formal Lineage & Compliments */}
        {(invitation.brideLineage?.parents || invitation.groomLineage?.parents) && (
          <section
            className="p-5 rounded-2xl border space-y-3 shadow-xs"
            style={{
              backgroundColor: themeStyles.cardBg || '#FFFFFF',
              borderColor: `${themeStyles.accentPrimary || '#B69A70'}40`,
            }}
          >
            <h4
              className="font-heading text-base font-bold text-center mb-1"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              Parivaar Blessings (स्नेही स्वजन)
            </h4>

            {invitation.groomLineage?.parents && (
              <div className="text-xs text-center border-b border-champagne/40 pb-2">
                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider block font-semibold">
                  Groom's Parents
                </span>
                <span className="font-semibold text-wine">
                  {invitation.groomLineage.parents}
                </span>
              </div>
            )}

            {invitation.brideLineage?.parents && (
              <div className="text-xs text-center">
                <span className="text-charcoal/50 text-[10px] uppercase tracking-wider block font-semibold">
                  Bride's Parents
                </span>
                <span className="font-semibold text-wine">
                  {invitation.brideLineage.parents}
                </span>
              </div>
            )}
          </section>
        )}

        {/* Live RSVP Section */}
        <section
          className="p-5 sm:p-6 rounded-[28px] border shadow-sm"
          style={{
            backgroundColor: themeStyles.cardBg || '#FFFFFF',
            borderColor: `${themeStyles.accentPrimary || '#B69A70'}60`,
          }}
        >
          <div className="text-center mb-5">
            <span
              className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold block mb-1"
              style={{ color: themeStyles.accentSecondary || '#B69A70' }}
            >
              RSVP
            </span>
            <h3
              className="font-heading text-2xl font-bold mb-1"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              Kindly Respond
            </h3>
            <p className="font-body text-xs text-charcoal/60">
              Please respond by 10th February to help us plan catering arrangements.
            </p>
          </div>

          <LiveRSVPForm
            invitation={invitation}
            guestName={invitation.personalizedGuest?.salutationName}
            guestCode={guestCode}
            themeStyles={themeStyles}
          />
        </section>

        {/* Footer Credit & Create Link */}
        <footer className="text-center pt-6 pb-4">
          <Link to="/" className="inline-block group">
            <span className="font-heading text-base font-bold text-wine group-hover:text-gold transition-colors block">
              Aahvaaan
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold block">
              by Vow & Vision
            </span>
          </Link>
          <p className="text-[10px] text-charcoal/40 mt-1">
            Create your digital wedding website in minutes
          </p>
        </footer>
      </main>
    </div>
  );
}
