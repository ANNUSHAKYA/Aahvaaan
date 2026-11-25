import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, MapPin, Clock, ChevronRight, ChevronLeft,
  Volume2, VolumeX, Sparkles, Check, Download, ExternalLink,
  ChevronDown, Flame
} from 'lucide-react';
import useCountdown from '../../../hooks/useCountdown';
import useRealWeddingAudio from '../../../hooks/useRealWeddingAudio';

// ─── Calendar Generator Utility ───
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
  const endIso = startIso; // standard event point

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${startIso}&enddt=${endIso}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

  return { googleUrl, outlookUrl };
}

function downloadIcsFile(event, brideName, groomName) {
  const brideFirst = (brideName || 'Bride').split(' ')[0];
  const groomFirst = (groomName || 'Groom').split(' ')[0];
  const title = `${brideFirst} & ${groomFirst}'s ${event.name || 'Wedding Ceremony'}`;
  const d = new Date(event.date || '2027-04-18');
  const start = isNaN(d.getTime()) ? '20270418T180000Z' : d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aahvaaan//MaharajaRoyalMaroon//EN',
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

// ─── Default Demo RSVP Form (when not embedded in live database flow) ───
function RoyalDemoRSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    attending: 'yes',
    guestCount: '2',
    dietary: 'Pure Vegetarian',
    wishes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 px-4 bg-[#431421] border border-[#C5A15E]/60 rounded-2xl text-[#FAF1E5] shadow-xl">
        <div className="w-12 h-12 rounded-full bg-[#761F32] border border-[#C5A15E] flex items-center justify-center mx-auto mb-3 text-[#C5A15E]">
          <Heart size={22} fill="#C5A15E" />
        </div>
        <h4 className="font-heading text-xl font-bold text-[#E6D0B5] mb-2">
          Your Blessings Have Been Received!
        </h4>
        <p className="font-body text-xs text-[#FAF1E5]/80 max-w-sm mx-auto leading-relaxed mb-4">
          {form.attending === 'yes'
            ? 'We are truly overjoyed and eagerly look forward to welcoming you at Rambagh Palace.'
            : 'Thank you for conveying your warm wishes. Your prayers and blessings remain with us.'}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs text-[#C5A15E] hover:underline font-semibold"
        >
          Modify Response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#C5A15E] mb-1.5">
          Your Full Name / Family Name
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Thakur Ranveer Singh & Family"
          className="w-full px-4 py-3 rounded-xl bg-[#2D0D14] border border-[#C5A15E]/50 text-[#FAF1E5] text-xs font-body placeholder:text-[#FAF1E5]/30 focus:outline-none focus:border-[#C5A15E] transition-all"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#C5A15E] mb-1.5">
          Will you grace the auspicious celebrations?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, attending: 'yes' })}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold font-body transition-all flex items-center justify-center gap-1.5 ${
              form.attending === 'yes'
                ? 'bg-[#761F32] text-[#FAF1E5] border-[#C5A15E] shadow-md ring-1 ring-[#C5A15E]'
                : 'bg-[#2D0D14] text-[#FAF1E5]/60 border-[#C5A15E]/30'
            }`}
          >
            <span>✓ Joyfully Attend</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, attending: 'no' })}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold font-body transition-all flex items-center justify-center gap-1.5 ${
              form.attending === 'no'
                ? 'bg-[#761F32] text-[#FAF1E5] border-[#C5A15E] shadow-md ring-1 ring-[#C5A15E]'
                : 'bg-[#2D0D14] text-[#FAF1E5]/60 border-[#C5A15E]/30'
            }`}
          >
            <span>Regretfully Decline</span>
          </button>
        </div>
      </div>

      {form.attending === 'yes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#C5A15E] mb-1">
              Number of Guests
            </label>
            <select
              value={form.guestCount}
              onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#2D0D14] border border-[#C5A15E]/50 text-[#FAF1E5] text-xs font-body focus:outline-none focus:border-[#C5A15E]"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-[#C5A15E] mb-1">
              Dietary Preference
            </label>
            <select
              value={form.dietary}
              onChange={(e) => setForm({ ...form, dietary: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#2D0D14] border border-[#C5A15E]/50 text-[#FAF1E5] text-xs font-body focus:outline-none focus:border-[#C5A15E]"
            >
              <option value="Pure Vegetarian">Pure Vegetarian</option>
              <option value="Jain (No Root Veg)">Jain (No Root Veg)</option>
              <option value="Traditional Rajasthani Royal">Traditional Rajasthani Royal</option>
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-[#C5A15E] mb-1">
          Warm Blessings & Wishes (Optional)
        </label>
        <textarea
          rows={2}
          value={form.wishes}
          onChange={(e) => setForm({ ...form, wishes: e.target.value })}
          placeholder="Blessings for Radhika & Vikramaditya..."
          className="w-full px-4 py-2.5 rounded-xl bg-[#2D0D14] border border-[#C5A15E]/50 text-[#FAF1E5] text-xs font-body placeholder:text-[#FAF1E5]/30 focus:outline-none focus:border-[#C5A15E]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#761F32] via-[#94273F] to-[#761F32] text-[#FAF1E5] font-body text-xs uppercase tracking-widest font-bold shadow-lg border border-[#C5A15E] hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Send Royal RSVP
      </button>
    </form>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// 👑 MAHARAJA ROYAL MAROON & GOLD INVITATION COMPONENT
// ═════════════════════════════════════════════════════════════════════════
export default function MaharajaRoyalInvitation({
  template,
  content = {},
  guestName = '',
  rsvpComponent = null,
}) {
  // Normalize data with fallbacks strictly from content JSON
  const bride = content.bride || content.brideName || 'Radhika Rathore';
  const groom = content.groom || content.groomName || 'Vikramaditya Chauhan';
  const brideFormal = content.brideFormal || `Kum. ${bride}`;
  const groomFormal = content.groomFormal || `Chi. ${groom}`;
  const shloka = content.shloka || '|| ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि तन्नो दन्तिः प्रचोदयात् ||';
  const guestGreeting = guestName || content.guestGreeting || 'Respected Guest & Family';
  const invitationLine = content.invitationLine || 'We cordially invite you to grace the auspicious occasion of the marriage of our beloved children...';
  const weddingDate = content.weddingDate || '2027-04-18';
  const venue = content.venue || 'Rambagh Palace, Jaipur, Rajasthan';
  const location = content.location || 'Jaipur, Rajasthan';
  const mapUrl = content.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(venue)}`;
  const coupleStory = content.coupleStory || 'Carrying forward centuries of pride and tradition, we joyfully unite two historic families in royal celebration.';
  const noteFromUs = content.noteFromUs || 'As we begin this sacred new chapter of life, your blessings, laughter, and warm presence are the greatest gifts we could ever ask for.';
  const closingFamily = content.closingFamily || 'The Rathore & Chauhan Families';

  // Lineage data
  const groomParents = content.lineage?.groomParents || content.groomLineage?.parents || 'Thakur Mahendra Singh Chauhan & Rani Pratibha Chauhan';
  const groomGrandparents = content.lineage?.groomGrandparents || content.groomLineage?.grandparents || 'Late Raja Fateh Singh Chauhan & Late Rani Gayatri Devi';
  const brideParents = content.lineage?.brideParents || content.brideLineage?.parents || 'Thakur Digvijay Singh Rathore & Rani Meenakshi Rathore';
  const brideGrandparents = content.lineage?.brideGrandparents || content.brideLineage?.grandparents || 'Late Rawat Amar Singh Rathore & Late Rani Krishna Kumari';

  // Date Parsing for 3-box reveal
  const dateObj = (() => {
    try {
      const d = new Date(weddingDate);
      if (!isNaN(d.getTime())) {
        return {
          day: String(d.getDate()).padStart(2, '0'),
          month: d.toLocaleString('en-US', { month: 'long' }),
          year: String(d.getFullYear()),
        };
      }
    } catch {}
    return { day: '18', month: 'April', year: '2027' };
  })();

  // Love story array
  const loveStory = (content.loveStory && content.loveStory.length > 0)
    ? content.loveStory
    : [
        {
          hashtag: '#howitstarted',
          title: 'A Glimpse in the Pink City',
          description: 'An auspicious first encounter beneath the sandstone arches of the royal palace gardens.',
          image: '/templates/royal-maroon-and-gold/media/hero_scene.webp',
        },
        {
          hashtag: '#thelittlethings',
          title: 'Shared Rhythms & Royal Polo',
          description: 'Evenings spent discussing history, shared passions, and quiet walks along Lake Pichola.',
          image: '/templates/royal-maroon-and-gold/media/sangeet.webp',
        },
        {
          hashtag: '#foreverbegins',
          title: 'The Royal Promise',
          description: 'With the blessings of our elders and ancestors, two families unite in eternal love and honour.',
          image: '/templates/royal-maroon-and-gold/media/vivaah.webp',
        },
      ];

  // Ceremonies array
  const events = (content.events && content.events.length > 0)
    ? content.events
    : [
        {
          name: 'The Royal Mehendi & Ghoomar',
          date: '2027-04-16',
          time: '3:00 PM – 7:00 PM',
          venue: 'Naksha Garden, Rambagh Palace',
          mediaImage: '/templates/royal-maroon-and-gold/media/mehendi.webp',
          description: 'A resplendent royal afternoon with Rajasthani folk artists, royal sweets, and traditional ghoomar dances.',
        },
        {
          name: 'The Grand Sangeet & Jashn',
          date: '2027-04-17',
          time: '7:30 PM onwards',
          venue: 'Mubarak Mahal Grounds',
          mediaImage: '/templates/royal-maroon-and-gold/media/sangeet.webp',
          description: 'A dazzling evening of heritage performances, royal dhol procession, and majestic fireworks over the palace.',
        },
        {
          name: 'Haldi & Tel Baan',
          date: '2027-04-18',
          time: '10:00 AM – 1:00 PM',
          venue: 'Kesar Bagh Courtyard',
          mediaImage: '/templates/royal-maroon-and-gold/media/haldi.webp',
          description: 'Traditional Tel Baan rituals with perfumed oils, turmeric, and blessing songs sung by clan women.',
        },
        {
          name: 'Rajputana Baraat & Vivah',
          date: '2027-04-18',
          time: '6:00 PM onwards',
          venue: 'Jaigarh Royal Mandap, Rambagh Palace',
          mediaImage: '/templates/royal-maroon-and-gold/media/vivaah.webp',
          description: 'The royal wedding procession followed by Vedic wedding rituals conducted under gold and velvet canopy.',
        },
        {
          name: 'Shahi Dawat (Royal Banquet)',
          date: '2027-04-19',
          time: '8:00 PM – Midnight',
          venue: 'The Grand Ballroom & Palace Terraces',
          mediaImage: '/templates/royal-maroon-and-gold/media/reception.webp',
          description: 'An imperial banquet featuring traditional culinary masterpieces prepared by royal khansamas.',
        },
      ];

  // Compliments array
  const compliments = (content.compliments && content.compliments.length > 0)
    ? content.compliments
    : [
        { relation: 'Kaka - Kaki Sa (Chacha-Chachi)', names: 'Thakur Ranveer Singh Chauhan & Family' },
        { relation: 'Basa - Tai Sa (Tau-Tai)', names: 'Thakur Jaswant Singh Chauhan & Family' },
        { relation: 'Bhuasa - Fofasa (Bua-Phuphaji)', names: 'Rani Pushpa Devi & Rawat Dilip Singh' },
        { relation: 'Mamasa - Mami Sa (Mama-Mami)', names: 'Thakur Narendra Singh Bhati & Family' },
        { relation: 'Bhaiya - Bhabhi Sa', names: 'Yuvraj Dushyant Singh & Yuvrani Kritika Rathore' },
      ];

  // Real Audio Hook setup
  const audioUrl = content.music?.url || '/templates/royal-maroon-and-gold/media/music.mp3';
  const musicEnabled = content.music?.enabled !== false;
  const { isPlaying, isMuted, startMusic, toggleMute } = useRealWeddingAudio(audioUrl, musicEnabled);

  // Invitation Open / Cover State
  const [isOpened, setIsOpened] = useState(false);

  // Date Reveal state (Date / Month / Year flip open)
  const [dateRevealed, setDateRevealed] = useState(false);

  // Love Story Carousel State
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Countdown timer hook
  const countdown = useCountdown(weddingDate);

  // Handle "Tap to open"
  const handleTapToOpen = () => {
    setIsOpened(true);
    startMusic();
    setTimeout(() => {
      const heroEl = document.getElementById('maharaja-hero');
      if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#2D0D14] text-[#FAF1E5] font-body selection:bg-[#C5A15E] selection:text-[#431421] relative overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════════════
          🔊 PERSISTENT FLOATING AUDIO EQUALIZER PILL
         ══════════════════════════════════════════════════════════════ */}
      {musicEnabled && isOpened && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#431421]/90 backdrop-blur-md border border-[#C5A15E]/60 shadow-xl cursor-pointer hover:border-[#C5A15E] transition-all"
          onClick={toggleMute}
          title={isMuted ? 'Unmute wedding music' : 'Mute music'}
        >
          {/* Animated 3-Bar Equalizer */}
          <div className="flex items-end gap-1 h-3.5 w-4.5">
            <span
              className={`w-1 rounded-full bg-[#C5A15E] transition-all duration-300 ${
                !isMuted && isPlaying ? 'animate-[bounce_0.8s_infinite]' : 'h-1'
              }`}
              style={{ height: !isMuted && isPlaying ? '100%' : '3px' }}
            />
            <span
              className={`w-1 rounded-full bg-[#E6D0B5] transition-all duration-300 ${
                !isMuted && isPlaying ? 'animate-[bounce_0.6s_infinite_0.2s]' : 'h-1'
              }`}
              style={{ height: !isMuted && isPlaying ? '70%' : '3px' }}
            />
            <span
              className={`w-1 rounded-full bg-[#C5A15E] transition-all duration-300 ${
                !isMuted && isPlaying ? 'animate-[bounce_0.9s_infinite_0.4s]' : 'h-1'
              }`}
              style={{ height: !isMuted && isPlaying ? '90%' : '3px' }}
            />
          </div>

          <span className="text-[10px] font-semibold text-[#E6D0B5] uppercase tracking-wider">
            {isMuted ? 'Muted' : 'Music'}
          </span>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          1. COVER: "श्री गणेशाय नमः", GUEST GREETING & TAP TO OPEN
         ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen w-full flex flex-col justify-between items-center text-center p-6 sm:p-10 overflow-hidden bg-cover bg-center">
        {/* Cover Background Slot */}
        <div
          className="absolute inset-0 bg-[#431421] opacity-95 z-0"
          style={{
            backgroundImage: "url('/templates/royal-maroon-and-gold/media/cover_bg.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Ambient Dark Velvet Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D0D14]/90 via-[#431421]/75 to-[#2D0D14]/95 z-0 pointer-events-none" />

        {/* Top Auspicious Shloka & Ganesh Invocation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 pt-4"
        >
          {/* Floral Top Slot */}
          <div className="w-48 sm:w-64 mx-auto mb-3 opacity-90">
            <img
              src="/templates/royal-maroon-and-gold/media/floral_top.webp"
              alt="Decorative Garland"
              className="w-full h-auto object-contain"
            />
          </div>

          <span className="font-heading text-sm sm:text-base text-[#C5A15E] uppercase tracking-[0.3em] font-semibold block mb-1">
            || श्री गणेशाय नमः ||
          </span>
          <p className="font-serif text-[10px] sm:text-xs text-[#E6D0B5]/80 italic max-w-sm mx-auto">
            {shloka}
          </p>
        </motion.div>

        {/* Center: Guest Personal Salutation & Formal Invitation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative z-10 max-w-md w-full px-4 py-8 rounded-3xl bg-[#431421]/80 backdrop-blur-md border border-[#C5A15E]/60 shadow-2xl my-auto"
        >
          {/* Royal Seal Monogram */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#761F32] to-[#431421] border-2 border-[#C5A15E] mx-auto mb-4 flex items-center justify-center text-[#C5A15E] font-heading font-bold text-xl shadow-lg">
            <span>ॐ</span>
          </div>

          <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A15E] font-bold block mb-1">
            Cordially Inviting
          </span>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FAF1E5] tracking-tight mb-3">
            {guestGreeting}
          </h2>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C5A15E] to-transparent mx-auto mb-4" />

          <p className="font-body text-xs sm:text-sm text-[#E6D0B5]/90 leading-relaxed max-w-sm mx-auto">
            {invitationLine}
          </p>

          <div className="mt-4 pt-3 border-t border-[#C5A15E]/30 text-center">
            <span className="font-heading text-lg font-bold text-[#FAF1E5] block">
              {bride.split(' ')[0]} <span className="text-[#C5A15E]">&</span> {groom.split(' ')[0]}
            </span>
            <span className="text-[11px] text-[#C5A15E] tracking-wider font-medium">
              {location}
            </span>
          </div>
        </motion.div>

        {/* Bottom: Tap to Open CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 pb-6 w-full max-w-xs"
        >
          <button
            type="button"
            onClick={handleTapToOpen}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#761F32] via-[#94273F] to-[#761F32] text-[#FAF1E5] font-body text-xs uppercase tracking-[0.2em] font-bold shadow-2xl border-2 border-[#C5A15E] hover:border-[#FAF1E5] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Tap to Open</span>
            <Heart size={14} className="fill-[#C5A15E] text-[#C5A15E] group-hover:scale-125 transition-transform" />
          </button>
          <span className="block text-[10px] text-[#C5A15E]/70 mt-2 text-center tracking-wider">
            (Plays royal celebratory shehnai)
          </span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. HERO: LARGE COUPLE NAMES OVER ILLUSTRATED VENUE SCENE
         ══════════════════════════════════════════════════════════════ */}
      <section
        id="maharaja-hero"
        className="relative min-h-screen w-full flex flex-col justify-between items-center text-center p-6 sm:p-10 overflow-hidden"
      >
        {/* Hero Scene Artwork Slot */}
        <div
          className="absolute inset-0 bg-[#431421] z-0"
          style={{
            backgroundImage: "url('/templates/royal-maroon-and-gold/media/hero_scene.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Twilight Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D0D14]/90 via-[#431421]/60 to-[#2D0D14] z-0" />

        {/* Floating Diya / Petal Parallax Accents */}
        <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-10 text-[#C5A15E] text-xl"
          >
            🪔
          </motion.div>
          <motion.div
            animate={{ y: [0, -40, 0], x: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/3 right-12 text-[#C5A15E] text-2xl"
          >
            🌸
          </motion.div>
          <motion.div
            animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 left-1/3 text-[#C5A15E] text-lg"
          >
            ✨
          </motion.div>
        </div>

        {/* Top Header */}
        <div className="relative z-10 pt-10">
          <span className="font-heading text-xs uppercase tracking-[0.3em] text-[#C5A15E] font-bold block mb-1">
            The Royal Wedding of
          </span>
          <span className="text-[11px] text-[#E6D0B5]/80 font-body tracking-wider block">
            || सातों जनम का साथ ||
          </span>
        </div>

        {/* Couple Names Headline */}
        <div className="relative z-10 my-auto py-8">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold text-[#FAF1E5] tracking-tight leading-none drop-shadow-2xl"
          >
            {bride}
          </motion.h1>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="my-3 flex items-center justify-center gap-3"
          >
            <div className="w-12 h-0.5 bg-[#C5A15E]" />
            <span className="font-heading text-2xl sm:text-3xl text-[#C5A15E] font-serif italic">&</span>
            <div className="w-12 h-0.5 bg-[#C5A15E]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold text-[#FAF1E5] tracking-tight leading-none drop-shadow-2xl"
          >
            {groom}
          </motion.h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-[#E6D0B5]">
            <span className="px-3 py-1 rounded-full bg-[#431421]/90 border border-[#C5A15E]/60">
              📅 {weddingDate}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#431421]/90 border border-[#C5A15E]/60">
              📍 {venue.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Scroll Down Cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 pb-8 flex flex-col items-center gap-1.5 text-xs text-[#C5A15E]"
        >
          <span className="uppercase tracking-[0.2em] font-semibold text-[10px]">
            Scroll to Enter the Palace
          </span>
          <ChevronDown size={18} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. FAMILY CARDS: PARCHMENT SCROLLS (CHI. & KUM.)
         ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* Top Divider */}
          <div className="w-40 sm:w-56 mx-auto mb-3">
            <img
              src="/templates/royal-maroon-and-gold/media/divider.webp"
              alt="Ornamental Divider"
              className="w-full h-auto object-contain"
            />
          </div>

          <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#C5A15E] font-bold block mb-1">
            With The Blessings of Ancestors
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#FAF1E5] tracking-tight">
            The Royal Lineage
          </h2>
        </div>

        {/* Two Unrolling Parchment Scrolls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Groom's Scroll (Chi. Vikramaditya) */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0.85 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center shadow-2xl"
          >
            {/* Left Scroll Knob SVG */}
            <div className="w-8 sm:w-10 shrink-0 select-none">
              <img
                src="/templates/royal-maroon-and-gold/media/scroll_knob.svg"
                alt="Scroll finial"
                className="w-full h-auto"
              />
            </div>

            {/* Parchment Scroll Center Body */}
            <div className="flex-1 bg-gradient-to-r from-[#FAF1E5] via-[#FFFDF9] to-[#FAF1E5] text-[#431421] p-6 sm:p-7 rounded-md border-y-4 border-[#C5A15E] shadow-inner text-center relative overflow-hidden">
              <span className="font-heading text-[10px] uppercase tracking-[0.25em] text-[#761F32] font-bold block mb-1">
                Rajputana Kuldeepak
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#761F32] mb-1">
                {groomFormal}
              </h3>
              <div className="w-12 h-0.5 bg-[#C5A15E] mx-auto mb-4" />

              <div className="space-y-3 font-body text-xs leading-relaxed text-[#431421]/90">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#761F32] block">Son of</span>
                  <p className="font-semibold text-sm">{groomParents}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#761F32] block">Grandson of</span>
                  <p className="font-medium text-xs text-[#431421]/80">{groomGrandparents}</p>
                </div>
              </div>
            </div>

            {/* Right Scroll Knob SVG */}
            <div className="w-8 sm:w-10 shrink-0 select-none rotate-180">
              <img
                src="/templates/royal-maroon-and-gold/media/scroll_knob.svg"
                alt="Scroll finial"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Card 2: Bride's Scroll (Kum. Radhika) */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0.85 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center shadow-2xl"
          >
            {/* Left Scroll Knob SVG */}
            <div className="w-8 sm:w-10 shrink-0 select-none">
              <img
                src="/templates/royal-maroon-and-gold/media/scroll_knob.svg"
                alt="Scroll finial"
                className="w-full h-auto"
              />
            </div>

            {/* Parchment Scroll Center Body */}
            <div className="flex-1 bg-gradient-to-r from-[#FAF1E5] via-[#FFFDF9] to-[#FAF1E5] text-[#431421] p-6 sm:p-7 rounded-md border-y-4 border-[#C5A15E] shadow-inner text-center relative overflow-hidden">
              <span className="font-heading text-[10px] uppercase tracking-[0.25em] text-[#761F32] font-bold block mb-1">
                Kulgiri Kanya
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#761F32] mb-1">
                {brideFormal}
              </h3>
              <div className="w-12 h-0.5 bg-[#C5A15E] mx-auto mb-4" />

              <div className="space-y-3 font-body text-xs leading-relaxed text-[#431421]/90">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#761F32] block">Daughter of</span>
                  <p className="font-semibold text-sm">{brideParents}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#761F32] block">Granddaughter of</span>
                  <p className="font-medium text-xs text-[#431421]/80">{brideGrandparents}</p>
                </div>
              </div>
            </div>

            {/* Right Scroll Knob SVG */}
            <div className="w-8 sm:w-10 shrink-0 select-none rotate-180">
              <img
                src="/templates/royal-maroon-and-gold/media/scroll_knob.svg"
                alt="Scroll finial"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. DATE REVEAL: 3 INTERACTIVE BOXES + LIVE COUNTDOWN
         ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 bg-[#431421] border-y border-[#C5A15E]/40 text-center relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#761F32]/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Date Ornament Slot */}
          <div className="w-36 sm:w-48 mx-auto mb-2 opacity-90">
            <img
              src="/templates/royal-maroon-and-gold/media/date_ornament.png"
              alt="Auspicious Kalash"
              className="w-full h-auto object-contain mx-auto"
            />
          </div>

          <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#C5A15E] font-bold block mb-1">
            Save The Sacred Muhurat
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#FAF1E5] mb-8">
            The Auspicious Date
          </h2>

          {/* 3 Interactive Flippable Date Boxes (Date / Month / Year) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto mb-8">
            {/* Box 1: Day */}
            <div className="bg-[#2D0D14] rounded-2xl p-4 sm:p-5 border-2 border-[#C5A15E] shadow-2xl relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-[#C5A15E] tracking-wider block mb-1">
                Day
              </span>
              <AnimatePresence mode="wait">
                {dateRevealed ? (
                  <motion.span
                    key="revealed-day"
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="font-heading text-3xl sm:text-4xl font-bold text-[#FAF1E5] block"
                  >
                    {dateObj.day}
                  </motion.span>
                ) : (
                  <motion.div
                    key="hidden-day"
                    exit={{ rotateX: -90, opacity: 0 }}
                    className="text-2xl text-[#C5A15E] py-1 select-none"
                  >
                    ✦
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Box 2: Month */}
            <div className="bg-[#2D0D14] rounded-2xl p-4 sm:p-5 border-2 border-[#C5A15E] shadow-2xl relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-[#C5A15E] tracking-wider block mb-1">
                Month
              </span>
              <AnimatePresence mode="wait">
                {dateRevealed ? (
                  <motion.span
                    key="revealed-month"
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="font-heading text-xl sm:text-2xl font-bold text-[#FAF1E5] block truncate pt-1"
                  >
                    {dateObj.month}
                  </motion.span>
                ) : (
                  <motion.div
                    key="hidden-month"
                    exit={{ rotateX: -90, opacity: 0 }}
                    className="text-2xl text-[#C5A15E] py-1 select-none"
                  >
                    ✦
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Box 3: Year */}
            <div className="bg-[#2D0D14] rounded-2xl p-4 sm:p-5 border-2 border-[#C5A15E] shadow-2xl relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-[#C5A15E] tracking-wider block mb-1">
                Year
              </span>
              <AnimatePresence mode="wait">
                {dateRevealed ? (
                  <motion.span
                    key="revealed-year"
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="font-heading text-2xl sm:text-3xl font-bold text-[#FAF1E5] block pt-0.5"
                  >
                    {dateObj.year}
                  </motion.span>
                ) : (
                  <motion.div
                    key="hidden-year"
                    exit={{ rotateX: -90, opacity: 0 }}
                    className="text-2xl text-[#C5A15E] py-1 select-none"
                  >
                    ✦
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Reveal Date Trigger Button */}
          {!dateRevealed ? (
            <button
              type="button"
              onClick={() => setDateRevealed(true)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#761F32] via-[#C5A15E] to-[#761F32] text-[#2D0D14] font-body text-xs uppercase tracking-[0.2em] font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              ✨ Reveal The Auspicious Date
            </button>
          ) : (
            /* Live Countdown to the Wedding */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 pt-6 border-t border-[#C5A15E]/30"
            >
              <span className="font-heading text-xs uppercase tracking-[0.2em] text-[#C5A15E] block mb-3">
                Live Countdown to the Holy Vows
              </span>
              <div className="flex justify-center gap-3 max-w-xs mx-auto">
                {[
                  { value: countdown.days, label: 'Days' },
                  { value: countdown.hours, label: 'Hours' },
                  { value: countdown.minutes, label: 'Mins' },
                  { value: countdown.seconds, label: 'Secs' },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 bg-[#2D0D14] p-2.5 rounded-xl border border-[#C5A15E]/40 text-center">
                    <span className="font-heading text-xl sm:text-2xl font-bold text-[#FAF1E5] block leading-none">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#C5A15E] block mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. LOVE STORY: SWIPEABLE CAROUSEL WITH HASHTAG CAPTIONS
         ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#C5A15E] font-bold block mb-1">
            Centuries in the Making
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#FAF1E5]">
            Our Love Story
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#E6D0B5]/80 max-w-md mx-auto mt-2 leading-relaxed">
            {coupleStory}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStoryIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-[#431421] rounded-3xl border border-[#C5A15E]/60 shadow-2xl overflow-hidden"
            >
              {/* Photo Slot */}
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#2D0D14] relative">
                <img
                  src={loveStory[activeStoryIdx].image}
                  alt={loveStory[activeStoryIdx].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if custom upload fails
                    e.target.src = '/templates/royal-maroon-and-gold/media/hero_scene.webp';
                  }}
                />
                {/* Hashtag Badge */}
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#761F32]/90 backdrop-blur-md border border-[#C5A15E] text-[#FAF1E5] font-mono text-xs font-semibold shadow-md">
                  {loveStory[activeStoryIdx].hashtag || '#ourjourney'}
                </div>
              </div>

              {/* Story Content Card */}
              <div className="p-6 sm:p-8 text-center">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#E6D0B5] mb-2">
                  {loveStory[activeStoryIdx].title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#FAF1E5]/80 leading-relaxed max-w-md mx-auto">
                  {loveStory[activeStoryIdx].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Navigation Buttons & Dots */}
          <div className="flex items-center justify-between mt-5 px-2">
            <button
              type="button"
              onClick={() => setActiveStoryIdx((prev) => (prev > 0 ? prev - 1 : loveStory.length - 1))}
              className="w-10 h-10 rounded-full bg-[#431421] border border-[#C5A15E] text-[#C5A15E] flex items-center justify-center hover:bg-[#761F32] transition-colors"
              title="Previous story card"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {loveStory.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeStoryIdx ? 'w-6 bg-[#C5A15E]' : 'w-2 bg-[#FAF1E5]/30'
                  }`}
                  title={`Story chapter ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveStoryIdx((prev) => (prev < loveStory.length - 1 ? prev + 1 : 0))}
              className="w-10 h-10 rounded-full bg-[#431421] border border-[#C5A15E] text-[#C5A15E] flex items-center justify-center hover:bg-[#761F32] transition-colors"
              title="Next story card"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. CEREMONIES: HORIZONTALLY SWIPEABLE ARCHED CARDS
         ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 bg-[#431421]/60 border-y border-[#C5A15E]/30 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#C5A15E] font-bold block mb-1">
            Shubh Vivah Mahotsav
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#FAF1E5]">
            The Ceremonies
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#E6D0B5]/80 mt-1">
            Swipe sideways to view each royal ceremony, timings, and directions.
          </p>
        </div>

        {/* Horizontal Scrolling Arched Cards */}
        <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 no-scrollbar snap-x snap-mandatory">
          {events.map((ev, idx) => {
            const calUrls = buildCalendarUrls(ev, bride, groom);
            const artworkImg = ev.mediaImage || '/templates/royal-maroon-and-gold/media/hero_scene.webp';

            return (
              <div
                key={idx}
                className="w-[280px] sm:w-[320px] shrink-0 bg-[#2D0D14] rounded-t-[40px] rounded-b-2xl border-2 border-[#C5A15E] shadow-2xl flex flex-col justify-between overflow-hidden snap-center relative"
              >
                {/* Arched Illustration Header Slot */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#431421] relative border-b border-[#C5A15E]/40">
                  <img
                    src={artworkImg}
                    alt={ev.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#761F32]/90 border border-[#C5A15E] flex items-center justify-center text-sm shadow-md">
                    {ev.icon || '👑'}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#E6D0B5] mb-2 leading-tight">
                      {ev.name}
                    </h3>
                    <p className="font-body text-xs text-[#FAF1E5]/75 leading-relaxed mb-4">
                      {ev.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-[#FAF1E5] py-2 border-y border-[#C5A15E]/20 mb-4">
                      <div className="flex items-center justify-center gap-1.5 text-[#C5A15E] font-semibold">
                        <Clock size={13} />
                        <span>{ev.date} • {ev.time}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-[#E6D0B5]/80 text-[11px]">
                        <MapPin size={13} className="text-[#C5A15E]" />
                        <span>{ev.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Google Maps Pin & Add to Calendar */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-[#431421] hover:bg-[#761F32] border border-[#C5A15E]/60 text-[#FAF1E5] font-body text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MapPin size={14} className="text-[#C5A15E]" />
                      <span>One-Tap Google Maps</span>
                    </a>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => downloadIcsFile(ev, bride, groom)}
                        className="py-2 px-2 rounded-lg bg-[#761F32] text-[#FAF1E5] border border-[#C5A15E]/40 font-semibold flex items-center justify-center gap-1 hover:border-[#C5A15E] transition-all"
                        title="Download Apple / Outlook .ics calendar file"
                      >
                        <Download size={11} />
                        <span>.ICS File</span>
                      </button>

                      <a
                        href={calUrls.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2 rounded-lg bg-[#761F32] text-[#FAF1E5] border border-[#C5A15E]/40 font-semibold flex items-center justify-center gap-1 hover:border-[#C5A15E] transition-all"
                        title="Add to Google Calendar"
                      >
                        <Calendar size={11} />
                        <span>Google Cal</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. WITH BEST COMPLIMENTS FROM (RELATIVES & RELATIONS)
         ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-40 sm:w-56 mx-auto mb-3">
            <img
              src="/templates/royal-maroon-and-gold/media/divider.webp"
              alt="Divider"
              className="w-full h-auto object-contain"
            />
          </div>
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#C5A15E] font-bold block mb-1">
            Kutumb & Snehijan
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#FAF1E5]">
            With Best Compliments From
          </h2>
        </div>

        {/* Relatives Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {compliments.map((comp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="p-4 rounded-2xl bg-[#431421] border border-[#C5A15E]/50 text-center shadow-lg hover:border-[#C5A15E] transition-all"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#761F32] text-[#C5A15E] font-heading text-[10px] uppercase font-bold tracking-wider mb-2 border border-[#C5A15E]/30">
                {comp.relation}
              </span>
              <p className="font-body text-xs sm:text-sm font-semibold text-[#FAF1E5] leading-snug">
                {comp.names}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. RSVP SECTION
         ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-8 bg-[#431421] border-y border-[#C5A15E]/40">
        <div className="max-w-md mx-auto text-center">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-[#C5A15E] font-bold block mb-1">
            Your Grace & Blessings
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#FAF1E5] mb-2">
            Confirm Your Presence
          </h2>
          <p className="font-body text-xs text-[#E6D0B5]/80 mb-8">
            Please let us know if you will grace our celebration by the 1st of April.
          </p>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#2D0D14] border-2 border-[#C5A15E] shadow-2xl">
            {rsvpComponent ? rsvpComponent : <RoyalDemoRSVP />}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          9. NOTE + CLOSING
         ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-8 max-w-3xl mx-auto text-center">
        {/* Floral Bottom Garland Slot */}
        <div className="w-56 sm:w-72 mx-auto mb-6 opacity-90">
          <img
            src="/templates/royal-maroon-and-gold/media/floral_bottom.webp"
            alt="Floral Garland"
            className="w-full h-auto object-contain mx-auto"
          />
        </div>

        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#E6D0B5] mb-4">
          A Note From Us
        </h3>

        <p className="font-body text-xs sm:text-sm text-[#FAF1E5]/85 leading-relaxed max-w-xl mx-auto mb-8 italic font-serif">
          "{noteFromUs}"
        </p>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C5A15E] to-transparent mx-auto mb-6" />

        <p className="font-heading text-lg sm:text-xl font-bold text-[#FAF1E5] mb-1">
          Your presence means the world to us.
        </p>
        <span className="font-heading text-sm text-[#C5A15E] uppercase tracking-widest font-semibold block">
          — {closingFamily} —
        </span>

        <div className="mt-12 text-[10px] text-[#C5A15E]/60 tracking-widest uppercase">
          Aahvaaan Luxury Wedding Stationery • Designed for Royalty
        </div>
      </section>
    </div>
  );
}
