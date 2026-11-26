import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Phone, User, Mail, Minus, Plus, Heart, MapPin, Check, Sparkles, ChevronRight
} from 'lucide-react';

const hindi: Record<string, string> = {
  'A little note, just for you': 'आपके नाम एक प्यार भरा संदेश',
  'Let the festivities begin': 'आइए, उत्सव का शुभारंभ करें',
  'Glimpses of us': 'हमारी कुछ झलकियाँ',
  'Two families. One beautiful bond.': 'दो परिवार, एक सुंदर बंधन',
  'Save our date': 'इस शुभ तिथि को याद रखिए',
  'Will you join us?': 'क्या आप हमारे साथ होंगे?',
  'Your Presence Matters': 'आपकी उपस्थिति हमारे लिए अनमोल है',
  'Ceremonies': 'मांगलिक कार्यक्रम',
  'Ring Ceremony': 'सगाई', Haldi: 'हल्दी', Mehendi: 'मेहंदी', Sangeet: 'संगीत', Vivaah: 'विवाह', Reception: 'स्वागत समारोह',
  'A sacred beginning': 'एक पावन शुरुआत', 'With love, our families': 'हमारे परिवारों की ओर से सप्रेम',
  'Three days of togetherness': 'तीन दिन, अनगिनत यादें', 'A note from our hearts': 'हमारे दिल की बात',
  'Where it all began': 'जहाँ से कहानी शुरू हुई', 'The little things': 'छोटी-छोटी खुशियाँ', 'Side by side': 'साथ-साथ',
  'Our kind of love': 'हमारा अनोखा प्यार', 'Always you': 'हर बार तुम', 'Forever starts here': 'यहीं से सदा का साथ',
  'The Sharmas': 'शर्मा परिवार', 'The Kapoors': 'कपूर परिवार',
  'Our joy begins with you.': 'आपके आने से हमारी खुशियाँ पूरी हैं',
  'Your reply is lovingly noted.': 'आपका उत्तर सप्रेम स्वीकार है',
};

const themes = {
  Ivory: { '--canvas': '#f7efdf', '--cover-start': '#24655d', '--cover-end': '#0b3c3c', '--color-ivory': '#FBF5E9', '--color-gold': '#C9A24B' },
  'Dark teal': { '--canvas': '#092f32', '--cover-start': '#124d50', '--cover-end': '#031e25', '--color-ivory': '#FBF5E9', '--color-gold': '#D8B86B' },
  Blush: { '--canvas': '#e8c8cd', '--cover-start': '#884c60', '--cover-end': '#472b3d', '--color-ivory': '#FFF4EE', '--color-gold': '#B99049' },
};

function Hindi({ text }: { text: string }) {
  return <span lang="hi" className="mt-3 block font-hindi text-sm font-normal not-italic leading-7 tracking-normal">{hindi[text] || text}</span>;
}

const events = [
  { name: 'Ring Ceremony', day: '25', month: 'FEB', fullDate: 'Thursday, 25 Feb 2027', time: '6:00 PM', venue: 'The Lotus Terrace', note: 'A promise, a sparkle, a beginning', attire: 'Pastel occasion wear & a little sparkle', color: '#E8CCD2', iconType: 'ring' },
  { name: 'Haldi', day: '26', month: 'FEB', fullDate: 'Friday, 26 Feb 2027', time: '10:00 AM', venue: 'The Marigold Courtyard', note: 'A little sunshine, a lot of love', attire: 'Sunshine yellows & easy festive wear', color: '#EED795', iconType: 'haldi' },
  { name: 'Mehendi', day: '26', month: 'FEB', fullDate: 'Friday, 26 Feb 2027', time: '4:00 PM', venue: 'The Garden Pavilion', note: 'Love, written in henna', attire: 'Garden greens & playful florals', color: '#D7DFCA', iconType: 'mehendi' },
  { name: 'Sangeet', day: '26', month: 'FEB', fullDate: 'Friday, 26 Feb 2027', time: '7:00 PM', venue: 'The Peacock Ballroom', note: 'An evening of song & celebration', attire: 'Jewel tones & your dancing shoes', color: '#E7CCCA', iconType: 'sangeet' },
  { name: 'Vivaah', day: '27', month: 'FEB', fullDate: 'Saturday, 27 Feb 2027', time: '4:30 PM', venue: 'The Royal Courtyard', note: 'Seven promises. One forever.', attire: 'Royal Indian attire · Pheras at golden hour', color: '#C5D9D6', iconType: 'vivaah' },
  { name: 'Reception', day: '27', month: 'FEB', fullDate: 'Saturday, 27 Feb 2027', time: '7:30 PM', venue: 'The Palace Lawns', note: 'To new beginnings, together', attire: 'Champagne accents & evening elegance', color: '#E4D8BA', iconType: 'reception' },
];

const wedding = new Date('2027-02-27T16:30:00+05:30');
const mapLink = 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur';
const button = 'inline-flex min-h-11 items-center justify-center gap-3 border border-[#C9A24B] px-6 py-3 text-xs font-medium tracking-[0.13em] uppercase transition hover:bg-[#C9A24B] hover:text-[#0E4D4F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-4';

