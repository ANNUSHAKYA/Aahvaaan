import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckSquare, Image as ImageIcon, Heart, Mail, Sparkles } from 'lucide-react';

export default function AuthIllustration() {
  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-6 bg-gradient-to-br from-[#FFFDFB] via-[#FAF6F0] to-[#F5ECE3] rounded-3xl overflow-hidden select-none">
      {/* Radiant Golden Ribbon Streams from Laptop to Cards (as seen in Balcony illustration) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 360 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="streamGrad1" x1="180" y1="320" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5D0A9" stopOpacity="0.8" />
            <stop stopColor="#FDE68A" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="streamGrad2" x1="180" y1="320" x2="300" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5D0A9" stopOpacity="0.8" />
            <stop stopColor="#FDE68A" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="streamGradCenter" x1="180" y1="320" x2="180" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E9D7CC" stopOpacity="0.7" />
            <stop stopColor="#FAF6F0" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Streaming Curving Bands */}
        <path
          d="M 180 300 C 140 250, 70 200, 75 70 C 85 200, 160 270, 180 300 Z"
          fill="url(#streamGrad1)"
        />
        <path
          d="M 180 300 C 220 250, 290 200, 285 70 C 275 200, 200 270, 180 300 Z"
          fill="url(#streamGrad2)"
        />
        <path
          d="M 160 300 C 130 220, 130 140, 150 90 C 170 140, 190 220, 200 300 Z"
          fill="url(#streamGradCenter)"
        />
      </svg>

      {/* Floating Paper Cards Container */}
      <div className="relative w-full max-w-[340px] h-[380px] flex items-center justify-center">
        {/* Card 1: Location (Top Left) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-2 left-3 bg-white/95 backdrop-blur-xs p-2.5 px-3.5 rounded-xl border border-champagne/80 shadow-md text-center transform -rotate-6 z-10"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1 border border-emerald-100">
            <MapPin size={15} />
          </div>
          <span className="font-heading text-[10px] font-bold text-charcoal/80 block">Location</span>
        </motion.div>

        {/* Card 2: Calendar (Top Right) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-2 right-4 bg-white/95 backdrop-blur-xs p-2.5 px-3.5 rounded-xl border border-champagne/80 shadow-md text-center transform rotate-6 z-10"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1 border border-blue-100">
            <Calendar size={15} />
          </div>
          <span className="font-heading text-[10px] font-bold text-charcoal/80 block">Calendar</span>
        </motion.div>

        {/* Card 3: RSVP (Middle Left - exactly matching Balcony screenshot) */}
        <motion.div
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-28 -left-2 bg-white/95 backdrop-blur-xs p-2.5 px-3.5 rounded-xl border border-champagne/80 shadow-md text-left transform -rotate-6 z-10"
        >
          <span className="font-heading text-[10px] font-bold text-charcoal block mb-1">RSVP</span>
          <div className="space-y-1 text-[9px] text-charcoal/80">
            <div className="flex items-center gap-1.5 font-medium text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-xs border border-emerald-600 bg-emerald-50 flex items-center justify-center text-[8px] font-bold">✓</span>
              <span>Yes</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-charcoal/60">
              <span className="w-2.5 h-2.5 rounded-xs border border-gray-300" />
              <span>No</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-charcoal/60">
              <span className="w-2.5 h-2.5 rounded-xs border border-gray-300" />
              <span>Maybe</span>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Photos (Middle Right) */}
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute top-28 -right-2 bg-white/95 backdrop-blur-xs p-2.5 px-3.5 rounded-xl border border-champagne/80 shadow-md text-center transform rotate-6 z-10"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-1 border border-rose-100">
            <ImageIcon size={15} />
          </div>
          <span className="font-heading text-[10px] font-bold text-charcoal/80 block">Photos</span>
        </motion.div>

        {/* Card 5: Ceremonies (Bottom Left) */}
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-16 left-2 bg-white/95 backdrop-blur-xs p-2.5 px-3.5 rounded-xl border border-champagne/80 shadow-md text-center transform -rotate-3 z-10"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-1 border border-amber-100">
            <Sparkles size={14} />
          </div>
          <span className="font-heading text-[9px] font-bold text-charcoal/80 block">Ceremonies</span>
        </motion.div>

        {/* Card 6: Greetings (Bottom Right) */}
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-16 right-2 bg-white/95 backdrop-blur-xs p-2.5 px-3.5 rounded-xl border border-champagne/80 shadow-md text-center transform rotate-3 z-10"
        >
          <div className="w-7 h-7 rounded-lg bg-wine/10 text-wine flex items-center justify-center mx-auto mb-1 border border-wine/20">
            <Mail size={14} />
          </div>
          <span className="font-heading text-[9px] font-bold text-charcoal/80 block">Greetings</span>
        </motion.div>

        {/* Central Devices Mockup: Laptop & Phone */}
        <div className="relative z-0 flex items-end justify-center pt-16">
          {/* Laptop Frame */}
          <div className="relative w-60 sm:w-68 bg-slate-800 rounded-t-xl p-2.5 pb-0 shadow-2xl border border-slate-700">
            {/* Screen */}
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#2A0510] via-[#4A0E1C] to-[#6B1D2F] rounded-t-lg p-3 flex flex-col items-center justify-center text-center relative overflow-hidden border border-gold/40">
              <span className="font-heading text-[8px] text-gold-light uppercase tracking-widest block mb-1">
                || ॐ श्री गणेशाय नमः ||
              </span>
              <h4 className="font-heading text-sm sm:text-base font-bold text-white leading-tight">
                You are Invited!
              </h4>
              <p className="font-body text-[8px] text-white/80 mt-1">
                Ananya & Kabir • Udaipur
              </p>
              <div className="w-10 h-0.5 bg-gold/70 rounded-full mt-2" />
            </div>
            {/* Keyboard base */}
            <div className="w-[114%] -left-[7%] relative h-3 bg-slate-300 rounded-b-lg shadow-md border-t border-slate-400" />
          </div>

          {/* Smartphone Frame (overlapping laptop on left) */}
          <div className="absolute -left-2 -bottom-2 w-18 sm:w-20 bg-slate-900 rounded-2xl p-1 shadow-2xl border-2 border-slate-700 z-20 transform -rotate-6">
            <div className="w-full aspect-[9/18] bg-ivory rounded-xl p-1.5 flex flex-col items-center justify-center text-center border border-champagne">
              <div className="w-4 h-4 rounded-full bg-wine/10 text-wine flex items-center justify-center mb-1">
                <Heart size={8} className="fill-wine text-wine" />
              </div>
              <span className="font-heading text-[7px] font-bold text-wine leading-tight">
                Personal Invite
              </span>
              <span className="text-[6px] text-charcoal/60 mt-0.5">The Sharmas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
