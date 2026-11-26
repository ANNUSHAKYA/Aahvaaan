import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

const hindi: Record<string, string> = {
  'A little note, just for you': 'आपके नाम एक प्यार भरा संदेश',
  'Let the festivities begin': 'आइए, उत्सव का शुभारंभ करें',
  'Glimpses of us': 'हमारी कुछ झलकियाँ',
  'Two families. One beautiful bond.': 'दो परिवार, एक सुंदर बंधन',
  'Save our date': 'इस शुभ तिथि को याद रखिए',
  'Will you join us?': 'क्या आप हमारे साथ होंगे?',
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
  { name: 'Ring Ceremony', day: '25', month: 'FEB', time: '6:00 PM', venue: 'The Lotus Terrace', note: 'A promise, a sparkle, a beginning', attire: 'Pastel occasion wear & a little sparkle', color: '#E8CCD2' },
  { name: 'Haldi', day: '26', month: 'FEB', time: '10:00 AM', venue: 'The Marigold Courtyard', note: 'A little sunshine, a lot of love', attire: 'Sunshine yellows & easy festive wear', color: '#EED795' },
  { name: 'Mehendi', day: '26', month: 'FEB', time: '4:00 PM', venue: 'The Garden Pavilion', note: 'Love, written in henna', attire: 'Garden greens & playful florals', color: '#D7DFCA' },
  { name: 'Sangeet', day: '26', month: 'FEB', time: '7:00 PM', venue: 'The Peacock Ballroom', note: 'An evening of song & celebration', attire: 'Jewel tones & your dancing shoes', color: '#E7CCCA' },
  { name: 'Vivaah', day: '27', month: 'FEB', time: '4:30 PM', venue: 'The Royal Courtyard', note: 'Seven promises. One forever.', attire: 'Royal Indian attire · Pheras at golden hour', color: '#C5D9D6' },
  { name: 'Reception', day: '27', month: 'FEB', time: '7:30 PM', venue: 'The Palace Lawns', note: 'To new beginnings, together', attire: 'Champagne accents & evening elegance', color: '#E4D8BA' },
];
const wedding = new Date('2027-02-27T16:30:00+05:30');
const mapLink = 'https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Jaipur';
const button = 'inline-flex min-h-11 items-center justify-center gap-3 border border-[#C9A24B] px-6 py-3 text-xs font-medium tracking-[0.13em] uppercase transition hover:bg-[#C9A24B] hover:text-[#0E4D4F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24B] focus-visible:ring-offset-4';