function ActionIcon({ kind }: { kind: 'pin' | 'calendar' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 shrink-0" aria-hidden="true">{kind === 'pin' ? <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1114 0Z" /><circle cx="12" cy="10" r="2.5" /></> : <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v5M17 3v5M3 11h18M7 15h3M14 15h3" /></>}</svg>;
}

function Lotus({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={`h-8 w-8 text-gold drop-shadow-sm ${className}`}>
    <path d="M50 20 C45 35 25 45 20 60 C15 75 30 85 50 85 C70 85 85 75 80 60 C75 45 55 35 50 20 Z" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M50 30 C45 42 35 50 30 62 C26 74 38 82 50 82 C62 82 74 74 70 62 C65 50 55 42 50 30 Z" fill="currentColor" fillOpacity=".4" stroke="currentColor" strokeWidth="1.2" />
    <path d="M50 40 C47 48 42 55 40 65 C38 72 45 78 50 78 C55 78 62 72 60 65 C58 55 53 48 50 40 Z" fill="currentColor" fillOpacity=".7" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="55" r="3" fill="#FFF" />
  </svg>;
}

function Peacock({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={`h-12 w-12 text-gold ${className}`}>
    <path d="M50 15 C35 25 25 45 30 65 C35 85 65 85 70 65 C75 45 65 25 50 15 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity=".15" />
    <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity=".3" />
    <path d="M48 20 C48 10 52 10 52 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="50" cy="9" r="2.5" fill="currentColor" />
    <path d="M40 70 Q50 90 60 70" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>;
}

function Booklet() {
  const [page, setPage] = useState(0);
  const notes = [
    { title: 'A sacred beginning', subtitle: 'The journey starts here', text: 'With the blessings of our elders and the universe, Aarav and Meera invite you to join them on their most auspicious day.', detail: 'Preserving tradition, crafting elegance.' },
    { title: 'With love, our families', subtitle: 'Two families, one union', text: 'Sunita & Rajesh Sharma along with Kavita & Vikram Kapoor warmly invite you to celebrate this joyous bond.', detail: 'A union of hearts and heritage.' },
    { title: 'Three days of togetherness', subtitle: 'Ceremonies & Celebrations', text: 'Six heartfelt ceremonies across three golden days in Jaipur, culminating in sacred pheras at golden hour.', detail: 'Jaipur, Rajasthan · 2027' },
    { title: 'A note from our hearts', subtitle: 'Forever starts now', text: 'We cannot wait to share the laughter, the rituals, and the lifelong memories with you by our side.', detail: 'Aarav & Meera' },
  ];
  return <section className="my-8 bg-[radial-gradient(ellipse_at_top,#2a6a61,#0e4d4f_70%)] px-6 py-20 text-ivory">
    <div className="text-center">
      <Peacock className="mx-auto mb-4" />
      <p className="text-xs uppercase tracking-[0.25em] text-[#E3D3AE]">The Keepsake Booklet</p>
      <h2 className="mt-3 font-serif text-3xl italic">A journey of love</h2>
    </div>
    <div className="relative mx-auto mt-10 max-w-sm rounded-2xl border-2 border-gold/70 bg-ivory p-6 text-charcoal shadow-2xl">
      <div className="absolute inset-2 rounded-xl border border-gold/30 pointer-events-none" />
      <div className="min-h-[220px] flex flex-col justify-between text-center">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#937532] block">Chapter 0{page + 1} of 04</span>
          <h3 className="mt-2 font-serif text-2xl text-teal">{notes[page].title}</h3>
          <p className="mt-1 text-xs italic text-stone-600">{notes[page].subtitle}</p>
          <div className="my-4 flex items-center justify-center gap-2"><span className="h-px w-10 bg-gold/50" /><span>❧</span><span className="h-px w-10 bg-gold/50" /></div>
          <p className="text-sm leading-relaxed text-stone-700">{notes[page].text}</p>
        </div>
        <p className="mt-4 font-serif text-sm italic text-teal">{notes[page].detail}</p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-gold/30 pt-4">
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="text-xs font-semibold text-teal disabled:opacity-30">← Previous</button>
        <span className="text-xs text-stone-500">{page + 1} / {notes.length}</span>
        <button onClick={() => setPage((page + 1) % notes.length)} className="text-xs font-semibold text-teal">{page === 3 ? 'Read again ↺' : 'Pull String →'}</button>
      </div>
    </div>
  </section>;
}

function RoyalFrame() {
  return <svg viewBox="0 0 340 540" preserveAspectRatio="none" className="pointer-events-none absolute inset-3 h-[calc(100%-24px)] w-[calc(100%-24px)] text-gold" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M12 528V133Q12 80 60 80Q60 43 111 43Q138 43 170 10Q202 43 229 43Q280 43 280 80Q328 80 328 133V528Z" />
    <path d="M20 520V137Q20 88 68 88Q68 51 114 51Q140 51 170 21Q200 51 226 51Q272 51 272 88Q320 88 320 137V520Z" strokeOpacity=".4" />
    {[32, 308].map(x => <g key={x}><path d={`M${x} 480q-16 14 0 29q16-15 0-29ZM${x} 160v290`} strokeOpacity=".55" /><circle cx={x} cy="468" r="3" /></g>)}
    <path d="M125 510H215M150 503L170 510L190 503M150 517L170 510L190 517" />
  </svg>;
}

function PaperTexture() {
  return <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full mix-blend-multiply" aria-hidden="true"><filter id="paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope=".065" /></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#paper-grain)" /></svg>;
}

function Feather({ className = '', small = false }: { className?: string; small?: boolean }) {
  const id = useId();
  return <svg viewBox="0 0 160 190" fill="none" aria-hidden="true" className={`${small ? 'h-14 w-12' : 'h-36 w-28'} shrink-0 drop-shadow-[3px_5px_3px_#001e2550] ${className}`}>
    <defs><linearGradient id={id} x1="0" x2="1" y2="1"><stop stopColor="#7dc8a2" /><stop offset=".35" stopColor="#217e74" /><stop offset=".65" stopColor="#124956" /><stop offset="1" stopColor="#77b58c" /></linearGradient></defs>
    <path d="M78 150C62 120 14 101 28 49C43-5 105-9 123 45C145 102 90 132 78 150Z" fill={`url(#${id})`} stroke="#baad61" strokeWidth=".7" />
    {Array.from({ length: 15 }, (_, i) => <path key={i} d={`M78 ${150 - i * 8} Q${7 + i * 2} ${110 - i * 7} ${29 + i * 3} ${43 - i} M78 ${150 - i * 8} Q${153 - i * 2} ${110 - i * 7} ${123 - i * 3} ${43 - i}`} stroke={i % 2 ? '#83b68d' : '#c6b76e'} strokeWidth=".8" />)}
    <ellipse cx="77" cy="64" rx="26" ry="35" fill="#a9b86b" stroke="#ebcb83" /><ellipse cx="77" cy="63" rx="20" ry="28" fill="#2bc0b4" /><path d="M77 42C49 62 63 84 77 86C95 83 101 61 77 42Z" fill="#284781" stroke="#68b7c0" /><ellipse cx="77" cy="66" rx="8" ry="13" fill="#101f43" /><ellipse cx="73" cy="59" rx="3" ry="5" fill="#99d7d0" /><path d="M78 86Q72 140 83 185" stroke="#e6c47d" strokeWidth="2" />
  </svg>;
}

function Ornament() {
  return <div className="flex items-center justify-center gap-4 text-gold" aria-hidden="true"><span className="h-px w-14 bg-gold/50" /><span className="text-lg">❧</span><span className="h-px w-14 bg-gold/50" /></div>;
}

function ShriGanesh() {
  const id = useId();
  return <svg viewBox="0 0 240 250" role="img" aria-label="Shri Ganesh seated on a lotus" className="h-56 w-52 shrink-0 drop-shadow-[0_8px_9px_#8e6b2730]">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0d695" /><stop offset=".45" stopColor="#c19a45" /><stop offset="1" stopColor="#8a6122" /></linearGradient></defs>
    <circle cx="120" cy="110" r="86" fill="#C9A24B" fillOpacity=".08" stroke="#C9A24B" strokeWidth=".7" />
    <circle cx="120" cy="110" r="76" fill="none" stroke="#C9A24B" strokeDasharray="1 6" />
    <g fill={`url(#${id})`} stroke="#98732d" strokeWidth=".7">
      <path d="M92 80Q45 52 51 104Q53 143 92 121ZM148 80Q195 52 189 104Q187 143 148 121Z" />
      <path d="M91 78Q88 45 120 44Q152 45 149 78L142 116Q136 131 124 133L122 157Q122 174 138 168Q153 160 143 151Q161 153 157 169Q151 187 130 183Q102 181 105 157L109 126Q92 119 91 78Z" />
      <path d="M91 66L86 37L105 45L120 19L135 45L154 37L149 66Z" />
      <path d="M100 136Q71 139 70 168L79 190Q48 184 44 204Q63 227 106 206Q120 222 134 206Q177 227 196 204Q192 184 161 190L170 167Q165 141 145 136L149 184Q119 198 91 184Z" />
      <path d="M77 146Q55 135 47 155L41 179Q47 188 54 181L63 164L73 174M163 146Q185 135 193 155L199 179Q193 188 186 181L177 164L167 174" />
    </g>
  </svg>;
}

function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="mb-8 text-center"><p className="text-xs uppercase tracking-[0.24em] text-teal">{eyebrow}</p><h2 className="mt-4 font-serif text-4xl text-teal">{title}<Hindi text={title} /></h2>{text && <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-stone-600">{text}</p>}</div>;
}

// ─── 1. INTERACTIVE PETAL DATE REVEAL HOOK (Screenshot 6) ───
function PetalDateReveal({ weddingDate = '2027-02-27', onAddCalendar }: { weddingDate?: string; onAddCalendar: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);

  // 36 scattered petals in realistic pastel tones (rose, blush, coral, marigold, cream)
  const [petals, setPetals] = useState(() => {
    const palette = ['#E29393', '#EBABAB', '#F4C2BE', '#EDBB99', '#F9E4D4', '#E6C280', '#D4A373', '#F28482'];
    return Array.from({ length: 38 }, (_, i) => ({
      id: i,
      x: (i % 6) * 18 - 45 + (Math.random() * 22 - 11),
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
      if (next >= 10 && !revealed) {
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
    const t = setInterval(() => {
      const d = new Date(weddingDate + 'T16:30:00+05:30').getTime() - Date.now();
      setDiff(Math.max(0, d));
    }, 1000);
    return () => clearInterval(t);
  }, [weddingDate]);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <section className="relative my-8 overflow-hidden bg-gradient-to-b from-ivory via-[#fbf5e9] to-ivory px-4 py-16 text-center">
      <Peacock className="mx-auto text-gold mb-3" />
      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-teal italic mb-2">
        Move the petals to reveal the Grand Date!
      </h3>
      <p className="font-hindi text-sm text-teal mb-6">इस शुभ तिथि को याद रखिए</p>

      <div className="relative min-h-[320px] max-w-md mx-auto flex items-center justify-center p-4">
        {/* Underlying Revealed Date Card */}
        <div
          className={`transition-all duration-700 w-full rounded-3xl border-2 border-gold/70 bg-[#fffdf7] p-7 shadow-2xl text-center ${
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
          <p className="font-hindi text-sm text-teal mb-2">शुभ विवाह मुहूर्त · गोधूलि वेला</p>
          <p className="text-xs text-stone-600 mb-6">
            Pheras at 4:30 PM Onwards · The Royal Courtyard, Jaipur
          </p>

          {/* Live Auspicious Countdown Grid */}
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-6">
            {[
              { val: days, lbl: 'Days' },
              { val: hours, lbl: 'Hours' },
              { val: minutes, lbl: 'Mins' },
              { val: seconds, lbl: 'Secs' },
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
            <ActionIcon kind="calendar" /> Add to Calendar (.ics)
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
              transition={{ duration: 0.85, ease: 'easeOut' }}
              onMouseEnter={() => handleClear(p.id)}
              onTouchMove={() => handleClear(p.id)}
              className="absolute w-11 h-11 select-none pointer-events-auto cursor-pointer"
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

// ─── 2. CEREMONIES STACKED DECK WITH "SWIPE THE CARD ASIDE" (Screenshot 5) ───
function CeremoniesStackedDeck() {
  const [topIndex, setTopIndex] = useState(0);

  const nextCard = () => {
    setTopIndex(prev => (prev + 1) % events.length);
  };

  const activeCeremony = events[topIndex];
  const nextCeremony1 = events[(topIndex + 1) % events.length];
  const nextCeremony2 = events[(topIndex + 2) % events.length];

  return (
    <section id="celebrations" className="my-8 scroll-mt-16 bg-ivory py-16 px-4">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[#96752d]">A sacred journey of six chapters</p>
        <h2 className="mt-2 font-serif text-4xl text-teal">Ceremonies<Hindi text="मांगलिक कार्यक्रम" /></h2>
      </div>

      {/* Stack Container */}
      <div className="relative mx-auto max-w-sm h-[480px] flex items-center justify-center select-none">
        {/* Layer 3 (Back) */}
        <div
          className="absolute inset-x-4 top-2 h-[420px] rounded-3xl border border-gold/30 bg-[#f4ebda] shadow-md transition-all duration-300"
          style={{ transform: 'rotate(-4deg) translateY(-14px) scale(0.92)', opacity: 0.6 }}
        />

        {/* Layer 2 (Middle) */}
        <div
          className="absolute inset-x-2 top-4 h-[430px] rounded-3xl border border-gold/40 bg-[#fbf5e7] shadow-lg transition-all duration-300"
          style={{ transform: 'rotate(3deg) translateY(-7px) scale(0.96)', opacity: 0.85 }}
        >
          <div className="p-6 text-center opacity-40">
            <span className="text-xs uppercase tracking-widest text-teal">{nextCeremony1.name}</span>
          </div>
        </div>

        {/* Layer 1 (Front Active Card) */}
        <motion.div
          key={topIndex}
          initial={{ x: -40, rotate: -3, opacity: 0.8, scale: 0.95 }}
          animate={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
          exit={{ x: 300, rotate: 20, opacity: 0 }}
          transition={{ duration: 0.45 }}
          onClick={nextCard}
          className="relative w-full h-[450px] rounded-3xl border-2 border-gold/70 bg-[#fffdf5] p-7 shadow-2xl flex flex-col justify-between text-center cursor-pointer overflow-hidden z-20"
        >
          {/* Inner Golden Border */}
          <div className="absolute inset-2.5 rounded-[20px] border border-gold/30 pointer-events-none" />

          {/* Top Info */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#96752d] block">
              Chapter 0{topIndex + 1} of 0{events.length}
            </span>
            <h3 className="mt-3 font-serif text-3xl font-bold text-teal">
              {activeCeremony.name}
            </h3>
            <Hindi text={activeCeremony.name} />

            <div className="my-3 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-gold/50" />
              <span className="text-gold text-sm">❧</span>
              <span className="h-px w-8 bg-gold/50" />
            </div>

            <p className="font-serif text-lg font-semibold text-teal">
              {activeCeremony.fullDate}
            </p>
            <p className="text-sm font-medium text-stone-600 mt-1">
              {activeCeremony.time} IST
            </p>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-600">
              <MapPin size={14} className="text-[#96752d]" />
              <span>{activeCeremony.venue}, Jaipur</span>
            </div>

            <p className="mt-4 text-xs italic text-stone-600 max-w-xs mx-auto">
              "{activeCeremony.note}"
            </p>
          </div>

          {/* Bottom Illustration & Action */}
          <div className="relative pt-4 border-t border-gold/30 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#96752d] block">Dress code</span>
              <span className="text-xs font-medium text-teal">{activeCeremony.attire}</span>
            </div>
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-xs font-semibold text-teal underline flex items-center gap-1"
            >
              Directions ↗
            </a>
          </div>
        </motion.div>
      </div>

      {/* Swipe the card aside helper prompt */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={nextCard}
          className="inline-flex items-center gap-2 text-xs font-serif italic text-teal hover:text-gold transition-colors"
        >
          <span>Swipe the card aside</span>
          <span className="inline-block animate-pulse">👉</span>
        </button>

        {/* Dots progress indicator */}
        <div className="mt-3 flex justify-center gap-1.5">
          {events.map((ev, i) => (
            <button
              key={ev.name}
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

// ─── 3. CLOTHESLINE HANGING POLAROID PHOTO GALLERY (Screenshots 4 & 7) ───
function HangingPolaroidGallery() {
  const polaroids = [
    { tag: '#howitstarted', caption: 'One hello. A thousand possibilities.' },
    { tag: '#adventures', caption: 'Exploring the world, hand in hand.' },
    { isNote: true, quote: 'Friendship grew into something more, and we realized life’s best moments were the ones we shared together.', tag: '#thelittlethings' },
    { tag: '#foreverstarts', caption: 'In every chapter, I would choose you.' },
    { tag: '#familymoments', caption: 'Surrounded by the warmth of those we love.' },
  ];

  return (
    <section className="relative my-8 overflow-hidden bg-gradient-to-b from-[#FAF4EB] via-[#FAF6F0] to-[#FAF4EB] py-16 px-4">
      <div className="text-center mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#96752d]">A love story in little frames</p>
        <h2 className="mt-2 font-serif text-4xl text-teal">Glimpses of us<Hindi text="हमारी कुछ झलकियाँ" /></h2>
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
        {polaroids.map((item, idx) => (
          <div key={idx} className="snap-center shrink-0 w-64 flex flex-col items-center">
            {/* Hanging String */}
            <div className="w-px h-7 bg-[#9e7a4b] shadow-xs mb-[-2px] z-10" />

            {/* Frame Content */}
            {item.isNote ? (
              <div className="w-full bg-[#FAF4EB] border-2 border-gold/60 rounded-xl p-6 shadow-xl flex flex-col justify-between text-center min-h-[300px]">
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
            ) : (
              <div className="w-full bg-white rounded-xl p-3 pb-4 shadow-xl border border-stone-200 flex flex-col items-center min-h-[300px]">
                <div className="w-full aspect-[4/5] bg-[#EFECE6] rounded-lg flex flex-col items-center justify-center text-stone-400 text-xs italic mb-3 p-4 text-center border border-dashed border-stone-300">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold mb-2 shadow-xs">
                    <Heart size={14} />
                  </div>
                  <span>Your photo here</span>
                </div>
                <span className="font-serif text-sm font-bold text-[#96752d] italic">
                  {item.tag}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Swipe prompt pill */}
      <div className="text-center mt-2">
        <span className="inline-block rounded-full bg-white/90 border border-gold/40 px-5 py-1 text-[11px] font-semibold text-teal tracking-widest uppercase shadow-2xs">
          &lt;&lt;&lt; Swipe &gt;&gt;&gt;
        </span>
      </div>
    </section>
  );
}

// ─── 4. "YOUR PRESENCE MATTERS" BALCONY-STYLE RSVP SECTION (Screenshots 1, 2, 3) ───
function YourPresenceMattersRSVP({ guestDefault = '' }: { guestDefault?: string }) {
  const [name, setName] = useState(guestDefault || '');
  const [mobile, setMobile] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [eventSchedule, setEventSchedule] = useState<Record<string, string>>({
    'Ring Ceremony': 'yes',
    'Haldi': 'yes',
    'Mehendi': 'yes',
    'Sangeet': 'yes',
    'Vivaah': 'yes',
    'Reception': 'yes',
  });
  const [wishes, setWishes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAttendance = (eventName: string, choice: string) => {
    setEventSchedule(prev => ({ ...prev, [eventName]: choice }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;
    try {
      localStorage.setItem('aahvaaan_rsvp_' + mobile.replace(/[^0-9]/g, ''), JSON.stringify({
        name,
        mobile,
        guestCount,
        eventSchedule,
        wishes,
        timestamp: new Date().toISOString(),
      }));
    } catch {
      // fallback
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="rsvp" className="my-8 scroll-mt-16 bg-ivory px-6 py-16 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl border-2 border-gold/70 bg-[#fffdf5] shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-teal text-gold flex items-center justify-center mx-auto mb-4">
            <Check size={24} />
          </div>
          <h3 className="font-serif text-3xl font-bold text-teal mb-2">Response Lovingly Noted!</h3>
          <Hindi text="आपका उत्तर सप्रेम स्वीकार है" />
          <p className="text-sm text-stone-600 mt-4 leading-relaxed">
            Thank you, {name}! We have recorded your attendance. We cannot wait to celebrate with you in Jaipur!
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 text-xs text-[#96752d] font-semibold underline"
          >
            Update response
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="my-8 scroll-mt-16 bg-ivory px-4 py-16">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal">
            Your Presence Matters
          </h2>
          <Hindi text="आपकी उपस्थिति हमारे लिए अनमोल है" />
          <p className="mt-2 text-xs sm:text-sm text-stone-600">
            Let us know so we can make the arrangements just right.
          </p>
        </div>

        {/* Card Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border-2 border-gold/60 bg-[#fffdf5] p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Top Inputs: Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold/40 bg-white text-xs sm:text-sm text-teal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold/40 bg-white text-xs sm:text-sm text-teal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1 pl-1">
                Reply again from this number any time to update your answer.
              </p>
            </div>
          </div>

          {/* Stepper: How many of you are coming? */}
          <div className="bg-[#FAF7F2] border border-gold/30 rounded-2xl p-5 text-center">
            <label className="block text-xs sm:text-sm font-bold text-teal mb-3">
              How many of you are coming?
            </label>
            <div className="inline-flex items-center gap-4 bg-white border border-gold/40 rounded-full px-5 py-1.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-7 h-7 rounded-full text-stone-600 hover:bg-[#FAF7F2] flex items-center justify-center transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="font-serif text-lg font-bold text-teal w-6 text-center tabular-nums">
                {guestCount}
              </span>
              <button
                type="button"
                onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                className="w-7 h-7 rounded-full text-stone-600 hover:bg-[#FAF7F2] flex items-center justify-center transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">
              Counts for every event you say Yes or Maybe to, below. Up to 10 people.
            </p>
          </div>

          {/* Event Schedule Grid */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-[#96752d]" />
              <div>
                <h4 className="font-bold text-sm text-teal leading-tight">Event Schedule</h4>
                <p className="text-[11px] text-stone-500">Let us know which events you'll be joining.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {events.map((ev, i) => {
                const current = eventSchedule[ev.name] || 'yes';
                return (
                  <div key={i} className="p-3.5 rounded-2xl border border-gold/30 bg-white shadow-2xs">
                    <div className="mb-2">
                      <span className="font-bold text-xs sm:text-sm text-teal block">{ev.name}</span>
                      <span className="text-[11px] text-[#96752d] font-medium">{ev.day} Feb 2027</span>
                    </div>

                    {/* Radio Options: Yes / Maybe / No */}
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {['Yes', 'Maybe', 'No'].map(opt => {
                        const val = opt.toLowerCase();
                        const isSelected = current === val;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleAttendance(ev.name, val)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-teal text-ivory border-teal shadow-xs'
                                : 'bg-[#FAF7F2] text-stone-600 border-gold/30 hover:border-gold'
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
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-stone-400">
                <Mail size={16} />
              </span>
              <textarea
                rows={2}
                value={wishes}
                onChange={e => setWishes(e.target.value)}
                placeholder="Leave the couple a wish (optional)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold/40 bg-white text-xs sm:text-sm text-teal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-teal via-[#135d5f] to-[#1c7870] hover:from-[#0a383a] hover:to-teal text-ivory font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>♥</span>
            <span>Send RSVP</span>
          </button>

          <p className="text-[11px] text-stone-500 text-center mt-2">
            Preview - your guests will be able to send this once your invitation is live.
          </p>

          {/* Footer Branding */}
          <div className="text-center pt-6 border-t border-gold/30 mt-6">
            <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">
              Crafted with love by
            </p>
            <span className="font-serif text-lg font-bold text-teal tracking-tight">
              Aahvaaan
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}

function CoupleWelcome({ guest, onContinue }: { guest: string; onContinue: () => void }) {
  const [imageError, setImageError] = useState(false);
  return <div className="relative mx-auto max-w-lg overflow-hidden rounded-t-[170px] border border-gold/60 bg-[radial-gradient(ellipse_at_top,#fffdf5,#f4ead5)] px-6 pb-9 pt-14 text-center shadow-[0_15px_45px_#0e4d4f20]">
    <div className="pointer-events-none absolute inset-2 rounded-t-[165px] border border-gold/30" />
    <p className="relative font-hindi text-xl text-teal">पधारो सा</p>
    <p className="relative mt-3 text-xs uppercase tracking-[0.2em] text-teal">A royal welcome, from the two of us</p>
    <div className="relative mx-auto mt-4 max-w-[330px]">
      <div className="pointer-events-none absolute inset-x-8 inset-y-12 rounded-full bg-gold/15 blur-2xl" />
      {imageError ? <svg viewBox="0 0 300 300" role="img" aria-label="Bride and groom welcoming you with namaste" className="relative h-auto w-full">
        <ellipse cx="150" cy="277" rx="100" ry="12" fill="#d8c398" />
        <path d="M58 265L74 124Q100 105 127 124L144 265Z" fill="#eee0bf" stroke="#C9A24B" /><path d="M155 265L169 133Q195 113 220 133L252 265Z" fill="#0E4D4F" stroke="#C9A24B" />
        <circle cx="101" cy="86" r="30" fill="#c38a61" /><circle cx="196" cy="93" r="28" fill="#c38a61" />
        <path d="M70 78Q69 33 110 49L135 75Z" fill="#f2e3bd" stroke="#C9A24B" /><path d="M166 100Q155 45 196 56Q239 58 229 154L216 92Q190 63 166 100Z" fill="#E8B4B8" stroke="#C9A24B" />
        <path d="M92 87h2M109 87h2M185 94h2M201 94h2M94 101q7 7 14 0M187 107q7 7 14 0" stroke="#382c29" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M75 151L101 179L125 151M172 156L195 184L218 156" stroke="#c38a61" strokeWidth="12" fill="none" /><path d="M100 179v-30M195 184v-30" stroke="#c38a61" strokeWidth="10" strokeLinecap="round" />
        <path d="M82 125v130M173 139l56 119" stroke="#C9A24B" strokeWidth="6" />
      </svg> : <img src="/images/mor-pankh-couple.png" alt="Bride and groom in ivory, emerald and gold namaste pose" onError={() => setImageError(true)} className="relative h-auto w-full object-contain drop-shadow-[0_12px_24px_#0e4d4f35]" />}
    </div>
    <div className="relative mt-7 space-y-4">
      <h2 className="font-serif text-3xl italic text-teal">Dear {guest || 'our loved ones'},<Hindi text="प्रिय अतिथि, आपका हार्दिक स्वागत है" /></h2>
      <p className="mx-auto max-w-sm text-sm leading-7 text-stone-600">We are overjoyed to invite you to celebrate our union. Having you with us to share these moments means the world to our hearts and families.</p>
      <div className="pt-2"><button onClick={onContinue} className={`${button} rounded-full bg-teal text-ivory`}>Step into our story ↓</button></div>
    </div>
  </div>;
}

// ─── MASTER MOR PANKH TEMPLATE COMPONENT ───
export default function MorPankhInvitation({ template = {}, content = {}, guestName: propGuestName, rsvpComponent = null }: any = {}) {
  const [opened, setOpened] = useState(false);
  const [guest, setGuest] = useState(propGuestName || content?.guestName || 'Mr. Joshi and Family');
  const [theme, setTheme] = useState<keyof typeof themes>('Ivory');
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

  function addCalendar() {
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Aahvaaan//Mor Pankh//EN\nBEGIN:VEVENT\nSUMMARY:Aarav & Meera Wedding\nDTSTART:20270227T110000Z\nDTEND:20270227T180000Z\nLOCATION:The Leela Palace, Jaipur\nDESCRIPTION:Seven promises. One forever.\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aarav-meera-wedding.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={themes[theme] as CSSProperties} className="relative min-h-screen bg-[var(--canvas)] font-body text-charcoal transition-colors duration-500">
      <div className="relative isolate mx-auto max-w-[450px] overflow-hidden bg-[var(--canvas)] shadow-[0_30px_100px_#001c1c80] transition-colors duration-500 md:rounded-[44px] md:border-[9px] md:border-[#142f2e] md:ring-1 md:ring-[#b7a16a]">
        <audio ref={audioRef} src="/templates/mor-pankh/media/music.mp3" loop preload="auto" />
        <PaperTexture />

        {/* Brand Header */}
        <header className="relative z-30 flex min-h-24 items-center justify-between border-b border-gold/30 bg-ivory px-6">
          <a href="#" className="text-teal" aria-label="Aahvaaan home">
            <span className="font-serif text-2xl tracking-[0.06em]">aahvaaan<span className="text-gold">.</span></span>
            <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em]">by Vow & Vision</span>
          </a>
          <span className="text-right text-xs uppercase leading-5 tracking-[0.15em] text-teal">
            Mor Pankh<br />
            <span className="tracking-wider text-[10px] text-stone-500">№ 01 Royal Edition</span>
          </span>
        </header>

        <main>
          {/* Arch Gate Cover Section with Wax Seal */}
          <section className="relative bg-ivory px-5 pb-12 pt-9 text-center">
            <p className="font-hindi text-lg text-teal">॥ श्री गणेशाय नमः ॥</p>
            <p className="mb-6 mt-3 text-xs uppercase tracking-[0.23em] text-teal">An auspicious beginning. An eternal bond.</p>
            
            <div className="relative mx-auto min-h-[640px] max-w-[430px] overflow-hidden rounded-t-[210px] border-2 border-gold bg-[radial-gradient(ellipse_at_top,var(--cover-start),var(--cover-end))] shadow-[0_18px_35px_-10px_#0e4d4f60] [perspective:1100px]">
              {/* Shri Ganesh inside revealed view */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ivory px-7 pb-14">
                <ShriGanesh />
                <p lang="hi" className="mt-6 font-hindi text-xl leading-9 text-teal">॥ श्री गणेशाय नमः ॥</p>
                <div className="my-5"><Ornament /></div>
                <p className="font-serif text-2xl italic text-teal">With Shri Ganesh ji’s blessings</p>
                <p lang="hi" className="mt-3 font-hindi text-sm leading-7 text-teal">मंगलमय हो यह शुभ आरंभ</p>
              </div>

              {/* Two 3D Arch Gates */}
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
                    <div className="absolute inset-x-8 top-[225px] text-center">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#E3D3AE]">Together, a beautiful forever</p>
                      <h1 className="mt-5 font-serif text-5xl text-ivory">Aarav <span className="font-serif italic text-gold">&</span> Meera<Hindi text="आरव एवं मीरा" /></h1>
                      <p className="mt-5 text-xs uppercase tracking-[0.2em] text-[#E3D3AE]">27 February 2027 · Jaipur</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Wax Seal Trigger */}
              {!opened && (
                <button
                  onClick={openInvitation}
                  aria-label="Break the wax seal and open the invitation"
                  className="absolute left-1/2 top-[420px] z-10 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-[45%_55%_49%_51%/54%_45%_55%_46%] border-4 border-[#b78b43] bg-[radial-gradient(circle_at_30%_25%,#f1d99c,#c29b51_55%,#8f692c)] shadow-[0_7px_16px_#001c1c80] transition hover:scale-105 active:scale-95"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#806026] font-serif text-3xl italic text-[#4c371c]">A&M</span>
                </button>
              )}

              {/* Open CTA Button */}
              <button
                onClick={openInvitation}
                disabled={opened}
                className="absolute bottom-8 left-1/2 z-10 min-h-12 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#E5CE96] bg-[linear-gradient(120deg,#e6d09a,#bd9446,#e6d09a)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#173d35] shadow-lg transition hover:scale-105 active:scale-95"
              >
                {opened ? 'Invitation Opened' : 'Tap Wax Seal to Open'}
              </button>
            </div>
          </section>

          {/* Invitation Content Unfolded */}
          <div id="invitation-story" hidden={!opened}>
            {/* Couple Namaste Royal Welcome */}
            <section ref={welcome} tabIndex={-1} className="px-5 py-8 focus:outline-none">
              {opened && (
                <CoupleWelcome
                  guest={guest}
                  onContinue={() => {
                    greeting.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                />
              )}
            </section>

            {/* Quick Navigation Sticky Bar */}
            <nav className="sticky top-0 z-30 flex justify-center gap-6 border-y border-gold/30 bg-ivory/95 px-4 backdrop-blur py-2.5">
              {[
                ['Date', '#date-reveal'],
                ['Ceremonies', '#celebrations'],
                ['Memories', '#glimpses'],
                ['RSVP', '#rsvp'],
              ].map(([label, href]) => (
                <a key={href} href={href} className="text-xs uppercase tracking-widest text-teal hover:underline font-semibold">
                  {label}
                </a>
              ))}
            </nav>

            {/* Formal Invitation Card */}
            <section ref={greeting} tabIndex={-1} className="relative mx-5 my-10 border border-gold/60 bg-ivory/95 px-6 py-10 text-center shadow-xl">
              <div className="pointer-events-none absolute inset-2 border border-gold/25" />
              <Feather small className="mx-auto mb-4 text-gold" />
              <p className="font-hindi text-lg text-teal">॥ श्री गणेशाय नमः ॥</p>
              <h2 className="mt-6 font-serif text-3xl italic text-teal">
                Dear {guest || 'our loved ones'},
                <Hindi text="प्रिय अतिथि, आपका हार्दिक स्वागत है" />
              </h2>
              <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-stone-600">
                Join us as we begin our forever, surrounded by the warmth and blessings of the people we cherish most.
              </p>
              <div className="my-6"><Ornament /></div>
              <p className="text-sm leading-7 text-stone-600">
                Sunita & Rajesh Sharma<br />
                <span className="font-serif text-xl italic text-teal">and</span><br />
                Kavita & Vikram Kapoor
              </p>
              <p className="mt-4 text-xs uppercase tracking-wider text-[#96752d]">request the pleasure of your company at the wedding of</p>
              <p className="mt-4 font-serif text-5xl text-teal">Aarav <span className="italic text-gold">&</span> Meera</p>
              <p className="mt-4 font-serif text-lg italic text-teal">Seven Sacred Vows · One Eternal Bond</p>
            </section>

            {/* Family Lineage Cards */}
            <section className="my-10 bg-ivory px-6 py-12">
              <Heading eyebrow="Rooted in love, blessed by family" title="Two families. One beautiful bond." />
              <div className="grid gap-6">
                {[
                  { side: "The groom’s family", surname: 'The Sharmas', names: 'Sunita & Rajesh Sharma', child: 'Beloved son, Aarav' },
                  { side: "The bride’s family", surname: 'The Kapoors', names: 'Kavita & Vikram Kapoor', child: 'Beloved daughter, Meera' },
                ].map(f => (
                  <article key={f.surname} className="rounded-2xl border border-gold/50 bg-[linear-gradient(145deg,#fffaf0,#eee4d1)] p-6 text-center shadow-md">
                    <Lotus className="mx-auto text-gold" />
                    <p className="mb-2 mt-3 text-xs uppercase tracking-[0.16em] text-stone-600">{f.side}</p>
                    <h3 className="font-serif text-2xl text-teal">{f.surname}<Hindi text={f.surname} /></h3>
                    <p className="mt-3 text-sm font-medium text-stone-700">{f.names}</p>
                    <p className="mt-1 text-xs italic text-stone-600">{f.child}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* 1. INTERACTIVE "MOVE THE PETALS TO REVEAL THE GRAND DATE" (Screenshot 6) */}
            <div id="date-reveal">
              <PetalDateReveal weddingDate="2027-02-27" onAddCalendar={addCalendar} />
            </div>

            {/* Keepsake Booklet with Flip String */}
            <Booklet />

            {/* 2. CEREMONIES STACKED DECK OF CARDS (Screenshot 5) */}
            <CeremoniesStackedDeck />

            {/* Venue Location Showcase */}
            <section id="venue" className="my-8 scroll-mt-16 bg-ivory px-6 py-16 text-center">
              <Peacock className="mx-auto text-gold" />
              <h2 className="mt-3 font-serif text-3xl italic text-teal">The Leela Palace Jaipur</h2>
              <p className="mt-2 text-xs uppercase tracking-widest text-[#96752d]">The Royal Destination</p>
              <p className="mx-auto mt-4 max-w-sm text-xs sm:text-sm text-stone-600 leading-relaxed">
                Delhi Highway, NH 11, Kukas, Jaipur, Rajasthan 302028
              </p>
              <div className="mt-6">
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`${button} rounded-full bg-teal text-ivory text-xs px-8 py-3`}
                >
                  <ActionIcon kind="pin" /> Open in Google Maps ↗
                </a>
              </div>
            </section>

            {/* 3. CLOTHESLINE HANGING POLAROID LOVE STORY GALLERY (Screenshots 4 & 7) */}
            <div id="glimpses">
              <HangingPolaroidGallery />
            </div>

            {/* 4. BALCONY-STYLE "YOUR PRESENCE MATTERS" RSVP FORM (Screenshots 1, 2, 3) */}
            {rsvpComponent ? (
              <div id="rsvp" className="my-8 scroll-mt-16 bg-ivory px-4 py-16">
                {rsvpComponent}
              </div>
            ) : (
              <YourPresenceMattersRSVP guestDefault={guest} />
            )}

            {/* Royal Mor Pankh Footer */}
            <footer className="bg-[radial-gradient(ellipse_at_top,#24655d,#0b3c3c)] px-6 py-14 text-center text-ivory">
              <Feather small className="mx-auto text-gold" />
              <p className="mt-3 font-serif text-2xl italic">The best part of our day will be having you there.</p>
              <p className="mb-4 mt-6 font-script text-5xl">Aarav & Meera</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#E3D3AE]">27.02.2027 · Jaipur</p>
              <div className="mx-auto my-8 h-px max-w-xs bg-gold/40" />
              <p className="text-xs text-[#E3D3AE]">
                Crafted with love by <span className="font-serif text-base text-ivory">Aahvaaan</span>
              </p>
              <p className="mt-1 text-[10px] tracking-widest text-[#E3D3AE]">MOR PANKH · BY VOW & VISION</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
