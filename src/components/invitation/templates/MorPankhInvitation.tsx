import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Phone, User, Mail, Minus, Plus, Heart, MapPin, Check,
  Sparkles, ChevronRight, Navigation, Hotel, Utensils, MessageCircle,
  Share2, Compass, Volume2, VolumeX, Eye
} from 'lucide-react';
import { getTranslation } from '../../../utils/translations';
import supabase, { isSupabaseConfigured } from '../../../lib/supabase';

const themes = {
  Ivory: { '--canvas': '#f7efdf', '--cover-start': '#24655d', '--cover-end': '#0b3c3c', '--color-ivory': '#FBF5E9', '--color-gold': '#C9A24B' },
  'Dark teal': { '--canvas': '#092f32', '--cover-start': '#124d50', '--cover-end': '#031e25', '--color-ivory': '#FBF5E9', '--color-gold': '#D8B86B' },
  Blush: { '--canvas': '#e8c8cd', '--cover-start': '#884c60', '--cover-end': '#472b3d', '--color-ivory': '#FFF4EE', '--color-gold': '#B99049' },
  Ruby: { '--canvas': '#fbf0f0', '--cover-start': '#512D38', '--cover-end': '#2A141D', '--color-ivory': '#FFF5F5', '--color-gold': '#C99191' },
};

const DEFAULT_EVENTS = [
  { name: 'Haldi', day: '26', month: 'FEB', fullDate: 'Friday, 26 Feb 2027', time: '10:00 AM', venue: 'The Marigold Courtyard, The Leela Palace', note: 'A little sunshine, fragrant turmeric, and flower showers', attire: 'Sunshine yellows & marigold florals', color: '#EED795', iconType: 'haldi', icon: '✨' },
  { name: 'Mehendi', day: '26', month: 'FEB', fullDate: 'Friday, 26 Feb 2027', time: '4:00 PM', venue: 'The Garden Pavilion, The Leela Palace', note: 'Love written in fragrant Rajasthani henna and folk tunes', attire: 'Garden greens & playful florals', color: '#D7DFCA', iconType: 'mehendi', icon: '🌿' },
  { name: 'Sangeet & Jaago', day: '26', month: 'FEB', fullDate: 'Friday, 26 Feb 2027', time: '7:00 PM', venue: 'The Peacock Ballroom, The Leela Palace', note: 'An energetic evening of family dance battles & live dhol', attire: 'Jewel tones, sequins & dancing shoes', color: '#E7CCCA', iconType: 'sangeet', icon: '🎶' },
  { name: 'Pheras & Vivaah', day: '27', month: 'FEB', fullDate: 'Saturday, 27 Feb 2027', time: '4:30 PM', venue: 'The Royal Courtyard, The Leela Palace', note: 'Seven sacred promises under Vedic chants at golden hour', attire: 'Royal Indian heritage silks & sherwanis', color: '#C5D9D6', iconType: 'vivaah', icon: '🔥' },
  { name: 'Reception', day: '27', month: 'FEB', fullDate: 'Saturday, 27 Feb 2027', time: '7:30 PM', venue: 'The Grand Palace Lawns, The Leela Palace', note: 'To new beginnings and celebratory royal banquet toasts', attire: 'Black tie, tuxedo & evening glamour', color: '#E4D8BA', iconType: 'reception', icon: '🥂' },
];

const mapLink = 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur';
const button = 'inline-flex min-h-11 items-center justify-center gap-2.5 border border-[#C9A24B] px-6 py-2.5 text-xs font-medium tracking-[0.13em] uppercase transition hover:bg-[#C9A24B] hover:text-[#0E4D4F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-4';

function ActionIcon({ kind }: { kind: 'pin' | 'calendar' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0" aria-hidden="true">
      {kind === 'pin' ? (
        <>
          <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1114 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      ) : (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v5M17 3v5M3 11h18M7 15h3M14 15h3" />
        </>
      )}
    </svg>
  );
}

function Lotus({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={`h-8 w-8 text-gold drop-shadow-sm ${className}`}>
      <path d="M50 20 C45 35 25 45 20 60 C15 75 30 85 50 85 C70 85 85 75 80 60 C75 45 55 35 50 20 Z" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 30 C45 42 35 50 30 62 C26 74 38 82 50 82 C62 82 74 74 70 62 C65 50 55 42 50 30 Z" fill="currentColor" fillOpacity=".4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M50 40 C47 48 42 55 40 65 C38 72 45 78 50 78 C55 78 62 72 60 65 C58 55 53 48 50 40 Z" fill="currentColor" fillOpacity=".7" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="55" r="3" fill="#FFF" />
    </svg>
  );
}

function Peacock({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={`h-11 w-11 text-gold ${className}`}>
      <path d="M50 15 C35 25 25 45 30 65 C35 85 65 85 70 65 C75 45 65 25 50 15 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity=".15" />
      <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity=".3" />
      <path d="M48 20 C48 10 52 10 52 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="9" r="2.5" fill="currentColor" />
      <path d="M40 70 Q50 90 60 70" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function RoyalFrame() {
  return (
    <svg viewBox="0 0 340 540" preserveAspectRatio="none" className="pointer-events-none absolute inset-3 h-[calc(100%-24px)] w-[calc(100%-24px)] text-gold" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M12 528V133Q12 80 60 80Q60 43 111 43Q138 43 170 10Q202 43 229 43Q280 43 280 80Q328 80 328 133V528Z" />
      <path d="M20 520V137Q20 88 68 88Q68 51 114 51Q140 51 170 21Q200 51 226 51Q272 51 272 88Q320 88 320 137V520Z" strokeOpacity=".4" />
      {[32, 308].map(x => (
        <g key={x}>
          <path d={`M${x} 480q-16 14 0 29q16-15 0-29ZM${x} 160v290`} strokeOpacity=".55" />
          <circle cx={x} cy="468" r="3" />
        </g>
      ))}
      <path d="M125 510H215M150 503L170 510L190 503M150 517L170 510L190 517" />
    </svg>
  );
}

function PaperTexture() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full mix-blend-multiply opacity-60" aria-hidden="true">
      <filter id="paper-grain">
        <feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncA type="linear" slope=".05" /></feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
  );
}

