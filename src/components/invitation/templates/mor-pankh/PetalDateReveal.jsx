import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Clock, MapPin } from 'lucide-react';
import { MorPankhFeather } from './MorPankhArt';

export default function PetalDateReveal({
  weddingDate = '2027-02-27',
  formattedDate = 'Saturday, 27 February 2027',
  time = '4:30 PM IST',
  location = 'Jaipur, Rajasthan',
  venue = 'The Royal Courtyard, The Leela Palace, Jaipur',
  onAddCalendar = () => {},
}) {
  const [revealed, setRevealed] = useState(false);
  const [clearedCount, setClearedCount] = useState(0);

  // Generate 28 playful petals / feathers
  const [petals, setPetals] = useState(() => {
    const list = [];
    const colors = [
      '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3',
      '#ffe4e6', '#fbbf24', '#f59e0b', '#235b54', '#27665e'
    ];
    for (let i = 0; i < 30; i++) {
      list.push({
        id: i,
        x: (Math.random() - 0.5) * 280,
        y: (Math.random() - 0.5) * 140,
        rotation: Math.random() * 360,
        scale: 0.7 + Math.random() * 0.6,
        color: colors[i % colors.length],
        cleared: false,
      });
    }
    return list;
  });

  const handleClearPetal = (id) => {
    setPetals(prev => {
      const next = prev.map(p => p.id === id ? { ...p, cleared: true } : p);
      const remaining = next.filter(p => !p.cleared).length;
      if (remaining <= 8) setRevealed(true);
      return next;
    });
    setClearedCount(c => c + 1);
  };

  const handleRevealAll = () => {
    setPetals(prev => prev.map(p => ({ ...p, cleared: true })));
    setRevealed(true);
  };

  // Live countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calculate = () => {
      const target = new Date(weddingDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  return (
    <div className="relative py-12 px-4 sm:px-8 text-center overflow-hidden">
      <div className="max-w-xl mx-auto">
        <span className="font-hindi text-sm text-[#0E4D4F] tracking-widest block mb-1">
          शुभ विवाह मुहूर्त
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl italic text-[#0E4D4F] mb-3">
          Move the petals to reveal the Grand Date!
        </h3>
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24B] mb-8 font-medium">
          A Day Written in the Stars
        </p>

        {/* Interactive Petal Mound / Unveiled Card */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          {/* Revealed Content Underneath */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: revealed ? 1 : 0.85, scale: revealed ? 1 : 0.97 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[#C9A24B]/60 bg-[radial-gradient(ellipse_at_top,#fffdf5,#FBF5E9_60%,#eee3cc)] shadow-xl relative z-10"
          >
            <div className="w-12 h-0.5 bg-[#C9A24B] mx-auto mb-4" />
            <span className="text-[11px] uppercase font-bold tracking-[0.22em] text-[#0E4D4F]/80 block mb-2">
              Save Our Date
            </span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#082D2E] mb-2 tracking-wide">
              {formattedDate}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#235B54] font-medium mb-6">
              <Clock size={15} className="text-[#C9A24B]" />
              <span>{time}</span>
              <span>•</span>
              <MapPin size={15} className="text-[#C9A24B]" />
              <span>{location}</span>
            </div>

            {/* Live Countdown Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.minutes },
                { label: 'Secs', val: timeLeft.seconds },
              ].map((box, i) => (
                <div key={i} className="bg-white/80 border border-[#C9A24B]/30 rounded-2xl p-2.5 shadow-xs">
                  <span className="block font-serif text-xl sm:text-2xl font-bold text-[#0E4D4F]">
                    {box.val}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#57534e]">
                    {box.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Add to Calendar Action */}
            <button
              onClick={onAddCalendar}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0E4D4F] text-[#FAF6F0] text-xs font-semibold tracking-wider hover:bg-[#082D2E] transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <Calendar size={14} className="text-[#C9A24B]" />
              <span>Add to calendar ＋</span>
            </button>
          </motion.div>

          {/* Interactive Floating Petals Layer */}
          <AnimatePresence>
            {!revealed && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto">
                {petals.map(p => (
                  !p.cleared && (
                    <motion.div
                      key={p.id}
                      onClick={() => handleClearPetal(p.id)}
                      onHoverStart={() => handleClearPetal(p.id)}
                      drag
                      dragConstraints={{ left: -150, right: 150, top: -100, bottom: 100 }}
                      onDragEnd={() => handleClearPetal(p.id)}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        x: p.x,
                        y: p.y,
                        rotate: p.rotation,
                        scale: p.scale,
                        opacity: 0.95,
                      }}
                      exit={{
                        y: p.y + 120,
                        opacity: 0,
                        scale: 0.3,
                        rotate: p.rotation + 60,
                        transition: { duration: 0.5 },
                      }}
                      whileHover={{ scale: 1.25, rotate: p.rotation + 25 }}
                      className="absolute cursor-pointer select-none filter drop-shadow-md"
                      title="Swipe or click to clear"
                    >
                      {/* Rose petal shape or peacock feather */}
                      <div
                        className="w-10 h-14 rounded-full transition-transform"
                        style={{
                          background: `radial-gradient(circle at 40% 30%, #fff 0%, ${p.color} 70%, #881337 100%)`,
                          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                          transform: 'rotate(15deg)',
                        }}
                      />
                    </motion.div>
                  )
                ))}

                {/* Helpful Prompt Pill */}
                <motion.button
                  onClick={handleRevealAll}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute bottom-2 z-30 px-5 py-2 rounded-full bg-[#082D2E]/90 text-[#E3D3AE] text-xs font-semibold tracking-wider shadow-lg backdrop-blur-md border border-[#C9A24B]/50 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#C9A24B] animate-spin" />
                  <span>Tap to reveal the date instantly</span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