function ActionIcon({ kind }: { kind: 'pin' | 'calendar' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 shrink-0" aria-hidden="true">{kind === 'pin' ? <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1114 0Z" /><circle cx="12" cy="10" r="2.5" /></> : <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v5M17 3v5M3 11h18M7 15h3M14 15h3" /></>}</svg>;
}

function Lotus({ className = '' }: { className?: string }) {
  const id = useId();
  return <svg viewBox="0 0 150 110" aria-hidden="true" className={`h-20 w-28 shrink-0 drop-shadow-[0_5px_3px_#082d2e40] ${className}`}>
    <defs><linearGradient id={id} x2=".2" y2="1"><stop stopColor="#fff0df" /><stop offset=".45" stopColor="#ed9ab1" /><stop offset="1" stopColor="#a6356d" /></linearGradient></defs>
    <ellipse cx="43" cy="90" rx="37" ry="13" fill="#366b4e" transform="rotate(-10 43 90)" /><ellipse cx="106" cy="92" rx="36" ry="12" fill="#568661" /><path d="M12 95L67 84M89 92L134 93" stroke="#b8bd6b" strokeWidth=".8" />
    {[-55, -30, 0, 30, 55].map((a, i) => <path key={a} d="M75 87C37 63 53 28 75 8C96 29 111 64 75 87Z" transform={`rotate(${a} 75 87) scale(${i === 2 ? 1 : .9})`} fill={`url(#${id})`} stroke="#f5c3bd" strokeWidth="1" />)}
    <path d="M75 87Q42 67 49 50Q72 57 75 87Q78 57 101 50Q108 67 75 87" fill="#edb4bd" stroke="#ffe1ce" /><path d="M62 86Q75 57 88 86" fill="#e9bf68" />
  </svg>;
}

function Peacock({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 240 210" className={`h-40 w-48 shrink-0 drop-shadow-[0_7px_5px_#082d2e40] ${className}`} aria-hidden="true">
    {Array.from({ length: 11 }, (_, i) => <g key={i} transform={`rotate(${(i - 5) * 15} 120 164)`}><path d="M120 166Q72 62 120 7Q168 62 120 166" fill={i % 2 ? '#276955' : '#39816b'} stroke="#C9A24B" strokeWidth=".7" /><ellipse cx="120" cy="52" rx="12" ry="20" fill="#c4ab59" /><ellipse cx="120" cy="52" rx="8" ry="14" fill="#29a8a0" /><ellipse cx="120" cy="53" rx="5" ry="8" fill="#15396a" /><path d="M120 77v87" stroke="#d8ba67" strokeWidth=".6" /></g>)}
    <path d="M116 172Q92 148 114 118Q135 92 131 77Q126 68 118 75Q107 89 106 69Q108 50 125 56Q150 61 143 93Q135 119 146 140Q161 167 131 179Z" fill="#167a88" stroke="#d3b96b" /><path d="M119 141Q161 126 148 155Q137 177 120 167Z" fill="#175347" stroke="#C9A24B" /><path d="M118 177v21l-12 5M132 178v20l13 5M112 58L101 61L110 65M121 55l-4-14M126 55l2-15" stroke="#C9A24B" fill="none" /><circle cx="118" cy="62" r="2" fill="#fff6dd" />
  </svg>;
}

function Booklet() {
  const [page, setPage] = useState(0);
  const notes = [
    { title: 'A sacred beginning', text: 'With gratitude to Ganesh ji and the blessings of our elders, we invite you to the wedding of Aarav & Meera.', detail: 'श्री गणेशाय नमः' },
    { title: 'With love, our families', text: 'Sunita & Rajesh Sharma and Kavita & Vikram Kapoor request the pleasure of your company as their children begin a lifetime together.', detail: 'Two families. One beautiful bond.' },
    { title: 'Three days of togetherness', text: '25–27 February 2027 · From the first ring to the final dance, join us for six celebrations at The Leela Palace Jaipur.', detail: 'Jaipur, Rajasthan' },
    { title: 'A note from our hearts', text: 'Bring your blessings, your laughter, and your dancing shoes. The most precious part of our celebration will be having you there.', detail: 'With love, Aarav & Meera' },
  ];
  return <section className="my-8 bg-ivory px-6 py-20">
    <Heading eyebrow="The Mor Pankh keepsake" title="A little note, just for you" />
    <div className="relative mx-auto max-w-md border border-gold/60 bg-[#eee3cb] p-2 shadow-[8px_8px_0_#d5c49d,12px_12px_0_#e9ddc5,0_20px_35px_#082d2e20]">
      <div className="relative min-h-[420px] overflow-hidden border border-gold/50 bg-ivory px-8 pb-8 pt-12 text-center">
        <Feather small className="absolute -left-1 top-2 -rotate-45" /><Feather small className="absolute -right-1 top-2 rotate-45" />
        <div key={page} aria-live="polite" className="motion-safe:animate-[note_.6s_ease_both]"><Lotus className="mx-auto" /><p className="mt-3 text-xs uppercase tracking-[0.2em] text-teal">Note 0{page + 1} / 04</p><h3 className="mt-6 font-serif text-3xl text-teal">{notes[page].title}<Hindi text={notes[page].title} /></h3><p className="mt-7 text-sm leading-8 text-stone-600">{notes[page].text}</p><p className="mt-6 font-serif text-xl text-teal">{notes[page].detail}</p></div>
      </div>
    </div>
    <div className="mt-8 flex flex-col items-center"><div className="h-10 w-px bg-gold" aria-hidden="true" /><button onClick={() => setPage((page + 1) % notes.length)} className={`${button} rounded-full bg-teal text-ivory`}>{page === 3 ? 'Read the notes again' : 'Pull the string for the next note'} ↓</button><button disabled={page === 0} onClick={() => setPage(page - 1)} className="mt-3 min-h-11 px-5 text-sm text-teal underline decoration-gold underline-offset-4 disabled:invisible focus-visible:ring-2 focus-visible:ring-gold">Previous note</button></div>
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
  return <svg viewBox="0 0 240 250" role="img" aria-label="Shri Ganesh seated on a lotus, with an ornate gold crown and a curved trunk" className="h-56 w-52 shrink-0 drop-shadow-[0_8px_9px_#8e6b2730]">
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
    <g stroke="#0E4D4F" strokeWidth="2" strokeLinecap="round" fill="none"><path d="M98 94q7-6 13 0M130 94q7-6 13 0M116 78h8M120 73v12" /></g>
    <path d="M100 109L95 125L108 119M141 109L146 123L134 119" fill="#FBF5E9" />
    <path d="M93 64h54M102 54h36" stroke="#fff0be" strokeWidth="1.5" />
    <circle cx="120" cy="45" r="4" fill="#0E4D4F" />
    <path d="M120 231Q75 238 61 214Q98 208 120 231Q142 208 179 214Q165 238 120 231ZM120 231Q94 215 120 197Q146 215 120 231Z" fill="#0E4D4F" stroke="#C9A24B" />
    <path d="M76 239h88" stroke="#C9A24B" />
  </svg>;
}

function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="mb-12 text-center motion-safe:animate-[rise_1s_ease_both] motion-safe:[animation-timeline:view()] motion-safe:[animation-range:entry_0%_entry_100%]"><p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-teal">{eyebrow}</p><h2 className="font-serif text-4xl leading-tight text-teal">{title}<Hindi text={title} /></h2>{text && <p className="mx-auto mt-6 max-w-xs text-sm leading-8 text-stone-600">{text}</p>}</div>;
}

function GalleryArt({ index }: { index: number }) {
  const backgrounds = ['#ddd9cb', '#dfc8bd', '#bdd0c8', '#e7d7b5', '#c3cece', '#e1c7c2'];
  return <svg viewBox="0 0 240 280" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={`Wedding photo placeholder ${index + 1}`}>
    <rect width="240" height="280" fill={backgrounds[index]} />
    <circle cx={index % 2 ? 170 : 80} cy="76" r="44" fill="#FBF5E9" fillOpacity=".45" />
    <path d="M35 280V125a85 85 0 01170 0v155" fill="#FBF5E9" fillOpacity=".27" stroke="#FBF5E9" strokeOpacity=".6" />
    <path d="M-10 250Q55 140 125 241T270 200V300H-10Z" fill="#0E4D4F" fillOpacity=".13" />
    <path d="M0 290Q130 170 240 260" stroke="#C9A24B" fill="none" />
    <path d="M180 280Q143 180 194 125M174 234q-43-25-39-48q33 3 39 48M179 208q38-17 35-42q-30 5-35 42" stroke="#0E4D4F" strokeOpacity=".4" fill="none" />
    <path d="M70 270L85 165Q96 150 110 165L132 270Z" fill="#0E4D4F" fillOpacity=".6" />
    <circle cx="99" cy="144" r="15" fill="#234E48" />
    <path d="M113 270Q118 219 133 166Q146 154 159 172L184 270Z" fill="#AF6F76" fillOpacity=".75" />
    <circle cx="145" cy="149" r="14" fill="#805753" />
    <path d="M123 168Q125 123 144 129Q169 130 178 239L146 173Z" fill="#F9E4CD" fillOpacity=".65" stroke="#C9A24B" strokeWidth=".7" />
    <path d="M107 187Q126 203 137 188" stroke="#E9C79C" strokeWidth="5" fill="none" />
  </svg>;
}

function Festivities() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  function goTo(index: number) {
    const next = Math.max(0, Math.min(events.length - 1, index));
    if (!track.current) return;
    track.current.scrollTo({ left: next * track.current.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <section id="celebrations" className="my-8 scroll-mt-16 bg-ivory py-20">
    <div className="px-6"><Heading eyebrow={`${events.length} celebrations, a thousand memories`} title="Let the festivities begin" text="Swipe through our six beautiful chapters." /></div>
    <div className="mx-6 mb-5 flex items-center justify-between border-y border-gold/40 py-2">
      <p className="text-xs uppercase tracking-[0.15em] text-teal">The wedding diary</p>
      <span aria-live="polite" className="font-serif text-xl tabular-nums text-teal">0{active + 1} <span className="text-sm text-stone-600">/ 0{events.length}</span></span>
    </div>
    <div ref={track} role="region" aria-roledescription="carousel" aria-label="Wedding festivities" tabIndex={0} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(active + (e.key === 'ArrowRight' ? 1 : -1)); } }} onScroll={e => { const el = e.currentTarget; if (el.clientWidth) setActive(Math.max(0, Math.min(events.length - 1, Math.round(el.scrollLeft / el.clientWidth)))); }} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
      {events.map((ceremony, index) => <div key={ceremony.name} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${events.length}: ${ceremony.name}`} className="w-full min-w-0 shrink-0 snap-center snap-always px-6">
        <article className="relative mx-auto max-w-md overflow-hidden rounded-t-[180px] border border-gold bg-[linear-gradient(150deg,#fffdf5,#efe3cb)] px-7 pb-12 pt-20 text-center shadow-[0_12px_25px_#53452518]">
          <div className="pointer-events-none absolute inset-2 rounded-t-[175px] border border-gold/30" />
          <div className="relative">
            <div style={{ background: ceremony.color }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold/50 shadow-inner"><Lotus /></div>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-teal">Chapter 0{index + 1}</p>
            <h3 className="mt-5 font-serif text-4xl text-teal">{ceremony.name}<Hindi text={ceremony.name} /></h3>
            <p className="mb-5 mt-5 min-h-14 font-serif text-xl italic text-teal">{ceremony.note}</p>
            <Ornament />
            <p className="mt-5 text-sm font-medium text-teal">{new Date(`2027-02-${ceremony.day}T12:00:00+05:30`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' })} 2027</p>
            <p className="mt-2 text-sm tracking-wider text-teal">{ceremony.time} IST</p>
            <p className="mt-4 min-h-12 text-sm leading-6 text-stone-600">{ceremony.venue}<br />The Leela Palace, Jaipur</p>
            <div className="my-5 min-h-24 border-y border-gold/30 py-3"><p className="text-xs uppercase tracking-[0.15em] text-[#77591e]">Dress the part</p><p className="mt-2 text-sm leading-6 text-teal">{ceremony.attire}</p></div>
            <a href={mapLink} target="_blank" rel="noreferrer" tabIndex={active === index ? 0 : -1} className={`${button} bg-teal text-ivory`} aria-label={`Directions for ${ceremony.name}`}><ActionIcon kind="pin" />Directions</a>
          </div>
        </article>
      </div>)}
    </div>
    <div className="mx-auto flex max-w-md flex-wrap items-center justify-between gap-1 px-6">
      <button onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous ceremony" className="h-11 w-11 shrink-0 rounded-full border border-gold text-xl text-teal transition hover:bg-gold/20 focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-600">←</button>
      <div className="order-last flex w-full justify-center">{events.map((event, index) => <button key={event.name} onClick={() => goTo(index)} aria-label={`Show ${event.name}`} aria-pressed={active === index} className="flex h-11 w-11 items-center justify-center focus-visible:ring-2 focus-visible:ring-gold"><span className={`h-2 rounded-full transition-all ${active === index ? 'w-6 bg-teal' : 'w-2 bg-[#AC935F]'}`} /></button>)}</div>
      <button onClick={() => goTo(active + 1)} disabled={active === events.length - 1} aria-label="Next ceremony" className="h-11 w-11 shrink-0 rounded-full border border-gold text-xl text-teal transition hover:bg-gold/20 focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-600">→</button>
    </div>
    <p className="mt-4 text-center text-xs uppercase tracking-[0.16em] text-stone-600">← Swipe to celebrate →</p>
  </section>;
}

function Glimpses() {
  const [selected, setSelected] = useState(0);
  const memories = [
    { title: 'Where it all began', note: 'One hello. A thousand possibilities.' },
    { title: 'The little things', note: 'Ordinary days, extraordinary company.' },
    { title: 'Side by side', note: 'Our favourite place has always been together.' },
    { title: 'Our kind of love', note: 'A little laughter. A little magic. Always us.' },
    { title: 'Always you', note: 'In every chapter, I would choose you.' },
    { title: 'Forever starts here', note: 'The most beautiful part is still to come.' },
  ];
  return <section className="relative my-8 overflow-hidden border-y border-gold/40 bg-[radial-gradient(ellipse_at_top,#eae2cd,#fbf5e9_65%)] px-6 py-16 md:px-10">
    <Feather className="pointer-events-none absolute -right-12 top-0 rotate-[-30deg]" />
    <div className="relative"><Heading eyebrow="A love story in little frames" title="Glimpses of us" text="Little moments. Lifelong memories." /></div>
    <div className="relative mx-auto max-w-md">
      <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-2 border border-gold/40 bg-[#e5d8bc]" aria-hidden="true" />
      <figure className="relative border border-gold/60 bg-[#fffaf0] p-3 pb-6 shadow-[0_16px_35px_#533f2425]">
        <div key={selected} className="relative h-72 overflow-hidden rounded-t-[130px] border border-gold/50 md:h-96 motion-safe:animate-[note_.6s_ease_both]"><GalleryArt index={selected} /><span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/40 bg-ivory/95 px-4 py-2 text-xs text-teal">Illustrated photo placeholder</span></div>
        <figcaption aria-live="polite" className="px-2 pt-7 text-center"><p className="text-xs uppercase tracking-[0.2em] text-[#77591e]">Our story · 0{selected + 1}</p><h3 className="mt-4 font-serif text-3xl italic text-teal">{memories[selected].title}<Hindi text={memories[selected].title} /></h3><p className="mt-4 text-sm leading-7 text-stone-600">{memories[selected].note}</p></figcaption>
      </figure>
      <Lotus className="pointer-events-none absolute -bottom-7 -right-5 rotate-12" />
    </div>
    <div className="mt-12 flex items-center justify-between border-b border-gold/40 pb-3"><p className="text-xs uppercase tracking-[0.18em] text-teal">The memory collection</p><span className="font-serif text-xl italic text-teal">Six little forevers</span></div>
    <div className="mt-7 grid grid-cols-2 gap-5">
      {memories.map((memory, index) => <button key={memory.title} onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`Feature memory: ${memory.title}`} className={`group min-w-0 border bg-ivory p-2 pb-4 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${selected === index ? 'border-teal ring-1 ring-teal' : 'border-gold/40'}`}>
        <div className={`relative h-36 overflow-hidden ${index % 2 === 0 ? 'rounded-t-[70px]' : ''}`}><div className="h-full transition duration-500 group-hover:scale-105"><GalleryArt index={index} /></div><span className="absolute bottom-2 left-2 bg-ivory/95 px-2 py-1 text-xs text-teal">0{index + 1}</span></div>
        <p className="mt-3 px-1 font-serif text-lg leading-5 text-teal">{memory.title}</p><span className="mt-2 block px-1 text-xs text-stone-600">{selected === index ? 'On display above' : 'View this moment ↗'}</span>
      </button>)}
    </div>
    <div className="mt-9"><Ornament /><p className="mt-4 text-center text-sm italic leading-6 text-stone-600">A beautifully imagined album, waiting for your photographs.</p></div>
  </section>;
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
      </svg> : <img src="/images/mor-pankh-couple.png" alt="3D-style Aarav and Meera together, welcoming you with namaste in ivory, emerald and blush wedding attire" width={1024} height={1024} onError={() => setImageError(true)} className="relative h-auto w-full mix-blend-multiply motion-safe:animate-[avatar-welcome_1.2s_ease-out_both]" />}
      <Feather small className="pointer-events-none absolute -left-2 bottom-6 -rotate-12" />
      <Lotus className="pointer-events-none absolute -bottom-3 -right-3 !h-16 !w-24" />
    </div>
    <div className="relative mt-7 border-t border-gold/40 pt-6">
      <p className="font-serif text-2xl italic text-teal">Namaste, {guest || 'our loved ones'}.</p>
      <h2 className="mt-5 font-serif text-4xl text-teal">Our joy begins with you.<Hindi text="Our joy begins with you." /></h2>
      <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-stone-600">With folded hands and full hearts, we welcome you to our wedding celebration.</p>
      <p className="mt-4 font-script text-4xl text-teal">Aarav & Meera</p>
      <button onClick={onContinue} className={`${button} mt-6 w-full bg-teal text-ivory sm:w-auto`}>Enter our celebration <span aria-hidden="true">↓</span></button>
    </div>
  </div>;
}

export default function MorPankhInvitation({ template = {}, content = {}, guestName: propGuestName, rsvpComponent = null } = {}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [theme, setTheme] = useState<keyof typeof themes>('Ivory');
  const [opened, setOpened] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [attending, setAttending] = useState('Joyfully Attending');
  const [reply, setReply] = useState({ name: '', mobile: '', guests: '1', meal: 'Vegetarian', message: '' });
  const [eventReplies, setEventReplies] = useState<Record<string, string>>(() => Object.fromEntries(events.map(e => [e.name, 'Maybe'])));
  const [dateRevealed, setDateRevealed] = useState(false);
  const [sent, setSent] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [guest, setGuest] = useState('Mr. Joshi and Family');
  const greeting = useRef<HTMLElement>(null);
  const welcome = useRef<HTMLElement>(null);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const name = propGuestName || new URLSearchParams(window.location.search).get('guest');
    if (name) setGuest(name);
    return () => window.clearInterval(timer);
  }, []);
  const remaining = Math.max(0, wedding.getTime() - now);
  const countdown = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60];

  function openInvitation() {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setOpened(true);
    window.setTimeout(() => { welcome.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); welcome.current?.focus({ preventScroll: true }); }, 3200);
  }
  function addCalendar() {
    const content = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:aarav-meera-2027@aahvaaan\r\nDTSTAMP:20260601T000000Z\r\nDTSTART:20270227T110000Z\r\nDTEND:20270227T173000Z\r\nSUMMARY:Aarav & Meera — Wedding Celebration\r\nLOCATION:The Leela Palace Jaipur\\, Rajasthan\r\nEND:VEVENT\r\nEND:VCALENDAR';
    const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'aarav-and-meera.ics'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div style={themes[theme] as CSSProperties} className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,#235b54,#082d2e_70%)] font-sans text-charcoal selection:bg-gold/30 md:px-8 md:py-12">
    <div className="mx-auto flex max-w-[450px] flex-wrap items-center justify-center gap-2 px-4 py-5 md:mb-7 md:py-0" role="group" aria-label="Invitation colour variant">
      {(Object.keys(themes) as Array<keyof typeof themes>).map(name => <button key={name} aria-pressed={theme === name} onClick={() => setTheme(name)} className={`min-h-11 rounded-full border px-5 text-sm transition focus-visible:ring-2 focus-visible:ring-gold ${theme === name ? 'border-gold bg-ivory text-teal' : 'border-[#9c966e] text-[#f5ead1] hover:bg-white/10'}`}>{name}</button>)}
    </div>
    <p className="mb-6 hidden text-center text-xs uppercase tracking-[0.23em] text-[#E3D3AE] md:block">Mor Pankh · The royal collection</p>
    <div className="relative isolate mx-auto max-w-[450px] overflow-hidden bg-[var(--canvas)] shadow-[0_30px_100px_#001c1c80] transition-colors duration-500 md:rounded-[44px] md:border-[9px] md:border-[#142f2e] md:ring-1 md:ring-[#b7a16a]">
    <div className="pointer-events-none absolute left-1/2 top-2 z-40 hidden h-1.5 w-14 -translate-x-1/2 rounded-full bg-teal/30 md:block" />
    <audio ref={audioRef} src="/templates/mor-pankh/media/music.mp3" loop preload="auto" />
    <PaperTexture />
    <header className="relative z-30 flex min-h-28 items-center justify-between border-b border-gold/30 bg-ivory px-6">
      <a href="#" className="text-teal" aria-label="Aahvaaan home"><span className="font-serif text-2xl tracking-[0.06em]">aahvaaan<span className="text-gold">.</span></span><span className="mt-0.5 block text-[12px] uppercase tracking-[0.14em]">by Vow & Vision</span></a>
      <span className="text-right text-xs uppercase leading-6 tracking-[0.15em] text-teal">Mor Pankh<br /><span className="tracking-wider">A royal invitation</span></span>
    </header>

    <main>
      <section className="relative bg-ivory px-5 pb-12 pt-9 text-center">
        <p className="font-hindi text-lg text-teal">॥ श्री गणेशाय नमः ॥</p>
        <p className="mb-6 mt-3 text-xs uppercase tracking-[0.23em] text-teal">An auspicious beginning. An eternal bond.</p>
        <div className="relative mx-auto min-h-[650px] max-w-[430px] overflow-hidden rounded-t-[210px] border-2 border-gold bg-[radial-gradient(ellipse_at_top,var(--cover-start),var(--cover-end))] shadow-[0_18px_35px_-10px_#0e4d4f60,0_0_0_5px_#c9a24b15] [perspective:1100px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-ivory px-7 pb-14">
            <ShriGanesh />
            <p lang="hi" className="mt-6 font-hindi text-xl leading-9 text-teal">॥ श्री गणेशाय नमः ॥</p>
            <div className="my-5"><Ornament /></div>
            <p className="font-serif text-2xl italic text-teal">With Shri Ganesh ji’s blessings</p>
            <p lang="hi" className="mt-4 font-hindi text-sm leading-7 text-teal">मंगलमय हो यह शुभ आरंभ</p>
          </div>
          {[0, 1].map(side => <div key={side} className={`pointer-events-none absolute inset-y-0 w-1/2 overflow-hidden border-gold/60 bg-[radial-gradient(ellipse_at_top,var(--cover-start),var(--cover-end))] transition-transform duration-1000 motion-reduce:transition-none ${side ? 'right-0 origin-right border-l' : 'left-0 origin-left border-r'}`} style={{ transform: opened ? `rotateY(${side ? '' : '-'}110deg)` : 'rotateY(0deg)' }}><div className={`absolute inset-y-0 w-[200%] ${side ? 'right-0' : 'left-0'}`}><RoyalFrame /><Feather className="absolute left-1/2 top-14 -translate-x-1/2 text-gold" /><div className="absolute inset-x-8 top-[225px] text-center"><p className="text-xs uppercase tracking-[0.2em] text-[#E3D3AE]">Together, a beautiful forever</p><h1 className="mt-5 font-serif text-5xl text-ivory">Aarav <span className="font-serif italic text-gold">&</span> Meera<Hindi text="आरव एवं मीरा" /></h1><p className="mt-5 text-xs uppercase tracking-[0.2em] text-[#E3D3AE]">27 February 2027 · Jaipur</p></div></div></div>)}
          {!opened && <button onClick={openInvitation} aria-label="Break the wax seal and open the invitation" className="absolute left-1/2 top-[430px] z-10 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-[45%_55%_49%_51%/54%_45%_55%_46%] border-4 border-[#b78b43] bg-[radial-gradient(circle_at_30%_25%,#f1d99c,#c29b51_55%,#8f692c)] shadow-[0_7px_16px_#001c1c80,inset_0_0_0_2px_#ead193,inset_0_0_10px_#67461d60] transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-ivory"><span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#806026] font-serif text-3xl italic text-[#4c371c]">A&M</span></button>}
          {!opened && <div className="pointer-events-none absolute inset-0">{Array.from({ length: 9 }, (_, i) => <span key={i} className="absolute h-1 w-1 rounded-full bg-[#E5CE96] motion-safe:animate-[float_5s_ease-in-out_infinite]" style={{ left: `${10 + i * 10}%`, top: `${20 + (i * 17) % 64}%`, animationDelay: `${i * .6}s` }} />)}</div>}
          <button onClick={openInvitation} disabled={opened} aria-expanded={opened} aria-controls="invitation-story" className="absolute bottom-9 left-1/2 z-10 min-h-12 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#E5CE96] bg-[linear-gradient(120deg,#e6d09a,#bd9446,#e6d09a)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#173d35] shadow-[0_4px_24px_#c9a24b40] transition hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ivory disabled:cursor-default">{opened ? 'Welcome inside' : 'Tap to open'} <span className="ml-2" aria-hidden="true">↗</span></button>
        </div>
        <p className="mt-6 font-serif text-xl italic text-teal">A royal celebration. A deeply personal invitation.</p>
        <details className="mx-auto mt-5 max-w-sm text-left"><summary className="min-h-11 cursor-pointer text-center text-xs uppercase tracking-[0.14em] text-teal">Personalise your invitation preview</summary><label className="mt-2 block text-sm text-teal">Guest name<input aria-label="Preview guest name" value={guest} onChange={e => setGuest(e.target.value)} className="mt-2 min-h-12 w-full border border-gold/60 bg-ivory/90 px-4 outline-none focus-visible:ring-2 focus-visible:ring-gold" /></label><p className="mt-3 text-sm text-stone-600">Addressed to: {guest || 'our loved ones'}</p></details>
      </section>

      <div id="invitation-story" hidden={!opened}>
      <section ref={welcome} tabIndex={-1} aria-label="A welcome from Aarav and Meera" className="scroll-mt-4 px-5 py-8 focus:outline-none md:px-10">
        {opened && <CoupleWelcome guest={guest} onContinue={() => { greeting.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); greeting.current?.focus({ preventScroll: true }); }} />}
      </section>
      <nav className="sticky top-0 z-30 flex justify-center gap-6 border-y border-gold/30 bg-ivory/95 px-4 backdrop-blur" aria-label="Invitation sections">{[['Celebrations', '#celebrations'], ['Venue', '#venue'], ['RSVP', '#rsvp']].map(([label, href]) => <a key={href} href={href} className="flex min-h-12 items-center text-xs uppercase tracking-widest text-teal hover:underline focus-visible:ring-2 focus-visible:ring-gold">{label}</a>)}</nav>
      <section ref={greeting} tabIndex={-1} className="relative mx-5 my-10 scroll-mt-16 border border-gold/60 bg-ivory/95 px-6 py-10 text-center shadow-[0_10px_35px_#53452512] focus:outline-none md:mx-10 md:px-10">
        <div className="pointer-events-none absolute inset-2 border border-gold/25" />
        <Feather small className="mx-auto mb-4 text-gold" />
        <p className="font-hindi text-lg text-teal">॥ श्री गणेशाय नमः ॥</p>
        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-stone-600">With hearts full of love</p>
        <h2 className="mt-6 font-serif text-3xl italic text-teal">Dear {guest || 'our loved ones'},<Hindi text="प्रिय अतिथि, आपका हार्दिक स्वागत है" /></h2>
        <p className="mt-2 text-xs uppercase tracking-[0.15em] text-stone-600">An invitation especially for you</p>
        <p className="mx-auto mt-7 max-w-xs text-sm leading-8 text-stone-600">Join us as we begin our forever, surrounded by the people we love.</p>
        <div className="my-6"><Ornament /></div>
        <p className="text-sm leading-7 text-stone-600">Sunita & Rajesh Sharma<br /><span className="font-serif text-xl italic text-teal">and</span><br />Kavita & Vikram Kapoor</p>
        <p className="mt-5 text-sm text-stone-600">request the pleasure of your company at the wedding of</p>
        <p className="mt-5 font-serif text-5xl text-teal">Aarav <span className="italic text-[#866622]">&</span> Meera</p>
        <p className="mt-5 font-serif text-xl italic text-teal">With the blessings of our elders,<br />and the love of those we hold dear.</p>
      </section>

      <section className="relative mx-4 overflow-hidden rounded-t-[180px] bg-[radial-gradient(ellipse_at_top,#29685f,#0b3c3c_75%)] px-9 pb-16 pt-32 text-center text-ivory shadow-[0_15px_35px_#0e4d4f25]">
        <RoyalFrame />
        <Peacock className="mx-auto mb-5" />
        <div className="relative border border-gold/60 bg-ivory px-4 py-7 text-teal shadow-xl">
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-teal">Together with our families</p>
        <div className="my-7 flex flex-col items-center justify-center gap-1"><span className="font-script text-7xl">Aarav</span><span className="font-serif text-4xl italic text-[#866622]">&</span><span className="font-script text-7xl">Meera</span></div>
        <p className="text-sm font-light tracking-wide">invite you to celebrate their wedding</p>
        <div className="my-7"><Ornament /></div>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-teal">Jaipur, Rajasthan</p>
        </div><Lotus className="mx-auto -mt-3" />
      </section>

      <section className="my-10 bg-ivory px-6 py-20">
        <Heading eyebrow="Rooted in love, blessed by family" title="Two families. One beautiful bond." />
        <div className="grid gap-8">
          {[{ side: "The groom’s family", surname: 'The Sharmas', names: 'Sunita & Rajesh Sharma', child: 'Beloved son, Aarav' }, { side: "The bride’s family", surname: 'The Kapoors', names: 'Kavita & Vikram Kapoor', child: 'Beloved daughter, Meera' }].map(f => <article key={f.surname} className="rounded-t-[120px] border border-gold/50 bg-[linear-gradient(145deg,#fffaf0,#eee4d1)] px-7 pb-12 pt-14 text-center shadow-[0_8px_25px_#664d2112]"><Lotus className="mx-auto text-gold" /><p className="mb-6 mt-5 text-xs uppercase tracking-[0.16em] text-stone-600">{f.side}</p><h3 className="font-serif text-3xl text-teal">{f.surname}<Hindi text={f.surname} /></h3><p className="mt-6 text-sm">{f.names}</p><p className="mt-3 text-sm italic text-stone-600">{f.child}</p></article>)}
        </div>
        <p className="mt-8 text-center font-serif text-xl italic text-teal">With the blessings of those who made us who we are.</p>
      </section>

      <section className="border-y border-gold/30 bg-[#F1EBDD] px-6 py-16 text-center">
        <Heading eyebrow="A day to remember" title="Save our date" />
        <div className="relative mx-auto max-w-sm [perspective:1000px]">
          <div className="pointer-events-none absolute -left-4 top-4 -rotate-12"><Feather /></div><div className="pointer-events-none absolute -right-4 top-4 rotate-12"><Feather /></div>
          {dateRevealed ? <div id="revealed-date" role="status" className="relative border border-gold bg-ivory px-6 py-8 shadow-lg motion-safe:animate-[note_.8s_ease_both]"><p className="text-sm uppercase tracking-[0.2em] text-teal">Saturday</p><p className="my-2 font-serif text-8xl text-teal">27</p><p className="font-serif text-3xl italic text-teal">February</p><p className="mt-3 text-lg tracking-[0.3em] text-teal">2027</p><p className="mt-4 text-sm text-stone-600">Jaipur, India · 4:30 PM IST</p></div> : <div className="relative border border-gold bg-ivory px-5 py-9 shadow-lg"><Lotus className="mx-auto" /><p className="my-5 font-serif text-3xl italic text-teal">A day written in the stars…</p><button onClick={() => setDateRevealed(true)} aria-controls="revealed-date" aria-expanded={false} className={`${button} bg-teal text-ivory`}>Reveal the Date! ↗</button></div>}
        </div>
        <div className="mx-auto my-9 flex max-w-sm justify-center divide-x divide-gold/40">{countdown.map((n, i) => <div className="w-1/3 px-5" key={i}><p className="font-serif text-4xl tabular-nums text-teal">{String(n).padStart(2, '0')}</p><p className="mt-2 text-xs uppercase tracking-[0.15em] text-stone-600">{['Days', 'Hours', 'Minutes'][i]}</p></div>)}</div>
        <button onClick={addCalendar} className={`${button} bg-teal text-ivory`}>Add to calendar <span aria-hidden="true">＋</span></button>
      </section>

      <Booklet />
      <Festivities />

      <section id="venue" className="mx-5 grid min-w-0 scroll-mt-16 gap-8 border border-gold/50 bg-ivory/90 px-6 py-10 shadow-[0_10px_35px_#53452512] md:mx-10">
        <div className="relative flex h-72 items-center justify-center overflow-hidden border border-gold/40 bg-[#E9E9DC]">
          <svg viewBox="0 0 460 300" className="absolute h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="M-20 40L480 240M-20 60L480 260M70-20L160 320M90-20L180 320M300-20L230 320" stroke="#FBF5E9" strokeWidth="13" /><path d="M0 200Q150 170 190 70T460 50" stroke="#B6CEC4" strokeWidth="28" fill="none" /><path d="M0 200Q150 170 190 70T460 50" stroke="#D1DED4" strokeWidth="20" fill="none" /></svg>
          <div className="relative bg-ivory px-7 py-5 text-center shadow-md"><span className="text-2xl text-gold">⌖</span><p className="mt-2 font-serif text-xl text-teal">The Leela Palace</p><p className="mt-1 text-xs uppercase tracking-widest text-stone-600">Jaipur</p><p className="mt-3 text-xs text-stone-600">Illustrative map</p></div>
        </div>
        <div className="min-w-0 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-teal">Venue & schedule</p>
          <h2 className="mt-6 font-serif text-4xl text-teal">A royal setting.<Hindi text="एक शाही स्थल, अनमोल यादें" /></h2>
          <p className="mt-8 text-sm font-medium">The Leela Palace Jaipur</p>
          <p className="mt-3 text-sm leading-8 text-stone-600">Jaipur–Delhi Highway, NH 11<br />Kukas, Jaipur, Rajasthan 302028</p>
          <div className="my-8 border-y border-gold/30 py-6"><p className="font-serif text-2xl text-teal">25–27 February 2027</p><p className="mt-4 text-sm leading-8 text-stone-600">Three days. Six celebrations.<br />Vivaah · Saturday, 4:30 PM IST</p></div>
          <div className="flex flex-col justify-center gap-4"><a href={mapLink} target="_blank" rel="noreferrer" className={`${button} bg-teal text-ivory`}><ActionIcon kind="pin" />Get directions</a><button type="button" onClick={addCalendar} className={`${button} text-teal`}><ActionIcon kind="calendar" />Add to calendar</button></div>
        </div>
      </section>

      <Glimpses />

      <section id="rsvp" className="mx-4 mb-10 scroll-mt-16 rounded-t-[100px] border border-gold/50 bg-[linear-gradient(145deg,#fffbf2,#eee2cb)] px-6 py-16 shadow-[0_12px_35px_#53452518] md:px-10 md:py-20">
        <div className="mx-auto max-w-xl"><Heading eyebrow="The celebration is incomplete without you" title="Will you join us?" text="Kindly share your wishes by 1 February 2027. We can't wait to celebrate with you." />
          <p className="mb-6 border-y border-gold/30 py-3 text-center text-sm text-teal">Personally invited: <span className="font-medium">{guest || 'our loved ones'}</span></p>
          {sent && <div className="mb-5 border border-gold/40 bg-ivory/80 p-5"><p className="text-sm text-teal">Your celebration choices · {reply.mobile}</p><dl className="mt-3 space-y-2">{events.map(event => <div key={event.name} className="flex items-center justify-between gap-3 text-sm"><dt className="text-stone-600">{event.name}</dt><dd className="font-medium text-teal">{eventReplies[event.name]}</dd></div>)}</dl></div>}
          {sent ? <div role="status" className="border border-gold bg-ivory p-8 text-center"><Ornament /><h3 className="mt-6 font-serif text-3xl text-teal">Your reply is lovingly noted.<Hindi text="Your reply is lovingly noted." /></h3><p className="mt-6 text-sm font-medium text-teal">{reply.name} · {attending}</p>{attending !== 'Regretfully Decline' && <p className="mt-3 text-sm text-teal">{reply.guests} {reply.guests === '1' ? 'guest' : 'guests'} · {reply.meal}</p>}<p className="mt-6 text-sm leading-8 text-stone-600">Saved in this browser only, not sent to the couple.</p><button onClick={() => setSent(false)} className={`${button} mt-7 text-teal`}>Edit your reply</button></div> :
          <form onSubmit={e => { e.preventDefault(); try { localStorage.setItem('mor-pankh-rsvp', JSON.stringify({ ...reply, attending, eventReplies, submittedAt: new Date().toISOString() })); setSent(true); setSaveError(''); } catch { setSaveError('Your browser could not save this reply. Please enable local storage and try again.'); } }} className="space-y-6">
            <Field label="Mobile number (with country code)"><input required type="tel" name="mobile" autoComplete="tel" inputMode="tel" pattern="\+?[0-9 ()-]{7,20}" title="Enter 7–20 characters using digits, spaces, parentheses or hyphens, with an optional leading +." value={reply.mobile} onChange={e => setReply({ ...reply, mobile: e.target.value })} placeholder="+91 98765 43210" className="min-h-12 w-full bg-transparent py-3 text-sm outline-none" /></Field>
            <div className="grid gap-7"><Field label="Your full name"><input required name="name" autoComplete="name" value={reply.name} onChange={e => setReply({ ...reply, name: e.target.value })} placeholder="Enter your name" className="min-h-12 w-full bg-transparent py-3 text-sm outline-none" /></Field><Field label="Number of guests"><select name="guests" value={reply.guests} onChange={e => setReply({ ...reply, guests: e.target.value })} disabled={attending === 'Regretfully Decline'} className="min-h-12 w-full bg-transparent text-sm outline-none disabled:text-stone-600">{[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}</select></Field></div>
            <fieldset><legend className="mb-3 text-sm text-teal">Will you be attending?</legend><div className="grid gap-3">{['Joyfully Attending', 'Regretfully Decline', 'Tentative'].map(value => <button type="button" key={value} onClick={() => setAttending(value)} aria-pressed={attending === value} className={`min-h-12 border px-4 text-sm transition hover:border-gold active:scale-[.99] focus-visible:ring-2 focus-visible:ring-gold ${attending === value ? 'border-teal bg-teal text-ivory shadow-md' : 'border-gold/50 bg-ivory/60 text-teal'}`}>{value} {attending === value && '✓'}</button>)}</div></fieldset>
            <div className="space-y-4 border-y border-gold/40 py-6"><p className="font-serif text-2xl text-teal">Which moments will we share?</p><p className="text-sm leading-6 text-stone-600">Choose for each celebration. These selections are saved with your reply.</p>{events.map(event => <fieldset key={event.name} className="border border-gold/40 bg-ivory/80 p-3"><legend className="px-2 text-sm font-medium text-teal">{event.name} · {event.day} Feb</legend><div className="grid grid-cols-3 gap-2">{['Yes', 'Maybe', 'No'].map(choice => <label key={choice} className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 border text-sm transition hover:border-gold focus-within:ring-2 focus-within:ring-gold ${eventReplies[event.name] === choice ? 'border-teal bg-teal text-ivory' : 'border-gold/40 text-teal'}`}><input type="radio" name={`event-${event.name}`} value={choice} checked={eventReplies[event.name] === choice} onChange={() => setEventReplies({ ...eventReplies, [event.name]: choice })} className="sr-only" />{choice}{eventReplies[event.name] === choice && <span aria-hidden="true">✓</span>}</label>)}</div></fieldset>)}</div>
            {attending !== 'Regretfully Decline' && <Field label="Meal preference"><select name="meal" value={reply.meal} onChange={e => setReply({ ...reply, meal: e.target.value })} className="min-h-12 w-full bg-transparent text-sm outline-none"><option>Vegetarian</option><option>Jain</option><option>Vegan</option><option>Other — please note below</option></select></Field>}
            <Field label="A little note for the couple"><textarea name="message" rows={3} value={reply.message} onChange={e => setReply({ ...reply, message: e.target.value })} placeholder="Your wishes, a song request, or dietary requirements…" className="w-full resize-y bg-transparent py-3 text-sm outline-none" /></Field>
            {saveError && <p role="alert" className="text-sm text-red-800">{saveError}</p>}
            <button className={`${button} w-full bg-teal text-ivory`} type="submit">Send with love <span aria-hidden="true">♡</span></button><p className="text-center text-xs leading-5 text-stone-600">A preview for your special day. Replies are saved on this device only.</p>
          </form>}
        </div>
      </section>
      <footer className="bg-[radial-gradient(ellipse_at_top,#24655d,#0b3c3c)] px-6 py-14 text-center text-ivory"><Feather small className="mx-auto text-gold" /><p className="mt-3 font-serif text-2xl italic">The best part of our day will be having you there.</p><p className="mb-5 mt-8 font-script text-5xl">Aarav & Meera</p><p className="text-xs uppercase tracking-[0.2em] text-[#E3D3AE]">27.02.2027 · Jaipur</p><div className="mx-auto my-9 h-px max-w-xs bg-gold/40" /><p className="text-xs text-[#E3D3AE]">Made with <span className="font-serif text-lg text-ivory">aahvaaan.</span></p><p className="mt-2 text-xs tracking-widest text-[#E3D3AE]">MOR PANKH · BY VOW & VISION</p></footer>
      </div>
    </main>
    </div>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block border-b border-teal/30 focus-within:border-teal focus-within:ring-2 focus-within:ring-gold/60"><span className="text-sm text-teal">{label}</span>{children}</label>;
}


