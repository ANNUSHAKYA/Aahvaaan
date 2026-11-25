import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { LotusCrest } from './MorPankhArt';

export default function DiaryCeremonies({
  events = [],
  onAddCalendar = () => {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback default 6 royal celebrations matching Mor Pankh Figma specifications
  const celebrationList = events.length > 0 ? events : [
    {
      name: 'Ring Ceremony',
      chapter: '01',
      tagline: 'A promise, a sparkle, a beginning',
      date: 'Thursday, 25 February 2027',
      time: '6:00 PM IST',
      venue: 'Sharma Residence, Jaipur',
      mapUrl: 'https://maps.google.com/?q=Sharma+Residence+Jaipur',
      dressCode: 'Indo-Western Glamour',
      icon: '💍',
      description: 'An intimate evening where rings are exchanged and two hearts make an eternal promise under golden chandeliers.'
    },
    {
      name: 'Haldi',
      chapter: '02',
      tagline: 'A little sunshine, a lot of love',
      date: 'Friday, 26 February 2027',
      time: '10:00 AM IST',
      venue: 'The Marigold Lawns, The Leela Palace',
      mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
      dressCode: 'Sunlight Yellows & Marigolds',
      icon: '✨',
      description: 'Sun-drenched laughter, fragrant turmeric, traditional folk songs, and flower showers with our dearest ones.'
    },
    {
      name: 'Mehendi',
      chapter: '03',
      tagline: 'Love, written in henna',
      date: 'Friday, 26 February 2027',
      time: '4:00 PM IST',
      venue: 'The Garden Pavilion, The Leela Palace',
      mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
      dressCode: 'Emerald & Mint Festive',
      icon: '🌿',
      description: 'Intricate Rajasthani henna designs celebrating love stories, accompanied by live shehnai and street food delicacies.'
    },
    {
      name: 'Sangeet',
      chapter: '04',
      tagline: 'An evening of song & celebration',
      date: 'Friday, 26 February 2027',
      time: '7:00 PM IST',
      venue: 'The Peacock Courtyard, The Leela Palace',
      mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
      dressCode: 'Royal Sparkle & Cocktail',
      icon: '🪕',
      description: 'High-energy choreography, family dance battles, DJ beats, and laughter that echoes into the starry Rajasthan night.'
    },
    {
      name: 'Vivaah',
      chapter: '05',
      tagline: 'Seven promises. One forever.',
      date: 'Saturday, 27 February 2027',
      time: '4:30 PM IST',
      venue: 'The Royal Courtyard, The Leela Palace',
      mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
      dressCode: 'Traditional Heritage Regal',
      icon: '🔥',
      description: 'Under the grand mandap with Vedic chants, the holy fire witnesses the sacred seven pheras uniting Aarav and Meera.'
    },
    {
      name: 'Reception',
      chapter: '06',
      tagline: 'To new beginnings, together',
      date: 'Saturday, 27 February 2027',
      time: '7:30 PM IST',
      venue: 'The Palace Ballroom, The Leela Palace',
      mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
      dressCode: 'Formal Tuxedo & Silks',
      icon: '🥂',
      description: 'A regal banquet dinner, heartfelt family toasts, and celebration of the newlyweds as they embark on life together.'
    },
  ];

  const currentEvent = celebrationList[currentIndex] || celebrationList[0];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % celebrationList.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + celebrationList.length) % celebrationList.length);
  };

  return (
    <section id="celebrations" className="py-16 px-4 sm:px-8 text-center relative overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <LotusCrest className="h-16 w-24 mx-auto mb-2 drop-shadow-xs" />
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-bold block mb-1">
          {celebrationList.length} Celebrations · A Thousand Memories
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl italic text-[#0E4D4F] mb-3">
          The Wedding Diary
        </h2>
        <p className="font-body text-xs sm:text-sm text-[#57534e] max-w-md mx-auto mb-8">
          Six beautiful chapters. Swipe through the moments that will become our favourite memories.
        </p>

        {/* Chapter Pills Carousel Selector */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {celebrationList.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                currentIndex === idx
                  ? 'bg-[#0E4D4F] text-[#FAF6F0] shadow-md scale-105'
                  : 'bg-white/80 text-[#57534e] hover:bg-white border border-[#C9A24B]/30'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Stacked 3D Card Stage (Swipe the card aside) */}
        <div className="relative min-h-[460px] flex items-center justify-center mb-6">
          {/* Background Card Silhouette for Stacked Depth */}
          <div
            className="absolute w-full max-w-[380px] h-[420px] rounded-3xl bg-[#0E4D4F]/10 border border-[#C9A24B]/30 transform rotate-3 translate-y-3 pointer-events-none"
          />
          <div
            className="absolute w-full max-w-[380px] h-[420px] rounded-3xl bg-[#082D2E]/10 border border-[#C9A24B]/20 transform -rotate-2 translate-y-2 pointer-events-none"
          />

          {/* Active Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              drag="x"
              dragConstraints={{ left: -100, right: 100 }}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -40) nextCard();
                else if (offset.x > 40) prevCard();
              }}
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-[400px] bg-[radial-gradient(ellipse_at_top,#fffdf5,#FBF5E9_65%,#eee3cc)] border-2 border-[#C9A24B] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-center cursor-grab active:cursor-grabbing"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-[#0E4D4F]/80 mb-3 border-b border-[#C9A24B]/30 pb-2">
                <span>CHAPTER {currentEvent.chapter || `0${currentIndex + 1}`}</span>
                <span>{currentIndex + 1} / {celebrationList.length}</span>
              </div>

              {/* Ceremony Icon / Badge */}
              <div className="w-16 h-16 rounded-full bg-[#0E4D4F]/10 border border-[#C9A24B] mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
                {currentEvent.icon || '✨'}
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#082D2E] mb-1">
                {currentEvent.name}
              </h3>

              <p className="font-serif text-xs italic text-[#C9A24B] mb-4">
                {currentEvent.tagline || 'A cherished celebration with family & friends'}
              </p>

              <div className="w-10 h-0.5 bg-[#C9A24B] mx-auto mb-4" />

              {/* Date & Time */}
              <div className="space-y-2 text-xs sm:text-sm text-[#0E4D4F] mb-4 font-medium">
                <div className="flex items-center justify-center gap-2">
                  <Calendar size={14} className="text-[#C9A24B]" />
                  <span>{currentEvent.date}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock size={14} className="text-[#C9A24B]" />
                  <span>{currentEvent.time}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={14} className="text-[#C9A24B]" />
                  <span>{currentEvent.venue}</span>
                </div>
              </div>

              {/* Dress Code Pill */}
              {currentEvent.dressCode && (
                <div className="inline-block px-3 py-1 rounded-full bg-[#0E4D4F]/10 border border-[#C9A24B]/50 text-[11px] font-semibold text-[#0E4D4F] mb-4">
                  Dress Code: {currentEvent.dressCode}
                </div>
              )}

              <p className="text-xs text-[#57534e] leading-relaxed mb-6 italic">
                "{currentEvent.description}"
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C9A24B]/30">
                <a
                  href={currentEvent.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(currentEvent.venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#C9A24B] text-[#0E4D4F] text-xs font-semibold hover:bg-[#FAF6F0] transition-colors shadow-xs"
                >
                  <Navigation size={13} className="text-[#C9A24B]" />
                  <span>Directions</span>
                </a>

                <button
                  onClick={() => onAddCalendar(currentEvent)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E4D4F] text-[#FAF6F0] text-xs font-semibold hover:bg-[#082D2E] transition-colors shadow-xs"
                >
                  <Calendar size={13} className="text-[#C9A24B]" />
                  <span>Calendar</span>
                </button>
              </div>

              {/* Swipe aside cue */}
              <span className="block text-[10px] text-[#57534e]/70 uppercase tracking-widest mt-4">
                ⇄ Swipe the card aside
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevCard}
            aria-label="Previous ceremony"
            className="w-10 h-10 rounded-full bg-white border border-[#C9A24B] text-[#0E4D4F] flex items-center justify-center shadow-md hover:bg-[#FAF6F0] transition-transform active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-mono text-[#0E4D4F] font-semibold">
            {currentIndex + 1} of {celebrationList.length}
          </span>
          <button
            onClick={nextCard}
            aria-label="Next ceremony"
            className="w-10 h-10 rounded-full bg-white border border-[#C9A24B] text-[#0E4D4F] flex items-center justify-center shadow-md hover:bg-[#FAF6F0] transition-transform active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
