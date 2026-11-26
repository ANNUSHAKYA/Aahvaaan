import React, { useState, useEffect, useRef } from "react";

// ============================================================================
// Mor Pankh · № 01 — Standalone Single-File Component for Figma Make (React 19 + TS + Tailwind v4)
// ============================================================================

export default function App() {
  const [gatesOpen, setGatesOpen] = useState(false);
  const [guestName, setGuestName] = useState("Mr. Joshi and Family");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);
  const [diaryIndex, setDiaryIndex] = useState(0);
  const [revealedDate, setRevealedDate] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState({
    name: "",
    mobile: "",
    attendance: "attending",
    guestCount: 1,
    events: {} as Record<string, string>,
    diet: "vegetarian",
    wishes: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 93, hours: 15, minutes: 43, seconds: 12 });
  useEffect(() => {
    const target = new Date("2027-02-27T16:30:00+05:30").getTime();
    const interval = setInterval(() => {
      const diff = Math.max(0, target - new Date().getTime());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const celebrations = [
    {
      chapter: "01",
      name: "Ring Ceremony",
      tagline: "A promise, a sparkle, a beginning",
      date: "Thursday, 25 February 2027",
      time: "6:00 PM IST",
      venue: "Sharma Residence, Jaipur",
      dressCode: "Indo-Western Glamour",
      icon: "💍",
      description: "An intimate evening where rings are exchanged and two hearts make an eternal promise under golden chandeliers.",
    },
    {
      chapter: "02",
      name: "Haldi",
      tagline: "A little sunshine, a lot of love",
      date: "Friday, 26 February 2027",
      time: "10:00 AM IST",
      venue: "The Marigold Lawns, The Leela Palace",
      dressCode: "Sunlight Yellows & Marigolds",
      icon: "✨",
      description: "Sun-drenched laughter, fragrant turmeric, traditional folk songs, and flower showers with our dearest ones.",
    },
    {
      chapter: "03",
      name: "Mehendi",
      tagline: "Love, written in henna",
      date: "Friday, 26 February 2027",
      time: "4:00 PM IST",
      venue: "The Garden Pavilion, The Leela Palace",
      dressCode: "Emerald & Mint Festive",
      icon: "🌿",
      description: "Intricate Rajasthani henna designs celebrating love stories, accompanied by live shehnai and street food delicacies.",
    },
    {
      chapter: "04",
      name: "Sangeet",
      tagline: "An evening of song & celebration",
      date: "Friday, 26 February 2027",
      time: "7:00 PM IST",
      venue: "The Peacock Courtyard, The Leela Palace",
      dressCode: "Royal Sparkle & Cocktail",
      icon: "🪕",
      description: "High-energy choreography, family dance battles, DJ beats, and laughter that echoes into the starry Rajasthan night.",
    },
    {
      chapter: "05",
      name: "Vivaah",
      tagline: "Seven promises. One forever.",
      date: "Saturday, 27 February 2027",
      time: "4:30 PM IST",
      venue: "The Royal Courtyard, The Leela Palace",
      dressCode: "Traditional Heritage Regal",
      icon: "🔥",
      description: "Under the grand mandap with Vedic chants, the holy fire witnesses the sacred seven pheras uniting Aarav and Meera.",
    },
    {
      chapter: "06",
      name: "Reception",
      tagline: "To new beginnings, together",
      date: "Saturday, 27 February 2027",
      time: "7:30 PM IST",
      venue: "The Palace Ballroom, The Leela Palace",
      dressCode: "Formal Tuxedo & Silks",
      icon: "🥂",
      description: "A regal banquet dinner, heartfelt family toasts, and celebration of the newlyweds as they embark on life together.",
    },
  ];

  const keepsakeNotes = [
    {
      number: "01 / 04",
      title: "The Blessing of Elders",
      body: "With the divine grace of Lord Ganesha and the cherished blessings of our parents and departed elders, two souls and two families unite in lifelong harmony and timeless love.",
      signature: "With folded hands, The Sharmas & The Kapoors",
    },
    {
      number: "02 / 04",
      title: "Two Families, One Sacred Bond",
      body: "More than a union of two hearts, this celebration is a confluence of shared traditions, values, and memories that will be treasured across generations.",
      signature: "Sunita & Rajesh · Kavita & Vikram",
    },
    {
      number: "03 / 04",
      title: "Your Presence is Our Gift",
      body: "Your presence, blessings, and warm smiles are the most priceless gift we could ever receive as we begin our new chapter together.",
      signature: "Warmly, Aarav & Meera",
    },
    {
      number: "04 / 04",
      title: "A Note From Our Hearts",
      body: "Bring your blessings, your laughter, and your dancing shoes. The most precious part of our celebration will be having you there by our side.",
      signature: "With love, Aarav & Meera",
    },
  ];

  const handleOpenGates = () => {
    setGatesOpen(true);
    setIsPlaying(true);
    const storyEl = document.getElementById("invitation-story");
    if (storyEl) {
      setTimeout(() => storyEl.scrollIntoView({ behavior: "smooth" }), 600);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,#235b54,#082d2e_70%)] font-sans text-stone-900 selection:bg-[#C9A24B]/30 md:px-8 md:py-10">
      {/* Top Header metadata pill */}
      <div className="mx-auto mb-5 hidden max-w-[720px] items-center justify-between text-xs uppercase tracking-[0.2em] text-[#E3D3AE] md:flex">
        <span>The royal collection</span>
        <span>Mor Pankh · № 01</span>
      </div>

      {/* Main Parchment Container */}
      <div className="relative isolate mx-auto max-w-[720px] overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#fffdf5,#FBF5E9_45%,#eee3cc)] shadow-[0_30px_100px_#001c1c80]">
        
        {/* Header */}
        <header className="relative z-30 flex min-h-24 items-center justify-between border-b border-[#C9A24B]/30 px-6 md:px-10">
          <div>
            <span className="font-serif text-2xl tracking-[0.06em] text-[#0E4D4F]">
              aahvaaan<span className="text-[#C9A24B]">.</span>
            </span>
            <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-stone-600">
              by Vow &amp; Vision
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-right text-xs uppercase leading-5 tracking-[0.15em] text-[#0E4D4F] hidden sm:block">
              Mor Pankh<br />
              <span className="text-[10px] tracking-wider text-[#C9A24B]">A royal invitation</span>
            </span>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E4D4F]/10 border border-[#C9A24B]/60 text-[#0E4D4F] text-xs shadow-xs"
            >
              <span>{isMuted ? "🔇" : "🔊"}</span>
              <span className="font-mono text-[10px] hidden sm:inline">{isMuted ? "Muted" : "Music"}</span>
            </button>
          </div>
        </header>

        {/* Section 0: 3D Arch Gates */}
        <section className="relative px-5 pb-9 pt-7 text-center md:px-14">
          <p className="font-hindi text-lg font-bold text-[#0E4D4F]">॥ श्री गणेशाय नमः ॥</p>
          <p className="mb-6 mt-2 text-xs uppercase tracking-[0.23em] text-[#0E4D4F] font-medium">
            An auspicious beginning. An eternal bond.
          </p>

          <div className="relative mx-auto min-h-[560px] max-w-[430px] overflow-hidden rounded-t-[210px] border-2 border-[#C9A24B] bg-[radial-gradient(ellipse_at_50%_20%,#27665e,#0b3c3c_75%)] shadow-2xl [perspective:1100px]">
            {/* Inner reveal */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF6F0] px-8 text-center">
              <span className="text-5xl mb-4">🪷</span>
              <p className="font-serif text-3xl sm:text-4xl italic text-[#0E4D4F] leading-tight">
                A lifetime of love<br />awaits within.
              </p>
              <p className="mt-5 text-sm text-[#0E4D4F] font-medium">Welcome to our forever.</p>
              <div className="w-12 h-0.5 bg-[#C9A24B] my-4" />
              <p className="font-serif text-2xl font-bold text-[#082D2E]">Aarav &amp; Meera</p>
              <p className="text-xs uppercase tracking-widest text-[#C9A24B] mt-1 font-mono">
                27 February 2027 · Jaipur
              </p>
            </div>

            {/* Left Door */}
            <div
              className="absolute inset-y-0 w-1/2 overflow-hidden border-[#C9A24B]/70 bg-[radial-gradient(ellipse_at_top,#24655d,#0b3c3c)] transition-transform duration-1000 left-0 origin-left border-r shadow-2xl"
              style={{ transform: gatesOpen ? "rotateY(-110deg)" : "rotateY(0deg)" }}
            >
              <div className="absolute inset-y-0 w-[200%] left-0 flex flex-col items-center justify-center text-center text-[#FAF6F0] p-6">
                <span className="text-5xl mb-4 text-[#C9A24B]">🦚</span>
                <p className="font-serif text-2xl italic tracking-wide">Together,</p>
                <p className="mt-1 font-serif text-xl font-bold text-[#E3D3AE]">a beautiful forever</p>
                <p className="mt-3 text-xs tracking-widest text-[#C9A24B] uppercase">Aarav &amp; Meera</p>
                <p className="mt-1 text-[11px] text-[#E3D3AE]/80 font-mono">27 February 2027 · Jaipur</p>
              </div>
            </div>

            {/* Right Door */}
            <div
              className="absolute inset-y-0 w-1/2 overflow-hidden border-[#C9A24B]/70 bg-[radial-gradient(ellipse_at_top,#24655d,#0b3c3c)] transition-transform duration-1000 right-0 origin-right border-l shadow-2xl"
              style={{ transform: gatesOpen ? "rotateY(110deg)" : "rotateY(0deg)" }}
            >
              <div className="absolute inset-y-0 w-[200%] right-0 flex flex-col items-center justify-center text-center text-[#FAF6F0] p-6">
                <span className="text-5xl mb-4 text-[#C9A24B]">🦚</span>
                <p className="font-serif text-2xl italic tracking-wide">Together,</p>
                <p className="mt-1 font-serif text-xl font-bold text-[#E3D3AE]">a beautiful forever</p>
                <p className="mt-3 text-xs tracking-widest text-[#C9A24B] uppercase">Aarav &amp; Meera</p>
                <p className="mt-1 text-[11px] text-[#E3D3AE]/80 font-mono">27 February 2027 · Jaipur</p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center">
            <button
              onClick={handleOpenGates}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0E4D4F] text-[#FAF6F0] font-serif text-sm tracking-widest uppercase shadow-xl hover:bg-[#082D2E] transition-all cursor-pointer border border-[#C9A24B]/60"
            >
              <span>{gatesOpen ? "Step inside ↓" : "Welcome inside ↗"}</span>
            </button>
            <p className="mt-2 text-[11px] text-stone-600 tracking-wider uppercase">
              A royal celebration. A deeply personal invitation.
            </p>
          </div>
        </section>

        {/* Section 1: "पधारो सा" Royal Welcome */}
        <section id="invitation-story" className="relative px-5 py-12 text-center md:px-14 border-t border-[#C9A24B]/30 bg-white/40">
          <p className="font-hindi text-2xl sm:text-3xl font-bold text-[#0E4D4F]">पधारो सा</p>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24B] font-bold mb-6">
            A royal welcome, from the two of us
          </p>

          <div className="mx-auto w-28 h-28 rounded-full border-2 border-[#C9A24B] p-1.5 shadow-xl bg-[radial-gradient(ellipse_at_top,#fffdf5,#FAF6F0)] mb-6 flex flex-col items-center justify-center">
            <span className="text-4xl">🙏</span>
            <span className="text-[10px] font-hindi font-bold text-[#0E4D4F] mt-1">नमस्ते</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#082D2E] mb-2">
            Namaste, {guestName}.
          </h3>
          <p className="font-serif italic text-base sm:text-lg text-[#0E4D4F] mb-2">Our joy begins with you.</p>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed mb-6">
            With folded hands and full hearts, we welcome you to our wedding celebration.
          </p>
          <p className="font-serif text-lg font-bold text-[#0E4D4F]">Aarav &amp; Meera</p>

          {/* Personalize preview details */}
          <details className="mx-auto mt-6 max-w-sm rounded-xl border border-[#C9A24B]/40 bg-[#FAF6F0]/80 p-4 text-left shadow-xs">
            <summary className="cursor-pointer text-xs uppercase tracking-widest text-[#0E4D4F] font-bold">
              Personalise your invitation preview
            </summary>
            <label className="mt-3 block text-xs font-semibold text-[#0E4D4F]">
              Guest name
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="mt-1.5 min-h-10 w-full border border-[#C9A24B]/60 bg-white px-3.5 text-xs text-[#082D2E] rounded-md outline-none focus:ring-1 focus:ring-[#C9A24B]"
              />
            </label>
            <p className="mt-2 text-[11px] text-stone-500">
              Addressed to: <span className="font-semibold text-[#0E4D4F]">{guestName}</span>
            </p>
          </details>
        </section>

        {/* Section 2: Letter to Guest */}
        <section className="relative mx-5 my-8 border border-[#C9A24B]/60 bg-[#FAF6F0]/95 px-6 py-10 text-center shadow-lg md:mx-10 md:px-10 rounded-3xl">
          <p className="font-hindi text-lg text-[#0E4D4F] font-bold">॥ श्री गणेशाय नमः ॥</p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-600">With hearts full of love</p>
          <h2 className="mt-2 font-serif text-3xl italic text-[#0E4D4F]">Dear {guestName},</h2>
          <p className="mt-1 text-xs uppercase tracking-widest text-[#C9A24B] font-semibold">
            An invitation especially for you
          </p>
          <p className="mx-auto mt-6 max-w-lg font-serif italic text-sm sm:text-base leading-relaxed text-[#27665E]">
            "Some moments are too special to celebrate alone. We would be honoured to have you by our side as we begin our new journey together."
          </p>
          <p className="mt-6 text-xs font-serif font-bold text-[#0E4D4F]">
            With affection and respect, Aarav &amp; Meera
          </p>
        </section>

        {/* Section 3: Formal Announcement */}
        <section className="relative px-6 py-14 text-center border-t border-[#C9A24B]/30">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-bold mb-2">
            Together with our families
          </p>
          <h2 className="font-serif text-4xl font-bold text-[#082D2E] mb-1">Aarav &amp; Meera</h2>
          <p className="font-serif italic text-base text-[#0E4D4F] mb-5">invite you to celebrate their wedding</p>
          <div className="w-16 h-0.5 bg-[#C9A24B] mx-auto mb-5" />
          <div className="inline-block px-6 py-2 rounded-2xl bg-[#0E4D4F]/10 border border-[#C9A24B]/60 text-[#082D2E] font-serif text-sm tracking-widest uppercase mb-10">
            ❧ 27 FEBRUARY 2027 · JAIPUR, RAJASTHAN
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto text-center">
            <div className="p-6 rounded-2xl bg-white/70 border border-[#C9A24B]/40 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A24B] block mb-1">The Groom's Family</span>
              <h4 className="font-serif text-xl font-bold text-[#082D2E] mb-1">The Sharmas</h4>
              <p className="text-xs text-[#0E4D4F] font-medium mb-3">Sunita &amp; Rajesh Sharma</p>
              <div className="border-t border-[#C9A24B]/20 pt-2 text-[11px] italic text-stone-500">Beloved son, Aarav</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 border border-[#C9A24B]/40 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A24B] block mb-1">The Bride's Family</span>
              <h4 className="font-serif text-xl font-bold text-[#082D2E] mb-1">The Kapoors</h4>
              <p className="text-xs text-[#0E4D4F] font-medium mb-3">Kavita &amp; Vikram Kapoor</p>
              <div className="border-t border-[#C9A24B]/20 pt-2 text-[11px] italic text-stone-500">Beloved daughter, Meera</div>
            </div>
          </div>
        </section>

        {/* Section 4: Date Reveal & Countdown */}
        <section className="border-t border-[#C9A24B]/30 bg-white/30 py-12 px-6 text-center">
          <span className="font-hindi text-sm text-[#0E4D4F] tracking-widest block mb-1">शुभ विवाह मुहूर्त</span>
          <h3 className="font-serif text-2xl sm:text-3xl italic text-[#0E4D4F] mb-3">Save our date</h3>
          <div className="max-w-md mx-auto p-6 rounded-3xl border border-[#C9A24B]/60 bg-[#FAF6F0] shadow-xl">
            <div className="font-serif text-2xl font-bold text-[#082D2E] mb-2">Saturday, 27 February 2027</div>
            <div className="text-xs text-[#235B54] font-medium mb-6">4:30 PM IST • Jaipur, Rajasthan</div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Mins", val: timeLeft.minutes },
                { label: "Secs", val: timeLeft.seconds },
              ].map((b, i) => (
                <div key={i} className="bg-white border border-[#C9A24B]/30 rounded-2xl p-2.5">
                  <span className="block font-serif text-xl font-bold text-[#0E4D4F]">{b.val}</span>
                  <span className="text-[10px] uppercase text-stone-500">{b.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("Calendar invite ready for 27 Feb 2027")}
              className="px-6 py-2.5 rounded-full bg-[#0E4D4F] text-[#FAF6F0] text-xs font-semibold shadow-md"
            >
              Add to calendar ＋
            </button>
          </div>
        </section>

        {/* Section 5: Keepsake Notes */}
        <section className="py-16 px-6 text-center bg-[radial-gradient(ellipse_at_top,#235b54,#082d2e_80%)] text-[#FAF6F0]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#E3D3AE] font-bold block mb-1">
            The Mor Pankh Keepsake
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl italic text-[#FAF6F0] mb-6">A Little Note, Just For You</h2>
          
          <div className="max-w-md mx-auto bg-[#FAF6F0] text-[#082D2E] p-7 rounded-3xl border-2 border-[#C9A24B] shadow-2xl text-left mb-6">
            <div className="flex justify-between text-xs uppercase text-[#0E4D4F] font-bold border-b border-[#C9A24B]/40 pb-2 mb-3">
              <span>Note {keepsakeNotes[noteIndex].number}</span>
              <span className="text-[#C9A24B]">Aahvaaan</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0E4D4F] mb-2">{keepsakeNotes[noteIndex].title}</h3>
            <p className="font-serif italic text-sm text-[#27665E] leading-relaxed mb-4">
              "{keepsakeNotes[noteIndex].body}"
            </p>
            <div className="text-xs text-stone-500 border-t border-[#C9A24B]/30 pt-2 italic">
              {keepsakeNotes[noteIndex].signature}
            </div>
          </div>

          <div className="flex justify-between max-w-xs mx-auto text-xs text-[#E3D3AE]">
            <button
              onClick={() => setNoteIndex((prev) => (prev - 1 + keepsakeNotes.length) % keepsakeNotes.length)}
              className="py-1 px-3 rounded-full hover:bg-white/10"
            >
              ← Previous note
            </button>
            <span className="font-mono text-xs">{noteIndex + 1} / {keepsakeNotes.length}</span>
            <button
              onClick={() => setNoteIndex((prev) => (prev + 1) % keepsakeNotes.length)}
              className="py-1 px-3 rounded-full hover:bg-white/10"
            >
              Next note →
            </button>
          </div>
        </section>

        {/* Section 6: Celebrations Diary */}
        <section id="celebrations" className="py-16 px-6 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-bold block mb-1">
            6 Celebrations · A Thousand Memories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl italic text-[#0E4D4F] mb-6">The Wedding Diary</h2>

          <div className="max-w-md mx-auto bg-[#FAF6F0] border-2 border-[#C9A24B] rounded-3xl p-7 shadow-2xl text-center mb-6">
            <div className="text-[11px] font-mono text-[#0E4D4F] mb-2">
              CHAPTER {celebrations[diaryIndex].chapter} / 06
            </div>
            <div className="text-4xl mb-2">{celebrations[diaryIndex].icon}</div>
            <h3 className="font-serif text-2xl font-bold text-[#082D2E] mb-1">{celebrations[diaryIndex].name}</h3>
            <p className="font-serif text-xs italic text-[#C9A24B] mb-3">{celebrations[diaryIndex].tagline}</p>
            <div className="text-xs text-[#0E4D4F] space-y-1 mb-4 font-medium">
              <div>📅 {celebrations[diaryIndex].date}</div>
              <div>⏰ {celebrations[diaryIndex].time}</div>
              <div>📍 {celebrations[diaryIndex].venue}</div>
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#0E4D4F]/10 text-[10px] mt-1">
                Dress Code: {celebrations[diaryIndex].dressCode}
              </div>
            </div>
            <p className="text-xs text-stone-600 italic mb-5">"{celebrations[diaryIndex].description}"</p>
            <a
              href="https://maps.google.com/?q=The+Leela+Palace+Jaipur"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-5 py-2 rounded-xl bg-[#0E4D4F] text-[#FAF6F0] text-xs font-semibold shadow-xs"
            >
              View on Google Maps ↗
            </a>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setDiaryIndex((prev) => (prev - 1 + celebrations.length) % celebrations.length)}
              className="w-9 h-9 rounded-full bg-white border border-[#C9A24B] flex items-center justify-center text-sm shadow-sm"
            >
              ←
            </button>
            <span className="self-center font-mono text-xs">{diaryIndex + 1} of 6</span>
            <button
              onClick={() => setDiaryIndex((prev) => (prev + 1) % celebrations.length)}
              className="w-9 h-9 rounded-full bg-white border border-[#C9A24B] flex items-center justify-center text-sm shadow-sm"
            >
              →
            </button>
          </div>
        </section>

        {/* Section 7: Venue & Schedule */}
        <section id="venue" className="py-16 px-6 text-center border-t border-[#C9A24B]/30 bg-[#FAF6F0]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-bold block mb-1">
            ⌖ Illustrative Map
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl italic text-[#0E4D4F] mb-6">The Leela Palace, Jaipur</h2>
          <div className="max-w-md mx-auto bg-white p-7 rounded-3xl border-2 border-[#C9A24B] shadow-xl text-center">
            <span className="text-4xl block mb-2">🏰</span>
            <p className="text-xs sm:text-sm text-[#0E4D4F] font-medium leading-relaxed mb-4">
              Jaipur–Delhi Highway, NH 11 Kukas, Jaipur, Rajasthan 302028 · 25–27 February 2027
            </p>
            <a
              href="https://maps.google.com/?q=The+Leela+Palace+Jaipur"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0E4D4F] text-[#FAF6F0] text-xs font-semibold shadow-md"
            >
              Open in Google Maps ↗
            </a>
          </div>
        </section>

        {/* Section 8: RSVP Form */}
        <section id="rsvp" className="py-16 px-6 border-t border-[#C9A24B]/30 bg-white">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#C9A24B] block mb-1">
              The celebration is incomplete without you
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#082D2E] mb-2">Will you join us?</h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-6">
              Kindly share your wishes by 1 February 2027. We can't wait to celebrate with you.
            </p>
            <p className="border-y border-[#C9A24B]/30 py-2.5 text-xs text-[#0E4D4F] mb-6">
              Personally invited: <span className="font-semibold">{guestName}</span>
            </p>

            {rsvpSubmitted ? (
              <div className="p-8 rounded-3xl bg-[#FAF6F0] border-2 border-[#C9A24B] shadow-lg">
                <span className="text-4xl block mb-2">♥</span>
                <h4 className="font-serif text-2xl font-bold text-[#082D2E] mb-2">Thank you, {rsvpData.name || guestName}!</h4>
                <p className="text-xs text-stone-600 mb-4">Your RSVP has been recorded for Aarav &amp; Meera's wedding.</p>
                <button
                  onClick={() => setRsvpSubmitted(false)}
                  className="text-xs text-[#0E4D4F] underline font-semibold"
                >
                  Edit your response
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-[#0E4D4F] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full p-2.5 text-xs bg-[#FAF6F0] border border-[#C9A24B]/40 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E4D4F] mb-1">10-Digit Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={rsvpData.mobile}
                    onChange={(e) => setRsvpData({ ...rsvpData, mobile: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="e.g. 9876543210"
                    className="w-full p-2.5 text-xs bg-[#FAF6F0] border border-[#C9A24B]/40 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E4D4F] mb-1">Attendance</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["attending", "tentative", "decline"].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setRsvpData({ ...rsvpData, attendance: st })}
                        className={`p-2 rounded-xl border text-xs capitalize ${
                          rsvpData.attendance === st
                            ? "bg-[#0E4D4F] text-[#FAF6F0] font-bold"
                            : "bg-[#FAF6F0] text-stone-600"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E4D4F] mb-1">Number of Guests</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setRsvpData({ ...rsvpData, guestCount: Math.max(1, rsvpData.guestCount - 1) })}
                      className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#C9A24B] font-bold"
                    >
                      -
                    </button>
                    <span className="font-serif text-xl font-bold w-6 text-center">{rsvpData.guestCount}</span>
                    <button
                      type="button"
                      onClick={() => setRsvpData({ ...rsvpData, guestCount: Math.min(10, rsvpData.guestCount + 1) })}
                      className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#C9A24B] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E4D4F] mb-1">A Wish for the Couple</label>
                  <textarea
                    rows={3}
                    value={rsvpData.wishes}
                    onChange={(e) => setRsvpData({ ...rsvpData, wishes: e.target.value })}
                    placeholder="Write your heartfelt blessing..."
                    className="w-full p-2.5 text-xs bg-[#FAF6F0] border border-[#C9A24B]/40 rounded-xl outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#0E4D4F] text-[#FAF6F0] font-serif text-sm font-bold shadow-lg"
                >
                  Confirm RSVP
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 text-center bg-[radial-gradient(ellipse_at_top,#235b54,#082d2e_80%)] text-[#FAF6F0]">
          <p className="font-hindi text-base text-[#E3D3AE] mb-1">॥ मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः ॥</p>
          <p className="font-serif italic text-lg text-[#FAF6F0] mb-2">With love &amp; blessings, Aarav &amp; Meera</p>
          <div className="w-12 h-0.5 bg-[#C9A24B] mx-auto mb-3" />
          <p className="text-[11px] uppercase tracking-widest text-[#E3D3AE]/80 font-mono">
            Crafted with love by Aahvaaan by Vow &amp; Vision
          </p>
          <p className="text-[10px] text-[#C9A24B] mt-1 font-mono">Mor Pankh · № 01 · Jaipur, Rajasthan</p>
        </footer>
      </div>
    </div>
  );
}