function Feather({ className = '', small = false }: { className?: string; small?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 160 190" fill="none" aria-hidden="true" className={`${small ? 'h-12 w-10' : 'h-32 w-24'} shrink-0 drop-shadow-[2px_4px_3px_#001e2540] ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y2="1">
          <stop stopColor="#7dc8a2" />
          <stop offset=".35" stopColor="#217e74" />
          <stop offset=".65" stopColor="#124956" />
          <stop offset="1" stopColor="#77b58c" />
        </linearGradient>
      </defs>
      <path d="M78 150C62 120 14 101 28 49C43-5 105-9 123 45C145 102 90 132 78 150Z" fill={`url(#${id})`} stroke="#baad61" strokeWidth=".7" />
      <ellipse cx="77" cy="64" rx="24" ry="32" fill="#a9b86b" stroke="#ebcb83" />
      <ellipse cx="77" cy="63" rx="18" ry="25" fill="#2bc0b4" />
      <path d="M77 42C49 62 63 84 77 86C95 83 101 61 77 42Z" fill="#284781" stroke="#68b7c0" />
      <ellipse cx="77" cy="66" rx="7" ry="12" fill="#101f43" />
      <path d="M78 86Q72 140 83 185" stroke="#e6c47d" strokeWidth="2" />
    </svg>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 text-gold" aria-hidden="true">
      <span className="h-px w-12 bg-gold/50" />
      <span className="text-base">❧</span>
      <span className="h-px w-12 bg-gold/50" />
    </div>
  );
}

