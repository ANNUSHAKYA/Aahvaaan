import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckSquare, Image as ImageIcon, Heart, Mail, Sparkles } from 'lucide-react';

export default function AuthIllustration() {
  return (
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[420px] flex items-center justify-center p-6 bg-gradient-to-br from-ivory via-champagne/20 to-ivory rounded-3xl overflow-hidden">
      {/* Soft warm radiating background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      {/* Floating Paper Cards */}
      <div className="relative w-full max-w-[320px] h-[340px] flex items-center justify-center">
        {/* Card 1: Location (Top Left) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 left-2 bg-white/95 backdrop-blur-xs p-2.5 px-3 rounded-xl border border-champagne/80 shadow-md text-center transform -rotate-6 z-10"
        >
          <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
            <MapPin size={13} />
          </div>
          <span className="font-heading text-[10px] font-bold text-wine block">Location</span>
        </motion.div>

        {/* Card 2: Calendar (Top Right) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs p-2.5 px-3 rounded-xl border border-champagne/80 shadow-md text-center transform rotate-6 z-10"
        >
          <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1">
            <Calendar size={13} />
          </div>
          <span className="font-heading text-[10px] font-bold text-wine block">Calendar</span>
        </motion.div>

        {/* Card 3: RSVP (Middle Left) */}
        <motion.div
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-28 -left-3 bg-white/95 backdrop-blur-xs p-2.5 px-3 rounded-xl border border-champagne/80 shadow-md text-left transform -rotate-12 z-10"
        >
          <span className="font-heading text-[10px] font-bold text-wine block mb-1">RSVP</span>
          <div className="space-y-0.5 text-[8px] text-charcoal/70">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs border border-emerald-600 bg-emerald-500/20 text-emerald-700 flex items-center justify-center text-[7px]">✓</span>
              <span>Attending</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs border border-charcoal/40" />
              <span>Maybe</span>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Photos (Middle Right) */}
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute top-28 -right-3 bg-white/95 backdrop-blur-xs p-2.5 px-3 rounded-xl border border-champagne/80 shadow-md text-center transform rotate-12 z-10"
        >
          <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-1">
            <ImageIcon size={13} />
          </div>
          <span className="font-heading text-[10px] font-bold text-wine block">Photos</span>
        </motion.div>

        {/* Card 5: Greetings (Bottom Right) */}
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-12 right-2 bg-white/95 backdrop-blur-xs p-2 px-3 rounded-xl border border-champagne/80 shadow-md text-center transform rotate-3 z-10"
        >
          <div className="w-5 h-5 rounded-md bg-wine/10 text-wine flex items-center justify-center mx-auto mb-1">
            <Mail size={12} />
          </div>
          <span className="font-heading text-[9px] font-bold text-wine block">Greetings</span>
        </motion.div>

        {/* Card 6: Ceremonies (Bottom Left) */}
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-12 left-2 bg-white/95 backdrop-blur-xs p-2 px-3 rounded-xl border border-champagne/80 shadow-md text-center transform -rotate-3 z-10"
        >
          <div className="w-5 h-5 rounded-md bg-gold/20 text-gold-dark flex items-center justify-center mx-auto mb-1">
            <Sparkles size={12} />
          </div>
          <span className="font-heading text-[9px] font-bold text-wine block">Ceremonies</span>
        </motion.div>

        {/* Central Devices Mockup: Laptop & Phone */}
        <div className="relative z-0 flex items-end justify-center pt-8">
          {/* Laptop Frame */}
          <div className="relative w-56 sm:w-64 bg-slate-800 rounded-t-xl p-2 pb-0 shadow-2xl border border-slate-700">
            {/* Screen */}
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#2A0510] via-[#4A0E1C] to-[#6B1D2F] rounded-t-md p-3 flex flex-col items-center justify-center text-center relative overflow-hidden border border-gold/30">
              <span className="font-heading text-[9px] text-gold-light uppercase tracking-widest block mb-0.5">
                || ॐ श्री गणेशाय नमः ||
              </span>
              <h4 className="font-heading text-xs sm:text-sm font-bold text-white leading-tight">
                You are Invited!
              </h4>
              <p className="font-body text-[8px] text-white/70 mt-0.5">
                Ananya & Kabir • Udaipur
              </p>
              <div className="w-8 h-0.5 bg-gold/60 rounded-full mt-1.5" />
            </div>
            {/* Keyboard base */}
            <div className="w-[110%] -left-[5%] relative h-2.5 bg-slate-300 rounded-b-md shadow-xs" />
          </div>

          {/* Smartphone Frame (overlapping laptop on left) */}
          <div className="absolute -left-2 -bottom-2 w-16 sm:w-20 bg-slate-900 rounded-2xl p-1 shadow-2xl border-2 border-slate-700 z-20 transform -rotate-6">
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
