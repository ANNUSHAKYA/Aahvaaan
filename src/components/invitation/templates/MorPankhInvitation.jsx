import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, Sparkles, Calendar, MapPin, Clock,
  ChevronDown, ExternalLink, Navigation, Check, Heart, User
} from 'lucide-react';
import {
  PaperGrainFilter, MorPankhFeather, LotusCrest,
  ArchGoldenTrim, MorPankhFan
} from './mor-pankh/MorPankhArt';
import PetalDateReveal from './mor-pankh/PetalDateReveal';
import DiaryCeremonies from './mor-pankh/DiaryCeremonies';
import HangingPolaroids from './mor-pankh/HangingPolaroids';
import MorPankhKeepsake from './mor-pankh/MorPankhKeepsake';
import MorPankhRSVP from './mor-pankh/MorPankhRSVP';

export default function MorPankhInvitation({
  template = {},
  content = {},
  guestName: propGuestName,
  rsvpComponent = null,
}) {
  // ─── Extract Data-driven fields with Mor Pankh defaults ───
  const groom = content.groom || 'Aarav Sharma';
  const bride = content.bride || 'Meera Kapoor';
  const groomParents = content.groomParents || 'Sunita & Rajesh Sharma';
  const brideParents = content.brideParents || 'Kavita & Vikram Kapoor';
  const weddingDate = content.weddingDate || '2027-02-27';
  const location = content.location || 'Jaipur, Rajasthan';
  const venue = content.venue || 'The Leela Palace, Jaipur – Delhi Highway, NH 11, Kukas, Jaipur, Rajasthan 302028';
  const mapUrl = content.mapUrl || 'https://maps.google.com/?q=The+Leela+Palace+Jaipur';
  const coupleStory = content.coupleStory || '';
  const events = content.events && content.events.length > 0 ? content.events : [];
  const gallery = content.gallery && content.gallery.length > 0 ? content.gallery : [];

  // Guest Name personalization (fallback to royal default if not passed)
  const [guestName, setGuestName] = useState(propGuestName || 'Mr. Joshi and Family');
  useEffect(() => {
    if (propGuestName) setGuestName(propGuestName);
  }, [propGuestName]);

  // ─── Gate Animation State ───
  const [gatesOpen, setGatesOpen] = useState(false);

  // ─── Real Wedding Audio System ───
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const musicTrackUrl = content.musicTrack || '/templates/mor-pankh/media/music.mp3';

  const startMusic = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay policy fallback
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Pause when tab is hidden, resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying, isMuted]);

  // Handle "Welcome inside ↗" tap
  const handleOpenGate = () => {
    setGatesOpen(true);
    startMusic();
    setTimeout(() => {
      const el = document.getElementById('invitation-story');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 700);
  };

  // Add to Calendar helper
  const handleAddCalendar = (targetEvent) => {
    const eventName = targetEvent ? targetEvent.name : 'Wedding Celebration of Aarav & Meera';
    const eventDate = targetEvent ? targetEvent.date : weddingDate;
    const eventVenue = targetEvent ? targetEvent.venue : venue;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aahvaaan//MorPankh//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Wedding: ${bride} & ${groom} - ${eventName}`,
      `DESCRIPTION:Join us to celebrate the wedding celebrations of ${bride} and ${groom}.`,
      `LOCATION:${eventVenue}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${bride}_${groom}_${eventName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,#235b54,#082d2e_70%)] font-sans text-[#1c1917] selection:bg-[#C9A24B]/30 md:px-8 md:py-10">
      {/* Background Wedding Audio */}
      <audio ref={audioRef} src={musicTrackUrl} loop preload="auto" />

      {/* Top Header metadata pill (desktop) */}
      <div className="mx-auto mb-5 hidden max-w-[720px] items-center justify-between text-xs uppercase tracking-[0.2em] text-[#E3D3AE] md:flex">
        <span>The royal collection</span>
        <span>Mor Pankh · № 01</span>
      </div>

      {/* Main Parchment Canvas Container */}
      <div className="relative isolate mx-auto max-w-[720px] overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#fffdf5,#FBF5E9_45%,#eee3cc)] shadow-[0_30px_100px_#001c1c80]">
        <PaperGrainFilter />

        {/* ════════════════ HEADER BAR ════════════════ */}
        <header className="relative z-30 flex min-h-24 items-center justify-between border-b border-[#C9A24B]/30 px-6 md:px-10">
          <div className="text-[#0E4D4F]">
            <span className="font-serif text-2xl tracking-[0.06em]">
              aahvaaan<span className="text-[#C9A24B]">.</span>
            </span>
            <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-[#57534e]">
              by Vow &amp; Vision
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-right text-xs uppercase leading-5 tracking-[0.15em] text-[#0E4D4F] hidden sm:block">
              Mor Pankh<br />
              <span className="tracking-wider text-[#C9A24B] text-[10px]">A royal invitation</span>
            </span>

            {/* Persistent Audio Equalizer Pill */}
            <button
              onClick={toggleMute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E4D4F]/10 border border-[#C9A24B]/60 text-[#0E4D4F] hover:bg-[#0E4D4F]/20 transition-all text-xs shadow-xs"
              title={isMuted ? 'Unmute music' : 'Mute music'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span className="font-mono text-[10px] hidden sm:inline">
                {isMuted ? 'Muted' : 'Music'}
              </span>
              {!isMuted && isPlaying && (
                <span className="flex items-end gap-0.5 h-3 ml-0.5">
                  <span className="w-0.5 h-full bg-[#C9A24B] animate-pulse" />
                  <span className="w-0.5 h-2/3 bg-[#C9A24B] animate-pulse" />
                  <span className="w-0.5 h-4/5 bg-[#C9A24B] animate-pulse" />
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ════════════════ SECTION 0: OPENING 3D ARCH GATES ════════════════ */}
        <section className="relative px-5 pb-9 pt-7 text-center md:px-14">
          <p className="font-hindi text-lg text-[#0E4D4F] font-bold">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <p className="mb-6 mt-2 text-xs uppercase tracking-[0.23em] text-[#0E4D4F] font-medium">
            An auspicious beginning. An eternal bond.
          </p>

          {/* 3D Gate Stage (perspective: 1100px) */}
          <div className="relative mx-auto min-h-[560px] max-w-[430px] overflow-hidden rounded-t-[210px] border-2 border-[#C9A24B] bg-[radial-gradient(ellipse_at_50%_20%,#27665e,#0b3c3c_75%)] shadow-[0_15px_45px_#0e4d4f35] [perspective:1100px]">
            {/* Inner Sanctum Revealed Underneath Doors */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF6F0] px-8 text-center">
              <LotusCrest className="h-20 w-28 shrink-0 drop-shadow-md text-[#C9A24B]" />
              <p className="mt-5 font-serif text-3xl sm:text-4xl italic text-[#0E4D4F] leading-tight">
                A lifetime of love<br />awaits within.
              </p>
              <p className="mt-5 text-sm text-[#0E4D4F] font-medium">
                Welcome to our forever.
              </p>
              <div className="w-12 h-0.5 bg-[#C9A24B] my-4" />
              <p className="font-serif text-xl font-bold text-[#082D2E]">
                {groom} &amp; {bride}
              </p>
              <p className="text-xs uppercase tracking-widest text-[#C9A24B] mt-1 font-mono">
                27 February 2027 · Jaipur
              </p>
            </div>

            {/* Left Arch Door */}
            <div
              className="pointer-events-none absolute inset-y-0 w-1/2 overflow-hidden border-[#C9A24B]/70 bg-[radial-gradient(ellipse_at_top,#24655d,#0b3c3c)] transition-transform duration-1000 motion-reduce:transition-none left-0 origin-left border-r shadow-2xl"
              style={{
                transform: gatesOpen ? 'rotateY(-110deg)' : 'rotateY(0deg)',
              }}
            >
              <div className="absolute inset-y-0 w-[200%] left-0">
                <ArchGoldenTrim />
                <MorPankhFeather className="h-36 w-28 shrink-0 drop-shadow-[3px_5px_3px_#001e2550] absolute left-1/2 top-20 -translate-x-1/2 text-[#C9A24B]" />
                <div className="absolute inset-x-8 top-[270px] text-center text-[#FAF6F0]">
                  <p className="font-serif text-2xl italic tracking-wide">Together,</p>
                  <p className="mt-1 font-serif text-xl font-bold text-[#E3D3AE] leading-snug">
                    a beautiful forever
                  </p>
                  <p className="mt-3 text-xs tracking-[0.2em] text-[#C9A24B] uppercase">
                    {groom} &amp; {bride}
                  </p>
                  <p className="mt-1 text-[11px] text-[#E3D3AE]/80 font-mono">
                    27 February 2027 · Jaipur
                  </p>
                </div>
              </div>
            </div>

            {/* Right Arch Door */}
            <div
              className="pointer-events-none absolute inset-y-0 w-1/2 overflow-hidden border-[#C9A24B]/70 bg-[radial-gradient(ellipse_at_top,#24655d,#0b3c3c)] transition-transform duration-1000 motion-reduce:transition-none right-0 origin-right border-l shadow-2xl"
              style={{
                transform: gatesOpen ? 'rotateY(110deg)' : 'rotateY(0deg)',
              }}
            >
              <div className="absolute inset-y-0 w-[200%] right-0">
                <ArchGoldenTrim />
                <MorPankhFeather className="h-36 w-28 shrink-0 drop-shadow-[3px_5px_3px_#001e2550] absolute left-1/2 top-20 -translate-x-1/2 text-[#C9A24B]" />
                <div className="absolute inset-x-8 top-[270px] text-center text-[#FAF6F0]">
                  <p className="font-serif text-2xl italic tracking-wide">Together,</p>
                  <p className="mt-1 font-serif text-xl font-bold text-[#E3D3AE] leading-snug">
                    a beautiful forever
                  </p>
                  <p className="mt-3 text-xs tracking-[0.2em] text-[#C9A24B] uppercase">
                    {groom} &amp; {bride}
                  </p>
                  <p className="mt-1 text-[11px] text-[#E3D3AE]/80 font-mono">
                    27 February 2027 · Jaipur
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gate Opening Call-to-Action Button */}
          <div className="mt-7 flex flex-col items-center justify-center">
            <button
              onClick={handleOpenGate}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0E4D4F] text-[#FAF6F0] font-serif text-sm tracking-widest uppercase shadow-xl hover:bg-[#082D2E] hover:scale-105 active:scale-95 transition-all border border-[#C9A24B]/60 cursor-pointer"
            >
              <span>{gatesOpen ? 'Step inside ↓' : 'Welcome inside ↗'}</span>
              <Sparkles size={15} className="text-[#C9A24B]" />
            </button>
            <p className="mt-2 text-[11px] text-[#57534e] tracking-wider uppercase">
              A royal celebration. A deeply personal invitation.
            </p>
          </div>
        </section>

        {/* ════════════════ SECTION 1: "पधारो सा" ROYAL WELCOME ════════════════ */}
        <section id="invitation-story" className="relative px-5 py-12 text-center md:px-14 border-t border-[#C9A24B]/30 bg-white/40">
          <p className="font-hindi text-2xl sm:text-3xl font-bold text-[#0E4D4F] mb-1">
            पधारो सा
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24B] font-bold mb-8">
            A royal welcome, from the two of us
          </p>

          {/* Couple Namaste Avatar Motif */}
          <div className="relative mx-auto w-32 h-32 rounded-full border-2 border-[#C9A24B] p-1.5 shadow-xl bg-[radial-gradient(ellipse_at_top,#fffdf5,#FAF6F0)] mb-6 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0E4D4F]/10 flex flex-col items-center justify-center text-3xl">
              <span>🙏</span>
              <span className="text-[10px] font-hindi font-bold text-[#0E4D4F] mt-1">नमस्ते</span>
            </div>
            <div className="absolute -bottom-2 bg-[#0E4D4F] text-[#E3D3AE] text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full border border-[#C9A24B]">
              Royal Blessing
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#082D2E] mb-3">
            Namaste, {guestName}.
          </h3>
          <p className="font-serif italic text-base sm:text-lg text-[#0E4D4F] mb-2">
            Our joy begins with you.
          </p>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-md mx-auto leading-relaxed mb-6">
            With folded hands and full hearts, we welcome you to our wedding celebration.
          </p>
          <p className="font-serif text-lg font-bold text-[#0E4D4F]">
            {groom} &amp; {bride}
          </p>

          {/* Sticky Nav Anchor Bar */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-white/90 border border-[#C9A24B]/50 shadow-md text-xs font-semibold text-[#0E4D4F]">
            <a href="#celebrations" className="px-3.5 py-1.5 rounded-full hover:bg-[#0E4D4F] hover:text-[#FAF6F0] transition-colors">
              Celebrations
            </a>
            <span>•</span>
            <a href="#venue" className="px-3.5 py-1.5 rounded-full hover:bg-[#0E4D4F] hover:text-[#FAF6F0] transition-colors">
              Venue
            </a>
            <span>•</span>
            <a href="#rsvp" className="px-3.5 py-1.5 rounded-full hover:bg-[#0E4D4F] hover:text-[#FAF6F0] transition-colors">
              RSVP
            </a>
          </div>
        </section>

        {/* ════════════════ SECTION 2: FORMAL WEDDING INVITATION ════════════════ */}
        <section className="relative px-6 py-14 text-center border-t border-[#C9A24B]/30">
          <MorPankhFan className="h-40 w-48 shrink-0 drop-shadow-[0_7px_5px_#082d2e40] mx-auto mb-4" />

          <p className="text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-bold mb-2">
            Together with our families
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#082D2E] mb-1">
            {groom} &amp; {bride}
          </h2>
          <p className="font-serif italic text-base text-[#0E4D4F] mb-5">
            invite you to celebrate their wedding
          </p>

          <div className="w-16 h-0.5 bg-[#C9A24B] mx-auto mb-5" />

          <div className="inline-block px-6 py-2 rounded-2xl bg-[#0E4D4F]/10 border border-[#C9A24B]/60 text-[#082D2E] font-serif text-sm tracking-widest uppercase mb-10">
            ❧ 27 FEBRUARY 2027 · JAIPUR, RAJASTHAN
          </div>

          {/* Two Family Lineage Cards (Groom Sharmas / Bride Kapoors) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto text-center">
            {/* Groom's Family */}
            <div className="p-6 rounded-2xl bg-white/70 border border-[#C9A24B]/40 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A24B] block mb-1">
                The Groom's Family
              </span>
              <h4 className="font-serif text-xl font-bold text-[#082D2E] mb-1">
                The Sharmas
              </h4>
              <p className="text-xs text-[#0E4D4F] font-medium mb-3">
                {groomParents}
              </p>
              <div className="border-t border-[#C9A24B]/20 pt-2">
                <span className="text-[11px] italic text-[#57534e]">
                  Beloved son, {groom}
                </span>
              </div>
            </div>

            {/* Bride's Family */}
            <div className="p-6 rounded-2xl bg-white/70 border border-[#C9A24B]/40 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A24B] block mb-1">
                The Bride's Family
              </span>
              <h4 className="font-serif text-xl font-bold text-[#082D2E] mb-1">
                The Kapoors
              </h4>
              <p className="text-xs text-[#0E4D4F] font-medium mb-3">
                {brideParents}
              </p>
              <div className="border-t border-[#C9A24B]/20 pt-2">
                <span className="text-[11px] italic text-[#57534e]">
                  Beloved daughter, {bride}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ SECTION 3: INTERACTIVE PETAL DATE REVEAL ════════════════ */}
        <section className="border-t border-[#C9A24B]/30 bg-white/30">
          <PetalDateReveal
            weddingDate={weddingDate}
            formattedDate="Saturday, 27 February 2027"
            time="4:30 PM IST"
            location={location}
            venue={venue}
            onAddCalendar={() => handleAddCalendar()}
          />
        </section>

        {/* ════════════════ SECTION 4: KEEPSAKE NOTES READER ════════════════ */}
        <MorPankhKeepsake bride={bride} groom={groom} />

        {/* ════════════════ SECTION 5: CELEBRATIONS / WEDDING DIARY ════════════════ */}
        <DiaryCeremonies
          events={events}
          onAddCalendar={handleAddCalendar}
        />

        {/* ════════════════ SECTION 6: THE LEELA PALACE VENUE MAP ════════════════ */}
        <section id="venue" className="py-16 px-5 sm:px-8 text-center border-t border-[#C9A24B]/30 bg-[radial-gradient(ellipse_at_top,#fffdf5,#FAF6F0)]">
          <div className="max-w-xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-bold block mb-1">
              ⌖ Illustrative Map &amp; Directions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl italic text-[#0E4D4F] mb-2">
              Venue &amp; Schedule
            </h2>
            <p className="text-xs text-[#57534e] mb-8">
              A royal setting. An unforgettable celebration.
            </p>

            {/* Venue Illustration Card */}
            <div className="bg-white rounded-3xl border-2 border-[#C9A24B] p-7 sm:p-9 shadow-xl text-center">
              <div className="w-16 h-16 rounded-full bg-[#0E4D4F]/10 border border-[#C9A24B] mx-auto flex items-center justify-center text-3xl mb-4">
                🏰
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#082D2E] mb-2">
                The Leela Palace, Jaipur
              </h3>
              <p className="text-xs sm:text-sm text-[#0E4D4F] leading-relaxed mb-6 font-medium">
                Jaipur–Delhi Highway, NH 11 Kukas, Jaipur, Rajasthan 302028
              </p>

              <div className="w-12 h-0.5 bg-[#C9A24B] mx-auto mb-6" />

              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0E4D4F] text-[#FAF6F0] text-xs font-semibold tracking-wider hover:bg-[#082D2E] shadow-md hover:scale-105 transition-all"
              >
                <Navigation size={14} className="text-[#C9A24B]" />
                <span>Open in Google Maps ↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* ════════════════ SECTION 7: HANGING POLAROIDS LOVE STORY ════════════════ */}
        <HangingPolaroids
          photos={gallery}
          coupleStory={coupleStory}
        />

        {/* ════════════════ SECTION 8: COMPLETE GUEST RSVP ════════════════ */}
        <section id="rsvp" className="py-16 px-4 sm:px-8 border-t border-[#C9A24B]/30 bg-[#FAF6F0]">
          <div className="max-w-2xl mx-auto">
            {rsvpComponent ? (
              <div className="bg-white/95 rounded-3xl border border-[#C9A24B] p-6 shadow-xl">
                {rsvpComponent}
              </div>
            ) : (
              <MorPankhRSVP
                events={events}
                coupleName={`${groom} & ${bride}`}
                invitationId="mor-pankh"
              />
            )}
          </div>
        </section>

        {/* ════════════════ REGAL FOOTER ════════════════ */}
        <footer className="py-12 px-6 text-center border-t border-[#C9A24B]/40 bg-[radial-gradient(ellipse_at_top,#235b54,#082d2e_80%)] text-[#FAF6F0]">
          <LotusCrest className="h-16 w-24 mx-auto mb-3 text-[#C9A24B]" />
          <p className="font-hindi text-base text-[#E3D3AE] mb-1">
            ॥ मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः ॥
          </p>
          <p className="font-serif italic text-lg sm:text-xl text-[#FAF6F0] mb-3">
            With love &amp; blessings, {groom} &amp; {bride}
          </p>
          <div className="w-12 h-0.5 bg-[#C9A24B] mx-auto mb-4" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#E3D3AE]/80 font-mono">
            Crafted with love by Aahvaaan by Vow &amp; Vision
          </p>
          <p className="text-[10px] text-[#C9A24B] mt-1 font-mono">
            Mor Pankh · № 01 · Jaipur, Rajasthan
          </p>
        </footer>
      </div>
    </div>
  );
}