function ShriGanesh({ shloka = '' }: { shloka?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 250" role="img" aria-label="Shri Ganesh" className="h-44 w-44 shrink-0 drop-shadow-[0_6px_8px_#8e6b2725]">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f0d695" />
            <stop offset=".45" stopColor="#c19a45" />
            <stop offset="1" stopColor="#8a6122" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="110" r="86" fill="#C9A24B" fillOpacity=".08" stroke="#C9A24B" strokeWidth=".7" />
        <g fill={`url(#${id})`} stroke="#98732d" strokeWidth=".7">
          <path d="M92 80Q45 52 51 104Q53 143 92 121ZM148 80Q195 52 189 104Q187 143 148 121Z" />
          <path d="M91 78Q88 45 120 44Q152 45 149 78L142 116Q136 131 124 133L122 157Q122 174 138 168Q153 160 143 151Q161 153 157 169Q151 187 130 183Q102 181 105 157L109 126Q92 119 91 78Z" />
          <path d="M91 66L86 37L105 45L120 19L135 45L154 37L149 66Z" />
          <path d="M100 136Q71 139 70 168L79 190Q48 184 44 204Q63 227 106 206Q120 222 134 206Q177 227 196 204Q192 184 161 190L170 167Q165 141 145 136L149 184Q119 198 91 184Z" />
        </g>
      </svg>
      <p lang="hi" className="font-hindi text-sm leading-relaxed text-teal/90 max-w-xs text-center mt-3 italic px-2">
        {shloka || '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'}
      </p>
    </div>
  );
}

// ─── 1. INTERACTIVE PETAL DATE REVEAL HOOK ───
function PetalDateReveal({
  weddingDate = '2027-02-27',
  onAddCalendar,
  t,
}: {
  weddingDate?: string;
  onAddCalendar: () => void;
  t: any;
}) {
  const [revealed, setRevealed] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);

  const [petals, setPetals] = useState(() => {
    const palette = ['#E29393', '#EBABAB', '#F4C2BE', '#EDBB99', '#F9E4D4', '#E6C280', '#D4A373', '#F28482'];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: (i % 6) * 18 - 45 + (Math.random() * 20 - 10),
      y: Math.floor(i / 6) * 15 - 38 + (Math.random() * 20 - 10),
      rot: Math.random() * 360,
      scale: 0.85 + Math.random() * 0.45,
      color: palette[i % palette.length],
      cleared: false,
    }));
  });

  const handleClear = (id: number) => {
    setPetals(prev => prev.map(p => (p.id === id ? { ...p, cleared: true } : p)));
    setClearedCount(c => {
      const next = c + 1;
      if (next >= 8 && !revealed) {
        setRevealed(true);
      }
      return next;
    });
  };

  const handleScatterAll = () => {
    setPetals(prev => prev.map(p => ({ ...p, cleared: true })));
    setRevealed(true);
  };

  // Live Auspicious Countdown
  const [diff, setDiff] = useState(() => {
    const d = new Date(weddingDate + 'T16:30:00+05:30').getTime() - Date.now();
    return Math.max(0, d);
  });

  useEffect(() => {
    const tInterval = setInterval(() => {
      const d = new Date(weddingDate + 'T16:30:00+05:30').getTime() - Date.now();
      setDiff(Math.max(0, d));
    }, 1000);
    return () => clearInterval(tInterval);
  }, [weddingDate]);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <section className="relative my-8 overflow-hidden bg-gradient-to-b from-ivory via-[#fbf5e9] to-ivory px-4 py-14 text-center">
      <Peacock className="mx-auto text-gold mb-2" />
      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-teal italic mb-1">
        {t.dateRevealTitle}
      </h3>
      <p className="text-xs uppercase tracking-[0.2em] text-[#96752d] mb-6">
        {t.dateRevealSub}
      </p>

      <div className="relative min-h-[310px] max-w-md mx-auto flex items-center justify-center p-3">
        {/* Underlying Revealed Card */}
        <div
          className={`transition-all duration-700 w-full rounded-3xl border-2 border-gold/70 bg-[#fffdf7] p-6 sm:p-7 shadow-2xl text-center ${
            revealed ? 'opacity-100 scale-100' : 'opacity-85 scale-95'
          }`}
        >
          <div className="absolute inset-2 rounded-[20px] border border-gold/30 pointer-events-none" />
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#96752d] block mb-2">
            The Sacred Muhurtham
          </span>
          <h4 className="font-serif text-3xl sm:text-4xl font-bold text-teal mb-2">
            Saturday, 27 February 2027
          </h4>
          <p className="text-xs text-stone-600 mb-5">
            Pheras at 4:30 PM Onwards · The Royal Courtyard, Jaipur
          </p>

          {/* Live Countdown Grid */}
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-5">
            {[
              { val: days, lbl: t.days },
              { val: hours, lbl: t.hours },
              { val: minutes, lbl: t.minutes },
              { val: seconds, lbl: t.seconds },
            ].map((u, i) => (
              <div key={i} className="bg-ivory rounded-xl p-2 border border-gold/40 shadow-xs">
                <span className="font-serif text-2xl font-bold text-teal block tabular-nums">
                  {String(u.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-stone-600 block mt-0.5">
                  {u.lbl}
                </span>
              </div>
            ))}
          </div>

          <button onClick={onAddCalendar} className={`${button} rounded-full bg-teal text-ivory text-xs px-6 py-2.5`}>
            <ActionIcon kind="calendar" /> {t.addToCalendar}
          </button>
        </div>

        {/* Scattered Interactive Petals Pile Overlay */}
        <div
          onClick={handleScatterAll}
          className="absolute inset-0 flex items-center justify-center cursor-pointer overflow-hidden pointer-events-auto"
          title="Swipe or drag petals to reveal date"
        >
          {petals.map(p => (
            <motion.div
              key={p.id}
              animate={
                p.cleared
                  ? {
                      x: p.x * 5.5 + (Math.random() * 240 - 120),
                      y: p.y * 5.5 + (Math.random() * 240 - 120),
                      opacity: 0,
                      scale: 0.2,
                      rotate: p.rot + 180,
                    }
                  : {
                      x: `${p.x * 2.8}px`,
                      y: `${p.y * 2.8}px`,
                      opacity: 0.95,
                      scale: p.scale,
                      rotate: p.rot,
                    }
              }
              transition={{ duration: 0.8, ease: 'easeOut' }}
              onMouseEnter={() => handleClear(p.id)}
              onTouchMove={() => handleClear(p.id)}
              className="absolute w-10 h-10 select-none pointer-events-auto cursor-pointer"
              style={{ zIndex: 25 }}
            >
              <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
                <path
                  d="M 20 3 C 11 11 5 21 9 32 C 14 41 26 41 31 32 C 35 21 29 11 20 3 Z"
                  fill={p.color}
                  opacity="0.92"
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
          className="mt-3 text-xs text-[#96752d] font-semibold underline underline-offset-4 hover:opacity-80"
        >
          Tap or swipe petals to reveal date ✨
        </button>
      )}
    </section>
  );
}

// ─── 2. CEREMONIES STACKED DECK WITH CUSTOM EVENT SUPPORT ───
function CeremoniesStackedDeck({ ceremoniesList = DEFAULT_EVENTS, t }: { ceremoniesList?: any[]; t: any }) {
  const [topIndex, setTopIndex] = useState(0);
  const activeEvents = ceremoniesList.length > 0 ? ceremoniesList : DEFAULT_EVENTS;

  const nextCard = () => {
    setTopIndex(prev => (prev + 1) % activeEvents.length);
  };

  const activeCeremony = activeEvents[topIndex];
  const nextCeremony1 = activeEvents[(topIndex + 1) % activeEvents.length];

  return (
    <section id="celebrations" className="my-8 scroll-mt-16 bg-ivory py-14 px-4">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[#96752d]">{t.ceremoniesEyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-teal">{t.ceremoniesTitle}</h2>
      </div>

      {/* Stack Container */}
      <div className="relative mx-auto max-w-sm h-[470px] flex items-center justify-center select-none">
        {/* Layer 2 (Back/Peeking) */}
        <div
          className="absolute inset-x-3 top-3 h-[420px] rounded-3xl border border-gold/40 bg-[#fbf5e7] shadow-lg transition-all duration-300"
          style={{ transform: 'rotate(3deg) translateY(-8px) scale(0.96)', opacity: 0.85 }}
        >
          <div className="p-6 text-center opacity-40">
            <span className="text-xs uppercase tracking-widest text-teal">{nextCeremony1.name}</span>
          </div>
        </div>

        {/* Front Active Card */}
        <motion.div
          key={topIndex}
          initial={{ x: -40, rotate: -3, opacity: 0.8, scale: 0.95 }}
          animate={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
          exit={{ x: 300, rotate: 20, opacity: 0 }}
          transition={{ duration: 0.45 }}
          onClick={nextCard}
          className="relative w-full h-[450px] rounded-3xl border-2 border-gold/70 bg-[#fffdf5] p-6 sm:p-7 shadow-2xl flex flex-col justify-between text-center cursor-pointer overflow-hidden z-20"
        >
          <div className="absolute inset-2.5 rounded-[20px] border border-gold/30 pointer-events-none" />

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#96752d] block">
              {t.chapter} 0{topIndex + 1} of 0{activeEvents.length}
            </span>
            <div className="mt-2 text-2xl">{activeCeremony.icon || '✨'}</div>
            <h3 className="mt-1 font-serif text-3xl font-bold text-teal">
              {activeCeremony.name}
            </h3>

            <div className="my-2 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-gold/50" />
              <span className="text-gold text-sm">❧</span>
              <span className="h-px w-8 bg-gold/50" />
            </div>

            <p className="font-serif text-lg font-semibold text-teal">
              {activeCeremony.fullDate || activeCeremony.date}
            </p>
            <p className="text-sm font-medium text-stone-600 mt-0.5">
              {activeCeremony.time} IST
            </p>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-600">
              <MapPin size={14} className="text-[#96752d]" />
              <span>{activeCeremony.venue}</span>
            </div>

            {activeCeremony.note && (
              <p className="mt-3 text-xs italic text-stone-600 max-w-xs mx-auto">
                "{activeCeremony.note}"
              </p>
            )}
          </div>

          <div className="relative pt-3 border-t border-gold/30 flex items-center justify-between text-left">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#96752d] block">{t.dressCode}</span>
              <span className="text-xs font-medium text-teal truncate max-w-[170px] block">{activeCeremony.attire || 'Festive Indian'}</span>
            </div>
            <a
              href={activeCeremony.mapUrl || mapLink}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-xs font-semibold text-teal underline flex items-center gap-1"
            >
              {t.getDirections}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Swipe aside helper */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={nextCard}
          className="inline-flex items-center gap-2 text-xs font-serif italic text-teal hover:text-gold transition-colors"
        >
          <span>{t.swipeCardAside}</span>
          <span className="inline-block animate-pulse">👉</span>
        </button>

        <div className="mt-3 flex justify-center gap-1.5">
          {activeEvents.map((ev, i) => (
            <button
              key={i}
              onClick={() => setTopIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                topIndex === i ? 'w-6 bg-teal' : 'w-1.5 bg-gold/40'
              }`}
              title={ev.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 3. "DONO PARIVAAR" (BOTH FAMILIES) SECTION ───
function DonoParivaarSection({ content, t }: { content: any; t: any }) {
  const groomFamily = {
    surname: content.groomSurname || 'The Sharmas',
    parents: content.groomParents || 'Sunita & Rajesh Sharma',
    grandparents: content.groomGrandparents || 'Late Pt. Brij Mohan Sharma & Kamla Devi Sharma',
    child: `Beloved son, ${content.groomName || 'Aarav'}`,
    welcomeNote: content.groomFamilyNote || 'With open arms and joyous hearts, our family welcomes you to bless our beloved Aarav as he begins his life’s most auspicious chapter.',
  };

  const brideFamily = {
    surname: content.brideSurname || 'The Kapoors',
    parents: content.brideParents || 'Kavita & Vikram Kapoor',
    grandparents: content.brideGrandparents || 'Late Hari Prasad Mehta & Pushpa Devi Mehta',
    child: `Beloved daughter, ${content.brideName || 'Meera'}`,
    welcomeNote: content.brideFamilyNote || 'Our hearts are filled with gratitude and warmth. We invite you to shower your eternal blessings upon our darling Meera on her wedding day.',
  };

  return (
    <section id="families" className="my-10 bg-ivory px-4 sm:px-6 py-14">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#96752d]">{t.familiesHeadingEyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-teal">{t.familiesHeadingTitle}</h2>
        <p className="text-xs text-stone-600 mt-2">{t.blessedByElders}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Groom's Family */}
        <article className="rounded-3xl border-2 border-gold/50 bg-[linear-gradient(145deg,#fffdf7,#fbf4e5)] p-7 text-center shadow-md relative overflow-hidden">
          <div className="absolute inset-2 border border-gold/25 rounded-[20px] pointer-events-none" />
          <Lotus className="mx-auto text-gold mb-2" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#96752d] block mb-1">
            {t.groomSideLabel}
          </span>
          <h3 className="font-serif text-3xl font-bold text-teal">{groomFamily.surname}</h3>
          
          <div className="my-3 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-gold text-xs">❧</span>
            <span className="h-px w-8 bg-gold/50" />
          </div>

          <p className="text-sm font-semibold text-stone-800">{groomFamily.parents}</p>
          <p className="text-xs text-stone-600 mt-1">Grandson of {groomFamily.grandparents}</p>
          <p className="mt-2 text-xs font-serif italic text-teal">{groomFamily.child}</p>

          <p className="mt-4 text-xs italic leading-relaxed text-stone-600 bg-white/60 p-3 rounded-xl border border-gold/20">
            "{groomFamily.welcomeNote}"
          </p>
        </article>

        {/* Bride's Family */}
        <article className="rounded-3xl border-2 border-gold/50 bg-[linear-gradient(145deg,#fffdf7,#fbf4e5)] p-7 text-center shadow-md relative overflow-hidden">
          <div className="absolute inset-2 border border-gold/25 rounded-[20px] pointer-events-none" />
          <Lotus className="mx-auto text-gold mb-2" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#96752d] block mb-1">
            {t.brideSideLabel}
          </span>
          <h3 className="font-serif text-3xl font-bold text-teal">{brideFamily.surname}</h3>

          <div className="my-3 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gold/50" />
            <span className="text-gold text-xs">❧</span>
            <span className="h-px w-8 bg-gold/50" />
          </div>

          <p className="text-sm font-semibold text-stone-800">{brideFamily.parents}</p>
          <p className="text-xs text-stone-600 mt-1">Granddaughter of {brideFamily.grandparents}</p>
          <p className="mt-2 text-xs font-serif italic text-teal">{brideFamily.child}</p>

          <p className="mt-4 text-xs italic leading-relaxed text-stone-600 bg-white/60 p-3 rounded-xl border border-gold/20">
            "{brideFamily.welcomeNote}"
          </p>
        </article>
      </div>
    </section>
  );
}

// ─── 4. WEDDING-DAY LIVE LOCATION MODULE ───
function LiveLocationModule({ content, t }: { content: any; t: any }) {
  const isEnabled = content.liveLocationEnabled !== false;
  const locationUrl = content.liveLocationUrl || 'https://maps.google.com/?q=The+Leela+Palace+Jaipur';
  const statusNote = content.liveLocationStatus || 'Wedding festivities underway at Royal Courtyard • Jaipur';

  if (!isEnabled) return null;

  return (
    <section id="live-location" className="my-8 scroll-mt-16 px-4">
      <div className="max-w-lg mx-auto bg-gradient-to-r from-[#0E4D4F] via-[#125759] to-[#0A3D3E] text-ivory rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-gold/60 text-center relative overflow-hidden">
        {/* Pulsating Live indicator */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1 rounded-full mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            {t.liveLocationBadge}
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold italic mb-2">
          {t.liveLocationTitle}
        </h3>
        <p className="text-xs text-[#E3D3AE] max-w-sm mx-auto leading-relaxed mb-4">
          {statusNote}
        </p>

        <a
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[linear-gradient(120deg,#e6d09a,#bd9446,#e6d09a)] text-[#173d35] font-semibold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Navigation size={14} />
          <span>{t.openLiveMap}</span>
        </a>
      </div>
    </section>
  );
}

// ─── 5. SHAGUN & BLESSING NOTES / GUESTBOOK SECTION ───
function ShagunBlessingsSection({ invitationId, t }: { invitationId?: string; t: any }) {
  const [blessings, setBlessings] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem(`aahvaaan_blessings_${invitationId || 'default'}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'b-1',
        guest_name: 'Dada-Dadi (Sharma Family)',
        relation_city: 'Delhi',
        blessing_note: 'सदा सुहागन रहो बेटा। परमात्मा तुम दोनों को सदा खुश और स्वस्थ रखे। ढेरों आशीर्वाद!',
        created_at: new Date().toISOString(),
      },
      {
        id: 'b-2',
        guest_name: 'Vikram Mehta Chacha ji',
        relation_city: 'Jaipur',
        blessing_note: 'Heartiest congratulations Aarav & Meera! May your life together be as grand and beautiful as Jaipur itself.',
        created_at: new Date().toISOString(),
      },
    ];
  });

  const [form, setForm] = useState({ name: '', relation: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load from Supabase if available
  useEffect(() => {
    async function loadBlessings() {
      if (!isSupabaseConfigured || !invitationId) return;
      try {
        const { data, error } = await supabase
          .from('blessings')
          .select('*')
          .eq('invitation_id', invitationId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setBlessings(data);
        }
      } catch {}
    }
    loadBlessings();
  }, [invitationId]);

  const handleSendBlessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.note.trim()) return;

    setSubmitting(true);
    const newEntry = {
      id: `b-${Date.now()}`,
      guest_name: form.name.trim(),
      relation_city: form.relation.trim() || 'Well-wisher',
      blessing_note: form.note.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured && invitationId) {
        await supabase.rpc('submit_blessing_note', {
          p_invitation_id: invitationId,
          p_guest_name: form.name.trim(),
          p_relation_city: form.relation.trim() || null,
          p_blessing_note: form.note.trim(),
        });
      }
      const updated = [newEntry, ...blessings];
      setBlessings(updated);
      localStorage.setItem(`aahvaaan_blessings_${invitationId || 'default'}`, JSON.stringify(updated));
      setForm({ name: '', relation: '', note: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error('Blessing error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="blessings" className="my-10 bg-ivory px-4 sm:px-6 py-14">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#96752d]">{t.blessingsEyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-teal">{t.blessingsTitle}</h2>
        <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">{t.leaveBlessingPrompt}</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Blessing Submission Form */}
        <form onSubmit={handleSendBlessing} className="rounded-3xl border-2 border-gold/60 bg-[#fffdf7] p-5 sm:p-6 shadow-xl mb-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              required
              placeholder={t.senderNamePlaceholder}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold/40 text-xs bg-white text-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
            <input
              type="text"
              placeholder={t.relationPlaceholder}
              value={form.relation}
              onChange={e => setForm({ ...form, relation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold/40 text-xs bg-white text-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <textarea
            required
            rows={2}
            placeholder={t.yourBlessingPlaceholder}
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gold/40 text-xs bg-white text-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-full bg-teal text-ivory text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#0a383a] transition-all disabled:opacity-50"
          >
            {submitting ? 'Recording Blessing...' : t.sendBlessingBtn}
          </button>

          {submitted && (
            <p className="text-[11px] text-emerald-700 font-semibold text-center mt-1">
              ✓ {t.blessingSubmittedSuccess}
            </p>
          )}
        </form>

        {/* Live Blessing Notes Stream */}
        <div className="space-y-3">
          {blessings.map((b) => (
            <div key={b.id} className="bg-white/90 rounded-2xl p-4 border border-gold/30 shadow-xs flex items-start gap-3">
              <span className="text-xl text-rose-500 mt-0.5">🌸</span>
              <div className="flex-1">
                <p className="text-xs text-stone-700 italic leading-relaxed">
                  "{b.blessing_note}"
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-[#96752d] font-semibold border-t border-gold/20 pt-1.5">
                  <span>{b.guest_name} ({b.relation_city || 'Well-wisher'})</span>
                  <span className="text-stone-400 font-normal">
                    {new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 6. CLOTHESLINE HANGING POLAROID PHOTO GALLERY ───
function HangingPolaroidGallery({ gallery = [], t }: { gallery?: string[]; t: any }) {
  const polaroids = gallery.length > 0 ? gallery : [
    { tag: '#howitstarted', caption: 'One hello. A thousand possibilities.' },
    { tag: '#adventures', caption: 'Exploring the world, hand in hand.' },
    { isNote: true, quote: 'Friendship grew into something more, and we realized life’s best moments were the ones we shared together.', tag: '#thelittlethings' },
    { tag: '#foreverstarts', caption: 'In every chapter, I would choose you.' },
    { tag: '#familymoments', caption: 'Surrounded by the warmth of those we love.' },
  ];

  return (
    <section id="glimpses" className="relative my-8 overflow-hidden bg-gradient-to-b from-[#FAF4EB] via-[#FAF6F0] to-[#FAF4EB] py-14 px-4">
      <div className="text-center mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#96752d]">{t.galleryEyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-teal">{t.galleryTitle}</h2>
      </div>

      {/* Wooden Hanging Clothesline Rod */}
      <div className="max-w-lg mx-auto mb-2 px-6">
        <div className="h-3 bg-gradient-to-r from-[#6e4324] via-[#8B5A2B] to-[#5C3818] rounded-full shadow-md relative w-full">
          {[20, 40, 60, 80].map(p => (
            <div key={p} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#422510] rounded-full border border-[#b7936a]" style={{ left: `${p}%` }} />
          ))}
        </div>
      </div>

      {/* Horizontal Swipeable Clothesline Reel */}
      <div className="flex items-start gap-5 overflow-x-auto pb-6 pt-1 px-6 max-w-2xl mx-auto scrollbar-none snap-x snap-mandatory">
        {polaroids.map((item: any, idx: number) => (
          <div key={idx} className="snap-center shrink-0 w-64 flex flex-col items-center">
            <div className="w-px h-7 bg-[#9e7a4b] shadow-xs mb-[-2px] z-10" />

            {item.isNote ? (
              <div className="w-full bg-[#FAF4EB] border-2 border-gold/60 rounded-xl p-6 shadow-xl flex flex-col justify-between text-center min-h-[290px]">
                <div className="my-auto">
                  <span className="text-gold text-lg block mb-2">❧</span>
                  <p className="font-serif text-base text-teal italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>
                <span className="font-serif text-xs font-bold text-[#96752d] block mt-4">
                  {item.tag}
                </span>
              </div>
            ) : typeof item === 'string' ? (
              <div className="w-full bg-white rounded-xl p-3 pb-4 shadow-xl border border-stone-200 flex flex-col items-center min-h-[290px]">
                <div className="w-full aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden mb-3">
                  <img src={item} alt="Memory" loading="lazy" className="w-full h-full object-cover" />
                </div>
                <span className="font-serif text-xs font-bold text-[#96752d] italic">
                  #foreverA&M
                </span>
              </div>
            ) : (
              <div className="w-full bg-white rounded-xl p-3 pb-4 shadow-xl border border-stone-200 flex flex-col items-center min-h-[290px]">
                <div className="w-full aspect-[4/5] bg-[#EFECE6] rounded-lg flex flex-col items-center justify-center text-stone-400 text-xs italic mb-3 p-4 text-center border border-dashed border-stone-300">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold mb-2 shadow-xs">
                    <Heart size={14} />
                  </div>
                  <span>Your photo here</span>
                </div>
                <span className="font-serif text-xs font-bold text-[#96752d] italic">
                  {item.tag}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-2">
        <span className="inline-block rounded-full bg-white/90 border border-gold/40 px-5 py-1 text-[11px] font-semibold text-teal tracking-widest uppercase shadow-2xs">
          {t.swipePrompt}
        </span>
      </div>
    </section>
  );
}

// ─── 7. ENHANCED "YOUR PRESENCE MATTERS" RSVP SECTION ───
function EnhancedRSVPSection({
  invitationId,
  guestDefault = '',
  t,
}: {
  invitationId?: string;
  guestDefault?: string;
  t: any;
}) {
  const [name, setName] = useState(guestDefault || '');
  const [mobile, setMobile] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attendingStatus, setAttendingStatus] = useState('attending');
  const [dietary, setDietary] = useState('Pure Vegetarian');
  const [stayRequired, setStayRequired] = useState('No Stay Needed');
  const [stayDetails, setStayDetails] = useState('');
  const [wishes, setWishes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;
    const cleanPhone = mobile.replace(/[^0-9]/g, '');

    try {
      if (isSupabaseConfigured && invitationId) {
        await supabase.rpc('submit_guest_rsvp', {
          p_invitation_id: invitationId,
          p_name: name,
          p_phone: cleanPhone,
          p_status: attendingStatus,
          p_guest_count: guestCount,
          p_dietary: dietary,
          p_message: wishes.trim() || null,
          p_stay_required: stayRequired,
          p_stay_details: stayDetails.trim() || null,
        });
      }

      localStorage.setItem(`aahvaaan_rsvp_${cleanPhone}`, JSON.stringify({
        name,
        mobile: cleanPhone,
        attendingStatus,
        guestCount,
        dietary,
        stayRequired,
        stayDetails,
        wishes,
        timestamp: new Date().toISOString(),
      }));
    } catch {}

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="rsvp" className="my-8 scroll-mt-16 bg-ivory px-4 py-16 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl border-2 border-gold/70 bg-[#fffdf5] shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-teal text-gold flex items-center justify-center mx-auto mb-4">
            <Check size={24} />
          </div>
          <h3 className="font-serif text-3xl font-bold text-teal mb-2">{t.responseLovinglyNoted}</h3>
          <p className="text-sm text-stone-600 mt-3 leading-relaxed">
            Thank you, {name}! We have recorded your attendance and preferences.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 text-xs text-[#96752d] font-semibold underline"
          >
            {t.updateResponse}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="my-8 scroll-mt-16 bg-ivory px-4 py-14">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal">
            {t.rsvpHeading}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-600">
            {t.rsvpSubheading}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border-2 border-gold/60 bg-[#fffdf5] p-6 sm:p-7 shadow-2xl space-y-4">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <User size={15} />
                </span>
                <input
                  type="text"
                  required
                  placeholder={t.yourName}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gold/40 bg-white text-xs sm:text-sm text-teal placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <Phone size={15} />
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder={t.mobileNumber}
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gold/40 bg-white text-xs sm:text-sm text-teal placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5 pl-1">{t.mobileHelper}</p>
            </div>
          </div>

          {/* Attending Radios */}
          <div>
            <label className="block text-xs font-semibold text-teal mb-1.5">{t.willYouAttend}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'attending', label: t.joyfullyAttend },
                { id: 'maybe', label: t.tentativeMaybe },
                { id: 'not_attending', label: t.regretfullyDecline },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAttendingStatus(opt.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    attendingStatus === opt.id
                      ? 'bg-teal text-ivory border-teal shadow-xs'
                      : 'bg-white text-stone-600 border-gold/30 hover:border-gold'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Headcount Stepper */}
          {attendingStatus !== 'not_attending' && (
            <div className="bg-[#FAF7F2] border border-gold/30 rounded-2xl p-4 text-center">
              <label className="block text-xs font-bold text-teal mb-2">
                {t.howManyComing}
              </label>
              <div className="inline-flex items-center gap-4 bg-white border border-gold/40 rounded-full px-5 py-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-6 h-6 rounded-full text-stone-600 hover:bg-[#FAF7F2] flex items-center justify-center"
                >
                  <Minus size={13} />
                </button>
                <span className="font-serif text-lg font-bold text-teal w-6 text-center tabular-nums">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.min(15, guestCount + 1))}
                  className="w-6 h-6 rounded-full text-stone-600 hover:bg-[#FAF7F2] flex items-center justify-center"
                >
                  <Plus size={13} />
                </button>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">{t.headcountSubtext}</p>
            </div>
          )}

          {/* Food Preference & Stay Requirement */}
          {attendingStatus !== 'not_attending' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-teal mb-1 flex items-center gap-1">
                  <Utensils size={13} /> {t.foodPreference}
                </label>
                <select
                  value={dietary}
                  onChange={e => setDietary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gold/40 bg-white text-xs text-teal focus:outline-none"
                >
                  <option value="Pure Vegetarian">{t.veg}</option>
                  <option value="Jain (No Onion/Garlic)">{t.jain}</option>
                  <option value="Non-Vegetarian">{t.nonVeg}</option>
                  <option value="Multi-Cuisine">{t.multiCuisine}</option>
                </select>
              </div>

              {/* Stay / Accommodation */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/30 space-y-2">
                <label className="block text-xs font-semibold text-teal flex items-center gap-1">
                  <Hotel size={13} /> {t.stayRequirement}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'No Stay Needed', label: t.noStayNeeded },
                    { id: 'Stay Required', label: t.stayNeeded },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStayRequired(opt.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                        stayRequired === opt.id
                          ? 'bg-teal text-white border-teal'
                          : 'bg-white text-charcoal border-gold/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {stayRequired === 'Stay Required' && (
                  <input
                    type="text"
                    value={stayDetails}
                    onChange={e => setStayDetails(e.target.value)}
                    placeholder={t.stayDetailsPlaceholder}
                    className="w-full px-3 py-2 bg-white border border-gold/40 rounded-lg text-xs text-teal focus:outline-none"
                  />
                )}
              </div>
            </div>
          )}

          {/* Warm blessings note */}
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-stone-400">
                <Mail size={15} />
              </span>
              <textarea
                rows={2}
                value={wishes}
                onChange={e => setWishes(e.target.value)}
                placeholder={t.leaveWishOptional}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gold/40 bg-white text-xs text-teal placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-teal"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-teal via-[#135d5f] to-[#1c7870] hover:from-[#0a383a] hover:to-teal text-ivory font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            {t.sendRsvpBtn}
          </button>

          <p className="text-[10px] text-stone-500 text-center">{t.rsvpPreviewNotice}</p>
        </form>
      </div>
    </section>
  );
}

// ─── MASTER LUXURY INVITATION TEMPLATE ───
export default function MorPankhInvitation({
  template = {},
  content = {},
  guestName: propGuestName,
  rsvpComponent = null,
  isPreview = false,
}: any = {}) {
  const [opened, setOpened] = useState(false);
  const [lang, setLang] = useState('en'); // 'en' | 'hi' | 'pa'
  const t = getTranslation(lang);

  const [guest, setGuest] = useState(propGuestName || content?.guestName || 'Mr. Joshi and Family');
  const [themeKey, setThemeKey] = useState<keyof typeof themes>(content.themeColor || 'Ivory');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const welcome = useRef<HTMLElement | null>(null);
  const greeting = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (propGuestName) setGuest(propGuestName);
  }, [propGuestName]);

  function openInvitation() {
    setOpened(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
    setTimeout(() => {
      welcome.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }

  function toggleAudio() {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  }

  function addCalendar() {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Aahvaaan//Luxury Wedding//EN\nBEGIN:VEVENT\nSUMMARY:${content.brideName || 'Meera'} & ${content.groomName || 'Aarav'} Wedding\nDTSTART:20270227T110000Z\nDTEND:20270227T180000Z\nLOCATION:${content.venue || 'The Leela Palace, Jaipur'}\nDESCRIPTION:Seven Sacred Promises. One Eternal Bond.\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-invitation.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const brideName = content.brideName || 'Meera';
  const groomName = content.groomName || 'Aarav';
  const audioTrack = content.audioTrack || '/templates/mor-pankh/media/music.mp3';

  return (
    <div style={themes[themeKey] as CSSProperties} className="relative min-h-screen bg-[var(--canvas)] font-body text-charcoal transition-colors duration-500 overflow-x-hidden">
      
      {/* ─── FLOATING AUDIO CONTROLLER ─── */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleAudio}
          className="w-11 h-11 rounded-full bg-teal/90 text-gold border border-gold/60 shadow-xl flex items-center justify-center backdrop-blur-sm hover:scale-105 active:scale-95 transition-all"
          title={musicPlaying ? 'Mute Wedding Shehnai' : 'Play Wedding Music'}
        >
          {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      <div className="relative isolate mx-auto max-w-[450px] overflow-hidden bg-[var(--canvas)] shadow-[0_30px_100px_#001c1c80] transition-colors duration-500 md:rounded-[44px] md:border-[9px] md:border-[#142f2e] md:ring-1 md:ring-[#b7a16a]">
        <audio ref={audioRef} src={audioTrack} loop preload="auto" />
        <PaperTexture />

        {/* ─── PREVIEW / TRIAL WATERMARK BANNER ─── */}
        {isPreview && (
          <div className="bg-[#241A1C] text-[#E3D3AE] text-[11px] py-1.5 px-4 text-center border-b border-gold/40 flex items-center justify-center gap-1.5 z-40 relative">
            <Eye size={12} className="text-gold animate-pulse" />
            <span>{t.previewModeNotice}</span>
          </div>
        )}

        {/* ─── BRAND HEADER & LANGUAGE SWITCHER ─── */}
        <header className="relative z-30 flex min-h-20 items-center justify-between border-b border-gold/30 bg-ivory px-5">
          <a href="#" className="text-teal" aria-label="Aahvaaan home">
            <span className="font-serif text-2xl tracking-[0.06em]">aahvaaan<span className="text-gold">.</span></span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-stone-500">{t.brandSubtitle}</span>
          </a>

          {/* Language Switcher Pill (English | हिन्दी | ਪੰਜਾਬੀ) */}
          <div className="flex items-center gap-1 bg-white/90 border border-gold/50 rounded-full p-1 shadow-2xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                lang === 'en' ? 'bg-teal text-white shadow-xs' : 'text-stone-600 hover:text-teal'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-hindi transition-all ${
                lang === 'hi' ? 'bg-teal text-white shadow-xs' : 'text-stone-600 hover:text-teal'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('pa')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-punjabi transition-all ${
                lang === 'pa' ? 'bg-teal text-white shadow-xs' : 'text-stone-600 hover:text-teal'
              }`}
            >
              ਪੰਜਾਬੀ
            </button>
          </div>
        </header>

        <main>
          {/* ─── SECTION 1: ARCH GATE COVER WITH 3D WAX SEAL ─── */}
          <section className="relative bg-ivory px-5 pb-12 pt-8 text-center">
            <p className="font-hindi text-base text-teal">॥ श्री गणेशाय नमः ॥</p>
            <p className="mb-5 mt-2 text-[11px] uppercase tracking-[0.23em] text-teal">{t.auspiciousBeginning}</p>
            
            <div className="relative mx-auto min-h-[630px] max-w-[420px] overflow-hidden rounded-t-[210px] border-2 border-gold bg-[radial-gradient(ellipse_at_top,var(--cover-start),var(--cover-end))] shadow-[0_18px_35px_-10px_#0e4d4f60] [perspective:1100px]">
              {/* Shri Ganesh Inside View */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ivory px-6 pb-14">
                <ShriGanesh shloka={content.shloka} />
                <div className="my-4"><Ornament /></div>
                <p className="font-serif text-2xl italic text-teal">With Divine Blessings</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-[#96752d]">The Wedding of {brideName} & {groomName}</p>
              </div>

              {/* Two 3D Perspective Opening Arch Gates */}
              {[0, 1].map(side => (
                <div
                  key={side}
                  className={`pointer-events-none absolute inset-y-0 w-1/2 overflow-hidden border-gold/60 bg-[radial-gradient(ellipse_at_top,var(--cover-start),var(--cover-end))] transition-transform duration-1000 ${
                    side ? 'right-0 origin-right border-l' : 'left-0 origin-left border-r'
                  }`}
                  style={{ transform: opened ? `rotateY(${side ? '' : '-'}110deg)` : 'rotateY(0deg)' }}
                >
                  <div className={`absolute inset-y-0 w-[200%] ${side ? 'right-0' : 'left-0'}`}>
                    <RoyalFrame />
                    <Feather className="absolute left-1/2 top-14 -translate-x-1/2 text-gold" />
                    <div className="absolute inset-x-8 top-[215px] text-center">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#E3D3AE]">{t.togetherForever}</p>
                      <h1 className="mt-4 font-serif text-5xl text-ivory">
                        {groomName} <span className="font-serif italic text-gold">&</span> {brideName}
                      </h1>
                      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#E3D3AE]">
                        {content.weddingDate || '27 February 2027'} · {content.location || 'Jaipur'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* 3D Wax Seal */}
              {!opened && (
                <button
                  onClick={openInvitation}
                  aria-label="Break the wax seal and open the invitation"
                  className="absolute left-1/2 top-[410px] z-10 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-[45%_55%_49%_51%/54%_45%_55%_46%] border-4 border-[#b78b43] bg-[radial-gradient(circle_at_30%_25%,#f1d99c,#c29b51_55%,#8f692c)] shadow-[0_7px_16px_#001c1c80] transition hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#806026] font-serif text-3xl italic text-[#4c371c]">
                    {groomName.charAt(0)}&{brideName.charAt(0)}
                  </span>
                </button>
              )}

              {/* Open CTA */}
              <button
                onClick={openInvitation}
                disabled={opened}
                className="absolute bottom-8 left-1/2 z-10 min-h-12 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#E5CE96] bg-[linear-gradient(120deg,#e6d09a,#bd9446,#e6d09a)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#173d35] shadow-lg transition hover:scale-105 active:scale-95"
              >
                {opened ? t.invitationOpened : t.tapToOpen}
              </button>
            </div>
          </section>

          {/* ─── UNFOLDED INVITATION CONTENT ─── */}
          <div id="invitation-story" hidden={!opened}>
            
            {/* Couple Welcome */}
            <section ref={welcome} tabIndex={-1} className="px-5 py-6 focus:outline-none">
              <div className="relative mx-auto max-w-lg overflow-hidden rounded-t-[170px] border border-gold/60 bg-[radial-gradient(ellipse_at_top,#fffdf5,#f4ead5)] px-6 pb-9 pt-12 text-center shadow-xl">
                <p className="font-hindi text-xl text-teal">{t.royalWelcomeHindi}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-teal">{t.royalWelcomeTitle}</p>
                
                <div className="relative mx-auto mt-4 max-w-[300px]">
                  <img
                    src={content.couplePhoto || '/images/mor-pankh-couple.png'}
                    alt="Couple Namaste Welcome"
                    loading="lazy"
                    className="relative h-auto w-full object-contain drop-shadow-md"
                  />
                </div>

                <div className="relative mt-5 space-y-3">
                  <h2 className="font-serif text-2xl sm:text-3xl italic text-teal">
                    {t.dearGuest} {guest || t.ourLovedOnes},
                  </h2>
                  <p className="mx-auto max-w-sm text-xs sm:text-sm leading-relaxed text-stone-600">
                    {t.royalWelcomeBody}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => greeting.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className={`${button} rounded-full bg-teal text-ivory`}
                    >
                      {t.stepIntoStory}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Sticky Navigation Bar */}
            <nav className="sticky top-0 z-30 flex justify-center gap-4 sm:gap-6 border-y border-gold/30 bg-ivory/95 px-3 py-2.5 backdrop-blur overflow-x-auto no-scrollbar">
              {[
                [t.navDate, '#date-reveal'],
                [t.navCeremonies, '#celebrations'],
                [t.navFamilies, '#families'],
                [t.navGallery, '#glimpses'],
                [t.navLiveLocation, '#live-location'],
                [t.navBlessings, '#blessings'],
                [t.navRsvp, '#rsvp'],
              ].map(([label, href]) => (
                <a key={href} href={href} className="text-[11px] uppercase tracking-wider text-teal hover:underline font-semibold whitespace-nowrap">
                  {label}
                </a>
              ))}
            </nav>

            {/* Formal Invitation Card */}
            <section ref={greeting} tabIndex={-1} className="relative mx-4 my-8 border border-gold/60 bg-ivory/95 px-6 py-9 text-center shadow-xl">
              <div className="pointer-events-none absolute inset-2 border border-gold/25" />
              <Feather small className="mx-auto mb-3 text-gold" />
              <p className="font-hindi text-base text-teal">॥ श्री गणेशाय नमः ॥</p>
              
              <h2 className="mt-5 font-serif text-3xl italic text-teal">
                {t.dearGuest} {guest || t.ourLovedOnes},
              </h2>
              
              <p className="mx-auto mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-stone-600">
                Join us as we begin our forever, surrounded by the warmth and blessings of our beloved family and friends.
              </p>
              
              <div className="my-5"><Ornament /></div>
              
              <p className="text-xs sm:text-sm leading-6 text-stone-600">
                {content.groomParents || 'Sunita & Rajesh Sharma'}<br />
                <span className="font-serif text-lg italic text-teal">{t.and}</span><br />
                {content.brideParents || 'Kavita & Vikram Kapoor'}
              </p>
              
              <p className="mt-3 text-[11px] uppercase tracking-wider text-[#96752d]">
                {t.weddingOf}
              </p>
              
              <p className="mt-3 font-serif text-4xl sm:text-5xl text-teal">
                {groomName} <span className="italic text-gold">&</span> {brideName}
              </p>
              
              <p className="mt-3 font-serif text-base italic text-teal">
                Seven Sacred Vows · One Eternal Bond
              </p>
            </section>

            {/* ─── SECTION 2: INTERACTIVE PETAL REVEAL & COUNTDOWN ─── */}
            <div id="date-reveal">
              <PetalDateReveal
                weddingDate={content.weddingDate || '2027-02-27'}
                onAddCalendar={addCalendar}
                t={t}
              />
            </div>

            {/* ─── SECTION 3: DONO PARIVAAR (BOTH FAMILIES) ─── */}
            <DonoParivaarSection content={content} t={t} />

            {/* ─── SECTION 4: MULTI-EVENT CEREMONIES STACKED DECK ─── */}
            <CeremoniesStackedDeck ceremoniesList={content.events || DEFAULT_EVENTS} t={t} />

            {/* ─── SECTION 5: WEDDING-DAY LIVE LOCATION MODULE ─── */}
            <LiveLocationModule content={content} t={t} />

            {/* Venue Card */}
            <section id="venue" className="my-8 scroll-mt-16 bg-ivory px-6 py-12 text-center">
              <Peacock className="mx-auto text-gold mb-2" />
              <h2 className="font-serif text-2xl sm:text-3xl italic text-teal">
                {content.venue || 'The Leela Palace, Jaipur'}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-widest text-[#96752d]">The Royal Destination</p>
              <p className="mx-auto mt-3 max-w-sm text-xs text-stone-600 leading-relaxed">
                {content.address || 'Delhi Highway, NH 11, Kukas, Jaipur, Rajasthan 302028'}
              </p>
              <div className="mt-5">
                <a
                  href={content.mapUrl || mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`${button} rounded-full bg-teal text-ivory text-xs px-8 py-2.5`}
                >
                  <ActionIcon kind="pin" /> Open in Google Maps ↗
                </a>
              </div>
            </section>

            {/* ─── SECTION 6: CLOTHESLINE POLAROID MEMORIES GALLERY ─── */}
            <HangingPolaroidGallery gallery={content.gallery} t={t} />

            {/* ─── SECTION 7: SHAGUN & BLESSINGS GUESTBOOK ─── */}
            <ShagunBlessingsSection invitationId={content.id} t={t} />

            {/* ─── SECTION 8: ENHANCED RSVP SECTION ─── */}
            {rsvpComponent ? (
              <div id="rsvp" className="my-8 scroll-mt-16 bg-ivory px-4 py-12">
                {rsvpComponent}
              </div>
            ) : (
              <EnhancedRSVPSection
                invitationId={content.id}
                guestDefault={guest}
                t={t}
              />
            )}

            {/* Luxury Royal Footer */}
            <footer className="bg-[radial-gradient(ellipse_at_top,#24655d,#0b3c3c)] px-6 py-12 text-center text-ivory">
              <Feather small className="mx-auto text-gold mb-2" />
              <p className="font-serif text-xl italic">The best part of our day will be having you there.</p>
              <p className="mb-3 mt-4 font-script text-4xl">{groomName} & {brideName}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E3D3AE]">
                {content.weddingDate || '27.02.2027'} · {content.location || 'Jaipur'}
              </p>
              <div className="mx-auto my-6 h-px max-w-xs bg-gold/40" />
              <p className="text-xs text-[#E3D3AE]">
                Crafted with love by <span className="font-serif text-base text-ivory">Aahvaaan</span>
              </p>
              <p className="mt-1 text-[10px] tracking-widest text-[#E3D3AE]">ROYAL HERITAGE DIGITAL INVITATIONS</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
