import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, ArrowRight } from 'lucide-react';
import { Link } from '../../lib/router-compat';

/**
 * Traditional Brass Diya SVG Icon with dynamic flame animation
 */
function DiyaLamp({ isLit, onToggle, label, index }) {
  return (
    <div className="flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative focus:outline-none group p-2.5 min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer touch-manipulation"
        aria-label={`Light diya ${index + 1}: ${label}`}
      >
        {/* Animated Flame when Lit */}
        <AnimatePresence>
          {isLit && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 8 }}
              animate={{
                scale: [1, 1.15, 0.95, 1.1, 1],
                opacity: 1,
                y: [0, -3, -1, -4, 0],
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 1.6 + index * 0.2,
                ease: 'easeInOut',
              }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
            >
              {/* Outer Amber Flame Glow */}
              <div className="w-9 h-11 bg-gradient-to-t from-[#FF4500] via-[#FFA500] to-[#FFE600] rounded-full blur-[2px] opacity-90" />
              {/* Inner Bright Core */}
              <div className="absolute bottom-1 w-3 h-6 bg-white rounded-full blur-[1px] opacity-95" />
              {/* Ambient radial lighting halo */}
              <div className="absolute -top-3 w-16 h-16 bg-amber-400/40 rounded-full blur-md" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unlit Wick indicator if not lit */}
        {!isLit && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-charcoal/60 rounded-full group-hover:bg-amber-600 transition-colors" />
        )}

        {/* Ornate Brass Diya Base */}
        <svg
          viewBox="0 0 72 44"
          className="w-14 sm:w-16 h-9 sm:h-10 drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`diyaGold-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFF2A3" />
              <stop offset="40%" stop-color="#D4AF37" />
              <stop offset="85%" stop-color="#996515" />
              <stop offset="100%" stop-color="#5B3908" />
            </linearGradient>
            <radialGradient id={`diyaRim-${index}`} cx="50%" cy="30%" r="50%">
              <stop offset="0%" stop-color="#FFE885" />
              <stop offset="100%" stop-color="#AA7C11" />
            </radialGradient>
          </defs>

          {/* Diya Oil Well Bowl */}
          <path
            d="M8 14 C14 36, 58 36, 64 14 C56 22, 16 22, 8 14 Z"
            fill={`url(#diyaGold-${index})`}
            stroke="#F7E2A9"
            strokeWidth="1.2"
          />
          {/* Diya Spout / Lip */}
          <ellipse
            cx="36"
            cy="14"
            rx="28"
            ry="6"
            fill={`url(#diyaRim-${index})`}
            stroke="#F7E2A9"
            strokeWidth="0.8"
          />
          {/* Center oil depression */}
          <ellipse
            cx="36"
            cy="14"
            rx="22"
            ry="3.5"
            fill={isLit ? '#782800' : '#3E1C0A'}
          />
          {/* Traditional Pedestal Base */}
          <path
            d="M26 34 L46 34 L48 40 L24 40 Z"
            fill={`url(#diyaGold-${index})`}
            stroke="#AA7C11"
            strokeWidth="0.8"
          />
        </svg>
      </motion.button>

      <span
        className={`text-[10px] sm:text-xs font-semibold tracking-wide transition-colors ${
          isLit ? 'text-amber-200' : 'text-white/60'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Interactive Diya Hero Hook
 * Mobile-first interactive invitation preview above the fold.
 */
export default function InteractiveDiyaHook() {
  const [litDiyas, setLitDiyas] = useState([false, false, false]);

  const toggleDiya = (idx) => {
    setLitDiyas((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const lightAll = () => {
    setLitDiyas([true, true, true]);
  };

  const resetAll = () => {
    setLitDiyas([false, false, false]);
  };

  const allLit = litDiyas.every(Boolean);
  const litCount = litDiyas.filter(Boolean).length;

  return (
    <div className="w-full max-w-md mx-auto text-center font-body my-2">
      {/* Container Card with subtle glassmorphism */}
      <div className="relative rounded-3xl bg-black/35 backdrop-blur-md border border-gold/40 p-4 sm:p-5 shadow-2xl overflow-hidden">
        {/* Soft Golden Shimmer Background */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-wine/30 rounded-full blur-2xl pointer-events-none" />

        {/* Top Hint Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] font-semibold mb-3">
          <Sparkles size={12} className="text-amber-300 animate-pulse" />
          <span>
            {allLit
              ? '✨ Sacred Flame Lit • Invitation Unveiled'
              : litCount > 0
              ? `Tap all 3 diyas to reveal (${litCount}/3 lit)`
              : 'Tap the diyas to reveal the date'}
          </span>
        </div>

        {/* Diyas Row */}
        <div className="flex items-center justify-center gap-4 sm:gap-7 my-3 pt-4">
          <DiyaLamp
            index={0}
            isLit={litDiyas[0]}
            onToggle={() => toggleDiya(0)}
            label="Mangalam"
          />
          <DiyaLamp
            index={1}
            isLit={litDiyas[1]}
            onToggle={() => toggleDiya(1)}
            label="Vivaah"
          />
          <DiyaLamp
            index={2}
            isLit={litDiyas[2]}
            onToggle={() => toggleDiya(2)}
            label="Shubharambh"
          />
        </div>

        {/* Helper Action Link */}
        {!allLit && (
          <button
            type="button"
            onClick={lightAll}
            className="text-xs text-amber-300 hover:text-amber-200 underline font-medium mt-1 mb-2 transition-colors cursor-pointer py-1.5 min-h-[44px] inline-flex items-center"
          >
            Or tap here to light all three at once
          </button>
        )}

        {/* Revealed Invitation Scroll */}
        <AnimatePresence>
          {allLit && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.94 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.94 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mt-4 pt-4 border-t border-gold/30 text-left"
            >
              <div className="bg-gradient-to-br from-[#FAF7F2] to-[#E9D8CC] text-charcoal rounded-2xl p-4 sm:p-5 border border-gold/50 shadow-inner relative">
                {/* Traditional corner filigree accents */}
                <div className="absolute top-2 right-2 text-gold text-xs">❖</div>
                <div className="absolute top-2 left-2 text-gold text-xs">❖</div>

                <div className="text-center">
                  <span className="font-heading italic text-xs text-wine tracking-widest block mb-0.5">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  <h4 className="font-heading text-lg sm:text-xl font-bold text-wine tracking-wide">
                    Save The Date
                  </h4>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-1.5" />
                  <p className="font-heading text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    Ananya <span className="text-gold font-light">&amp;</span> Kabir
                  </p>
                  <p className="font-body text-sm font-semibold text-wine mt-1">
                    Monday, 22 February 2027
                  </p>
                  <p className="font-body text-xs text-gray-700">
                    The Oberoi Udaivilas • Udaipur, Rajasthan
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-3.5 pt-3 border-t border-amber-900/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="min-h-[44px] inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-xl"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>

                  <Link
                    to="/templates/mor-pankh"
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-wine to-[#8C3A50] hover:brightness-110 text-white text-xs font-semibold shadow-md border border-[#B69A70]/50 transition-all active:scale-95"
                  >
                    <span>Experience Mor Pankh Live</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
