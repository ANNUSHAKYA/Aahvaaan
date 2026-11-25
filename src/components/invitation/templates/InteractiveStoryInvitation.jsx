import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Clock, ChevronRight, ChevronLeft,
  Volume2, VolumeX, Sparkles, Check, Download, ExternalLink,
  ChevronDown, Instagram, User, Phone, Mail, Minus, Plus, Eye
} from 'lucide-react';
import useCountdown from '../../../hooks/useCountdown';
import useRealWeddingAudio from '../../../hooks/useRealWeddingAudio';

// ─── Add to Calendar Helper ───
function buildCalendarUrls(event, brideName, groomName) {
  const brideFirst = (brideName || 'Bride').split(' ')[0];
  const groomFirst = (groomName || 'Groom').split(' ')[0];
  const title = `${brideFirst} & ${groomFirst} • ${event.name || 'Ceremony'}`;
  const details = `${event.description || ''}\n\nVenue: ${event.venue || ''}\nTime: ${event.time || ''}`;
  const location = event.venue || '';

  const formatIsoForCal = (dateStr, timeStr) => {
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

  const startIso = formatIsoForCal(event.date, event.time);
  const endIso = startIso;

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${startIso}&enddt=${endIso}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

  return { googleUrl, outlookUrl };
}

function downloadIcsFile(event, brideName, groomName) {
  const brideFirst = (brideName || 'Bride').split(' ')[0];
  const groomFirst = (groomName || 'Groom').split(' ')[0];
  const title = `${brideFirst} & ${groomFirst}'s ${event.name || 'Ceremony'}`;
  const d = new Date(event.date || '2026-12-06');
  const start = isNaN(d.getTime()) ? '20261206T180000Z' : d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aahvaaan//Invitation//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${event.description || ''}`,
    `LOCATION:${event.venue || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(event.name || 'ceremony').toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Default Interactive Guest RSVP Component (Matches Screenshots 1, 2, 3) ───
export function BalconyStyleRSVP({ events = [], coupleName = 'The Couple' }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attendance, setAttendance] = useState({});
  const [wishes, setWishes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleAttendanceChange = (eventName, status) => {
    setAttendance((prev) => ({
      ...prev,
      [eventName]: status,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Persist & Deduplicate by phone in storage
    try {
      const key = 'aahvaaan_rsvps';
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = stored.findIndex((r) => r.phone === cleanMobile);
      const entry = {
        name: name.trim(),
        phone: cleanMobile,
        guestCount,
        attendance,
        wishes: wishes.trim(),
        updatedAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        stored[idx] = { ...stored[idx], ...entry };
        setIsUpdate(true);
      } else {
        stored.push({ ...entry, createdAt: new Date().toISOString() });
        setIsUpdate(false);
      }
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // ignore
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ♥
        </div>
        <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">
          {isUpdate ? `Welcome back, ${name}!` : `Thank you, ${name}!`}
        </h3>
        <p className="font-body text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed mb-6">
          {isUpdate
            ? 'Your RSVP response has been successfully updated. Your host family will see your latest answers.'
            : "Your response has been recorded. We can't wait to celebrate with you!"}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs text-[#7C3AED] hover:underline font-semibold"
        >
          Update response again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 max-w-2xl mx-auto text-left">
      {/* Title */}
      <div className="text-center mb-8">
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Your Presence Matters
        </h3>
        <p className="font-body text-xs sm:text-sm text-gray-500">
          Let us know so we can make the arrangements just right.
        </p>
      </div>

      {validationError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {validationError}
        </div>
      )}

      {/* Guest Name & 10-Digit Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={16} />
            </span>
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone size={16} />
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 pl-1">
            Reply again from this number any time to update your answer.
          </p>
        </div>
      </div>

      {/* How many of you are coming? */}
      <div className="bg-[#FAF9FF] border border-[#E9E4F5] rounded-2xl p-5 mb-8 text-center">
        <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-3">
          How many of you are coming?
        </label>
        <div className="inline-flex items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            className="w-7 h-7 rounded-full text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="font-bold text-base text-gray-900 w-6 text-center">
            {guestCount}
          </span>
          <button
            type="button"
            onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
            className="w-7 h-7 rounded-full text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          Counts for every event you say Yes or Maybe to, below. Up to 10 people.
        </p>
      </div>

      {/* Event Schedule Attendance Grid */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-[#7C3AED]" />
          <div>
            <h4 className="font-bold text-sm text-gray-900 leading-tight">
              Event Schedule
            </h4>
            <p className="text-[11px] text-gray-500">
              Let us know which events you'll be joining.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {events.map((ev, i) => {
            const currentStatus = attendance[ev.name] || 'yes';
            return (
              <div
                key={i}
                className="p-3.5 rounded-2xl border border-gray-100 bg-[#FDFCFE] shadow-2xs"
              >
                <div className="mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-800 block">
                    {ev.name}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {ev.date}
                  </span>
                </div>

                {/* Radio Pill Buttons: Yes / Maybe / No */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {['Yes', 'Maybe', 'No'].map((opt) => {
                    const val = opt.toLowerCase();
                    const isSelected = currentStatus === val;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAttendanceChange(ev.name, val)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#7C3AED]/50'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave couple a wish */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-3.5 top-3.5 text-gray-400">
            <Mail size={16} />
          </span>
          <textarea
            rows={2}
            value={wishes}
            onChange={(e) => setWishes(e.target.value)}
            placeholder="Leave the couple a wish (optional)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <span>♥</span>
        <span>Send RSVP</span>
      </button>

      <p className="text-[11px] text-gray-400 text-center mt-2.5">
        Preview - your guests will be able to send this once your invitation is live.
      </p>

      {/* Footer Branding */}
      <div className="text-center pt-8 border-t border-gray-100 mt-6">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
          Crafted with love by
        </p>
        <span className="font-heading text-lg font-bold text-wine tracking-tight">
          Aahvaaan
        </span>
      </div>
    </form>
  );
}

// ─── Interactive Petals Scratch & Scatter Component (Screenshot 6 & 9) ───
function PetalDateReveal({ weddingDate, onReveal, themeStyles }) {
  const [revealed, setRevealed] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);

  // Generate 36 realistic scattered rose petals with randomized angles & positions
  const [petals, setPetals] = useState(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: (i % 6) * 16 - 40 + (Math.random() * 20 - 10),
      y: Math.floor(i / 6) * 14 - 35 + (Math.random() * 20 - 10),
      rot: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.4,
      color: i % 3 === 0 ? '#E11D48' : i % 3 === 1 ? '#F43F5E' : '#FDA4AF',
      cleared: false,
    }));
  });

  const handleClearPetal = (id) => {
    setPetals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cleared: true } : p))
    );
    setClearedCount((c) => {
      const next = c + 1;
      if (next >= 12 && !revealed) {
        setRevealed(true);
        if (onReveal) onReveal();
      }
      return next;
    });
  };

  const handleScatterAll = () => {
    setPetals((prev) => prev.map((p) => ({ ...p, cleared: true })));
    setRevealed(true);
    if (onReveal) onReveal();
  };

  const { days, hours, minutes, seconds } = useCountdown(weddingDate || '2026-12-08');

  return (
    <div className="relative py-12 px-4 max-w-xl mx-auto text-center select-none">
      <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#8C3A48] italic mb-6">
        Move the petals to reveal the Grand Date!
      </h3>

      <div className="relative min-h-[300px] flex items-center justify-center p-6">
        {/* Underlying Revealed Date Card */}
        <div
          className={`transition-all duration-700 w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-xl text-center bg-[#FAF6F0] border-[#B69A70]/60 ${
            revealed ? 'opacity-100 scale-100' : 'opacity-80 scale-95'
          }`}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B69A70] block mb-2">
            The Sacred Muhurtham
          </span>
          <h4 className="font-heading text-2xl sm:text-3xl font-bold text-[#704B50] mb-2">
            {new Date(weddingDate || '2026-12-08').toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h4>
          <p className="font-body text-xs text-[#704B50]/70 mb-5">
            Auspicious Wedding Muhurat • 7:00 PM Onwards
          </p>

          {/* Live Countdown */}
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {[
              { val: days, lbl: 'Days' },
              { val: hours, lbl: 'Hours' },
              { val: minutes, lbl: 'Mins' },
              { val: seconds, lbl: 'Secs' },
            ].map((u, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-2 border border-[#B69A70]/30 shadow-2xs"
              >
                <span className="font-heading text-xl font-bold text-[#704B50] block">
                  {String(u.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-charcoal/50 block">
                  {u.lbl}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scattered Interactive Petals Heap */}
        <div
          onClick={handleScatterAll}
          className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden pointer-events-auto"
          title="Swipe or click petals to scatter"
        >
          {petals.map((p) => (
            <motion.div
              key={p.id}
              animate={
                p.cleared
                  ? {
                      x: p.x * 5 + (Math.random() * 200 - 100),
                      y: p.y * 5 + (Math.random() * 200 - 100),
                      opacity: 0,
                      scale: 0.2,
                      rotate: p.rot + 180,
                    }
                  : {
                      x: `${p.x * 2.5}px`,
                      y: `${p.y * 2.5}px`,
                      opacity: 0.95,
                      scale: p.scale,
                      rotate: p.rot,
                    }
              }
              transition={{ duration: 0.8, ease: 'easeOut' }}
              onMouseEnter={() => handleClearPetal(p.id)}
              onTouchMove={() => handleClearPetal(p.id)}
              className="absolute w-10 h-10 select-none pointer-events-auto cursor-pointer"
              style={{ zIndex: 20 }}
            >
              <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
                <path
                  d="M 20 4 C 12 12 6 22 10 32 C 14 40 26 40 30 32 C 34 22 28 12 20 4 Z"
                  fill={p.color}
                  opacity="0.9"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>

      {!revealed && (
        <button
          type="button"
          onClick={handleScatterAll}
          className="mt-2 text-xs text-[#8C3A48] font-semibold underline hover:opacity-80"
        >
          Tap here to reveal date
        </button>
      )}
    </div>
  );
}

// ─── Master Interactive Story Template Component (Matches Screenshots 1 - 15) ───
export default function InteractiveStoryInvitation({
  template,
  content = {},
  guestName = 'The Family',
  rsvpComponent = null,
}) {
  const { themeStyles = {} } = template;
  const bride = content.brideName || content.bride || 'Ankita';
  const groom = content.groomName || content.groom || 'Kaushik';
  const brideFormal = content.brideFormal || `Sau. Ka. ${bride} Mehta`;
  const groomFormal = content.groomFormal || `Chi. ${groom} Sharma`;
  const weddingDate = content.weddingDate || '2026-12-08';
  const location = content.location || 'Jaipur, Rajasthan';
  const venue = content.venue || 'Sharma Residence, Jaipur';
  const mapUrl = content.mapUrl || 'https://maps.google.com/?q=Sharma+Residence+Jaipur';
  const events = content.events || template.sampleData?.events || [
    { name: 'Ring Ceremony', date: '6 Dec 2026', time: '7:00 PM', venue: 'Sharma Residence, Jaipur' },
    { name: 'Mehendi', date: '7 Dec 2026', time: '11:00 AM', venue: 'Sharma Courtyard, Jaipur' },
    { name: 'Haldi', date: '7 Dec 2026', time: '3:00 PM', venue: 'Poolside Lawn, Jaipur' },
    { name: 'Sangeet', date: '7 Dec 2026', time: '7:30 PM', venue: 'Grand Ballroom, Jaipur' },
    { name: 'Vivaah', date: '8 Dec 2026', time: '6:00 PM', venue: 'The Palace Mandapam, Jaipur' },
    { name: 'Reception', date: '9 Dec 2026', time: '8:00 PM', venue: 'Imperial Banquet, Jaipur' },
  ];

  const compliments = content.compliments || template.sampleData?.compliments || [
    { relation: 'Chacha-Chachi', names: 'Shri Suresh Sharma & Family' },
    { relation: 'Tau-Tai', names: 'Shri Manoj Sharma & Family' },
    { relation: 'Bua', names: 'Smt. Asha Gupta & Family' },
    { relation: 'Mama-Mami', names: 'Shri Rajendra Mehta & Family' },
  ];

  const groomLineage = content.groomLineage || {
    parents: 'Shri Ramesh Chandra Sharma & Smt. Sunita Sharma',
    grandparents: 'Late Shri Pandit Brij Mohan Sharma & Late Smt. Kamla Devi Sharma',
    gotra: 'Bharadwaj',
  };

  const brideLineage = content.brideLineage || {
    parents: 'Shri Vikram Mehta & Smt. Nandini Mehta',
    grandparents: 'Late Shri Hari Prasad Mehta & Pushpa Devi Mehta',
  };

  // State
  const [hasStarted, setHasStarted] = useState(false);
  const [ceremonyIndex, setCeremonyIndex] = useState(0);
  const [showPetalsToggle, setShowPetalsToggle] = useState(true);

  // Audio Hook
  const { isPlaying, toggle: toggleAudio, start: startAudio } = useRealWeddingAudio(
    '/templates/royal-maroon-and-gold/media/music.mp3'
  );

  const handleOpenCover = () => {
    setHasStarted(true);
    startAudio();
    const el = document.getElementById('hero-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextCeremony = () => {
    setCeremonyIndex((prev) => (prev + 1) % events.length);
  };

  return (
    <div className="relative w-full bg-[#FAF6F0] font-body text-charcoal overflow-x-hidden">
      {/* Floating Controls (Music + Petal Toggle) */}
      <div className="fixed top-24 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={toggleAudio}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center text-[#704B50] hover:scale-110 transition-transform"
          title={isPlaying ? 'Mute Music' : 'Play Music'}
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button
          onClick={() => setShowPetalsToggle(!showPetalsToggle)}
          className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${
            showPetalsToggle ? 'text-rose-500' : 'text-gray-400'
          }`}
          title="Toggle Floating Petals"
        >
          <Sparkles size={18} />
        </button>
      </div>

      {/* Floating Rose Petals Ambient Layer */}
      {showPetalsToggle && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -40, x: `${(i * 9) % 100}vw`, opacity: 0 }}
              animate={{
                y: '105vh',
                x: `${((i * 9) % 100) + ((i % 2 === 0 ? 1 : -1) * 8)}vw`,
                opacity: [0, 0.7, 0.7, 0],
                rotate: 360,
              }}
              transition={{
                duration: 9 + (i % 6) * 2,
                repeat: Infinity,
                delay: i * 1.2,
                ease: 'linear',
              }}
              className="absolute w-5 h-5"
            >
              <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm opacity-80">
                <path
                  d="M 20 4 C 12 12 6 22 10 32 C 14 40 26 40 30 32 C 34 22 28 12 20 4 Z"
                  fill={i % 2 === 0 ? '#E11D48' : '#F43F5E'}
                />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* ════════════════ SECTION 1: COVER CARD (Screenshot 14) ════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#FAF6F0] via-[#FDF3EE] to-[#FAF6F0] overflow-hidden">
        {/* Floral Arch Background Decor */}
        <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-200/40 via-transparent to-transparent pointer-events-none" />

        {/* Centered Parchment Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md bg-[#FAF4EB] border-2 border-[#B69A70] rounded-3xl p-8 sm:p-10 shadow-2xl text-center z-10"
          style={{
            backgroundImage: 'radial-gradient(#B69A70 0.5px, transparent 0.5px)',
            backgroundSize: '16px 16px',
          }}
        >
          {/* Inner Golden Border */}
          <div className="absolute inset-2 border border-[#B69A70]/40 rounded-[20px] pointer-events-none" />

          {/* Ganesha Motif */}
          <div className="w-14 h-14 mx-auto mb-3 text-[#704B50] flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50 15 C45 15 40 20 40 25 C40 32 45 35 50 35 C55 35 60 32 60 25 C60 20 55 15 50 15 Z M42 36 C35 38 30 45 30 55 C30 70 42 75 48 75 C48 80 50 85 52 85 C54 85 55 80 55 75 C62 74 70 68 70 55 C70 45 65 38 58 36 C55 39 45 39 42 36 Z" />
            </svg>
          </div>

          <h2 className="font-heading text-lg font-bold text-[#704B50] tracking-wider mb-2">
            || श्री गणेशाय नमः ||
          </h2>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B69A70] to-transparent mx-auto my-3" />

          <p className="font-heading text-xs sm:text-sm text-[#704B50]/80 leading-relaxed max-w-xs mx-auto mb-6">
            We cordially invite you to grace the auspicious occasion of the marriage of...
          </p>

          <button
            type="button"
            onClick={handleOpenCover}
            className="px-8 py-2.5 rounded-full border border-[#B69A70] text-[#704B50] font-heading font-semibold text-xs sm:text-sm bg-white/80 hover:bg-[#B69A70] hover:text-white transition-all shadow-md active:scale-95"
          >
            Tap to open
          </button>
        </motion.div>
      </section>

      {/* ════════════════ SECTION 2: HERO SCENE (Screenshot 15) ════════════════ */}
      <section
        id="hero-section"
        className="relative min-h-screen flex flex-col items-center justify-between py-16 px-4 bg-gradient-to-b from-[#FDF3EE] via-[#FAF6F0] to-[#FAF4EB] text-center"
      >
        <div className="pt-10" />

        <div className="my-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-5xl sm:text-7xl font-bold text-[#704B50] tracking-tight"
          >
            {bride}
          </motion.h1>

          <span className="font-heading text-xl sm:text-2xl text-[#B69A70] italic block">
            and
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-5xl sm:text-7xl font-bold text-[#704B50] tracking-tight"
          >
            {groom}
          </motion.h1>
        </div>

        <div className="flex flex-col items-center gap-1 text-[#B69A70] animate-bounce">
          <span className="text-xs font-heading font-semibold tracking-wider">
            Scroll down
          </span>
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ════════════════ SECTION 3: FAMILY LINEAGE CARDS (Screenshots 11 & 12) ════════════════ */}
      <section className="py-20 px-4 max-w-4xl mx-auto space-y-12">
        {/* Groom Lineage Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#FAF4EB] border-2 border-[#B69A70]/70 rounded-3xl p-8 sm:p-12 shadow-xl text-center max-w-xl mx-auto"
        >
          <div className="absolute inset-2 border border-[#B69A70]/30 rounded-[20px] pointer-events-none" />
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#704B50] italic mb-4">
            {groomFormal}
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-[#704B50]/80">
            <p>
              <span className="font-bold text-[#B69A70] block uppercase tracking-wider text-[10px] mb-0.5">
                Son of
              </span>
              {groomLineage.parents}
            </p>
            <p>
              <span className="font-bold text-[#B69A70] block uppercase tracking-wider text-[10px] mb-0.5">
                Grandson of
              </span>
              {groomLineage.grandparents}
            </p>
            {groomLineage.gotra && (
              <p className="text-[11px] font-semibold text-[#B69A70] pt-2">
                {groomLineage.gotra}
              </p>
            )}
          </div>
        </motion.div>

        {/* Bride Lineage Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#FAF4EB] border-2 border-[#B69A70]/70 rounded-3xl p-8 sm:p-12 shadow-xl text-center max-w-xl mx-auto"
        >
          <div className="absolute inset-2 border border-[#B69A70]/30 rounded-[20px] pointer-events-none" />
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#704B50] italic mb-4">
            {brideFormal}
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-[#704B50]/80">
            <p>
              <span className="font-bold text-[#B69A70] block uppercase tracking-wider text-[10px] mb-0.5">
                Daughter of
              </span>
              {brideLineage.parents}
            </p>
            <p>
              <span className="font-bold text-[#B69A70] block uppercase tracking-wider text-[10px] mb-0.5">
                Granddaughter of
              </span>
              {brideLineage.grandparents}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ════════════════ SECTION 4: FOUNTAIN & PETALS REVEAL (Screenshots 6 & 9) ════════════════ */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#FAF4EB] via-[#FAF6F0] to-[#FAF4EB]">
        <PetalDateReveal weddingDate={weddingDate} themeStyles={themeStyles} />
      </section>

      {/* ════════════════ SECTION 5: LOVE STORY HANGING CAROUSEL (Screenshots 4 & 7) ════════════════ */}
      <section className="py-20 px-4 overflow-hidden">
        {/* Top Wooden Rod with Hanging Strings */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="h-2.5 bg-[#8C5D3B] rounded-full shadow-md w-full relative">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-1.5 h-1.5 bg-[#5D3A20] rounded-full" />
            <div className="absolute top-1/2 left-2/4 -translate-y-1/2 w-1.5 h-1.5 bg-[#5D3A20] rounded-full" />
            <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-1.5 h-1.5 bg-[#5D3A20] rounded-full" />
          </div>
        </div>

        {/* Horizontal Swipeable Cards Reel */}
        <div className="flex items-center gap-6 overflow-x-auto pb-6 px-4 max-w-5xl mx-auto scrollbar-none snap-x snap-mandatory">
          {/* Card 1: Polaroid */}
          <div className="snap-center shrink-0 w-64 sm:w-72 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col items-center">
            <div className="w-full aspect-[4/5] bg-[#EFECE6] rounded-xl flex items-center justify-center text-charcoal/40 text-xs italic mb-4">
              Your photo here
            </div>
            <span className="font-heading text-sm font-bold text-[#704B50] italic">
              #howitstarted
            </span>
          </div>

          {/* Card 2: Polaroid */}
          <div className="snap-center shrink-0 w-64 sm:w-72 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col items-center">
            <div className="w-full aspect-[4/5] bg-[#EFECE6] rounded-xl flex items-center justify-center text-charcoal/40 text-xs italic mb-4">
              Your photo here
            </div>
            <span className="font-heading text-sm font-bold text-[#704B50] italic">
              #adventures
            </span>
          </div>

          {/* Card 3: Parchment Story Note */}
          <div className="snap-center shrink-0 w-64 sm:w-72 bg-[#FAF4EB] border-2 border-[#B69A70]/60 rounded-2xl p-6 shadow-xl flex flex-col justify-center text-center">
            <p className="font-heading text-sm sm:text-base text-[#704B50] leading-relaxed italic">
              "Friendship grew into something more, and we realized life's best moments were the ones we shared together."
            </p>
          </div>

          {/* Card 4: Polaroid */}
          <div className="snap-center shrink-0 w-64 sm:w-72 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col items-center">
            <div className="w-full aspect-[4/5] bg-[#EFECE6] rounded-xl flex items-center justify-center text-charcoal/40 text-xs italic mb-4">
              Your photo here
            </div>
            <span className="font-heading text-sm font-bold text-[#704B50] italic">
              #thelittlethings
            </span>
          </div>
        </div>

        <div className="text-center mt-3">
          <span className="text-[11px] font-semibold text-[#B69A70] tracking-widest uppercase">
            &lt;&lt;&lt; Swipe &gt;&gt;&gt;
          </span>
        </div>
      </section>

      {/* ════════════════ SECTION 6: CEREMONIES ARCHED DECK (Screenshot 5) ════════════════ */}
      <section className="py-20 px-4 max-w-xl mx-auto text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#704B50] mb-2">
          Ceremonies
        </h2>

        <div className="relative mt-8 min-h-[460px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {events[ceremonyIndex] && (
              <motion.div
                key={ceremonyIndex}
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-sm bg-[#FAF4EB] border-2 border-[#B69A70] rounded-3xl p-8 shadow-2xl text-center relative"
              >
                <div className="absolute inset-2 border border-[#B69A70]/40 rounded-[20px] pointer-events-none" />

                <h3 className="font-heading text-2xl font-bold text-[#704B50] mb-2">
                  {events[ceremonyIndex].name}
                </h3>

                <div className="w-16 h-px bg-[#B69A70] mx-auto my-3" />

                <p className="font-heading font-semibold text-sm text-[#704B50] mb-1">
                  {events[ceremonyIndex].date}
                </p>
                <p className="font-body text-xs text-[#704B50]/70 mb-4">
                  {events[ceremonyIndex].time || '7:00 PM'}
                </p>

                {/* Venue Location */}
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#704B50] font-semibold hover:text-[#B69A70] mb-6 bg-white/60 px-3 py-1.5 rounded-full border border-[#B69A70]/40 transition-colors"
                >
                  <MapPin size={13} className="text-[#B69A70]" />
                  <span>{events[ceremonyIndex].venue || venue}</span>
                </a>

                {/* Ceremony Illustration Icon */}
                <div className="w-20 h-20 mx-auto my-4 bg-white/70 rounded-2xl border border-[#B69A70]/40 flex items-center justify-center text-3xl shadow-sm">
                  {ceremonyIndex === 0 ? '💍' : ceremonyIndex === 1 ? '🌿' : ceremonyIndex === 2 ? '✨' : ceremonyIndex === 3 ? '🎶' : ceremonyIndex === 4 ? '🔥' : '🥂'}
                </div>

                {/* Add to Calendar Action */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => downloadIcsFile(events[ceremonyIndex], bride, groom)}
                    className="px-4 py-2 rounded-full border border-[#B69A70] bg-white text-[#704B50] text-xs font-semibold hover:bg-[#B69A70] hover:text-white transition-all shadow-xs"
                  >
                    Add to calendar (.ics)
                  </button>
                  <a
                    href={buildCalendarUrls(events[ceremonyIndex], bride, groom).googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full border border-[#B69A70] bg-white text-[#704B50] hover:bg-[#B69A70] hover:text-white transition-all"
                    title="Add to Google Calendar"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div className="mt-6 pt-4 border-t border-[#B69A70]/30">
                  <button
                    type="button"
                    onClick={nextCeremony}
                    className="text-xs text-[#B69A70] font-semibold hover:underline"
                  >
                    Swipe the card aside →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ════════════════ SECTION 7: WITH BEST COMPLIMENTS FROM (Screenshot 10) ════════════════ */}
      <section className="py-16 px-4 max-w-xl mx-auto">
        <div className="relative bg-[#FAF4EB] border-2 border-[#B69A70] rounded-3xl p-8 sm:p-10 shadow-xl text-center">
          <div className="absolute inset-2 border border-[#B69A70]/40 rounded-[20px] pointer-events-none" />

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#704B50] italic mb-6">
            With Best Compliments From:
          </h3>

          <div className="space-y-3 font-heading text-xs sm:text-sm text-[#704B50]/90">
            {compliments.map((c, i) => (
              <p key={i}>
                {c.names} {c.relation ? `(${c.relation})` : ''}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 8: WOODEN EASEL SIGNOFF (Screenshot 13) ════════════════ */}
      <section className="py-20 px-4 text-center max-w-lg mx-auto">
        {/* Realistic Wooden Easel Illustration */}
        <div className="relative flex flex-col items-center">
          {/* Tripod Top Knob */}
          <div className="w-4 h-4 bg-[#6F4E37] rounded-full mb-1 shadow-sm" />

          {/* Framed Canvas on Easel Stand */}
          <div className="relative z-10 w-full max-w-md bg-[#FAF4EB] border-4 border-[#B69A70] rounded-2xl p-8 sm:p-12 shadow-2xl text-center">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#704B50] leading-snug">
              Your Presence Means the World to Us
            </h3>
          </div>

          {/* Wooden Easel Legs */}
          <div className="w-full max-w-xs flex justify-between px-6 -mt-2 pointer-events-none">
            <div className="w-3 h-20 bg-[#6F4E37] -rotate-12 rounded-b shadow-md" />
            <div className="w-3 h-24 bg-[#5C4033] rounded-b shadow-md -mt-1" />
            <div className="w-3 h-20 bg-[#6F4E37] rotate-12 rounded-b shadow-md" />
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 9: A NOTE FROM US & ICONS (Screenshot 8) ════════════════ */}
      <section className="py-16 px-4 max-w-xl mx-auto text-center space-y-8">
        <div className="relative bg-[#FAF4EB] border-2 border-[#B69A70] rounded-3xl p-8 shadow-xl text-center">
          <div className="absolute inset-2 border border-[#B69A70]/40 rounded-[20px] pointer-events-none" />

          <h3 className="font-heading text-2xl font-bold text-[#704B50] italic mb-3">
            A Note From Us
          </h3>
          <p className="font-body text-xs sm:text-sm text-[#704B50]/80 leading-relaxed italic max-w-sm mx-auto">
            We can't wait to celebrate this special day with you. Thank you for being part of our journey.
          </p>
        </div>

        {/* 3 Ornate Circular Action Icons */}
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-[#B69A70] bg-[#FAF4EB] text-[#704B50] hover:bg-[#704B50] hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
            title="Instagram"
          >
            <Instagram size={18} />
          </a>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-[#B69A70] bg-[#FAF4EB] text-[#704B50] hover:bg-[#704B50] hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
            title="Directions"
          >
            <MapPin size={18} />
          </a>

          <button
            type="button"
            onClick={() => downloadIcsFile(events[0], bride, groom)}
            className="w-12 h-12 rounded-full border-2 border-[#B69A70] bg-[#FAF4EB] text-[#704B50] hover:bg-[#704B50] hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
            title="Add to Calendar"
          >
            <Calendar size={18} />
          </button>
        </div>
      </section>

      {/* ════════════════ SECTION 10: COMPLETE GUEST RSVP (Screenshots 1, 2, 3) ════════════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#FAF4EB] to-[#F7F2EA]">
        {rsvpComponent ? (
          rsvpComponent
        ) : (
          <BalconyStyleRSVP events={events} coupleName={`${bride} & ${groom}`} />
        )}
      </section>
    </div>
  );
}
