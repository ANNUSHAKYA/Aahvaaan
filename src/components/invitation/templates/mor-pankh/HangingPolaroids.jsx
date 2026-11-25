import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Sparkles } from 'lucide-react';

export default function HangingPolaroids({
  photos = [],
  coupleStory = '',
}) {
  const defaultFrames = [
    {
      type: 'photo',
      tag: '#howitstarted',
      title: 'First spark',
      image: photos[0] || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&fit=crop&q=80',
    },
    {
      type: 'story',
      text: coupleStory || 'Friendship grew into something more, and we realized life’s best moments were the ones we shared together.',
      author: 'Aarav & Meera',
    },
    {
      type: 'photo',
      tag: '#adventures',
      title: 'Our travels',
      image: photos[1] || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&fit=crop&q=80',
    },
    {
      type: 'photo',
      tag: '#thelittlethings',
      title: 'Quiet joys',
      image: photos[2] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop&q=80',
    },
    {
      type: 'story',
      text: 'From quiet morning chai talks to dancing under city lights, every ordinary day turned into an extraordinary memory.',
      author: 'Our Forever',
    },
    {
      type: 'photo',
      tag: '#foreverbegins',
      title: 'Two hearts, one soul',
      image: photos[3] || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,#fffdf5,#FBF5E9_60%,#eee3cc)] border-y border-[#C9A24B]/30">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-bold block mb-1">
          The Art of Becoming Us
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl italic text-[#0E4D4F] mb-3">
          A Love Story in Little Frames
        </h2>
        <p className="font-body text-xs sm:text-sm text-[#57534e] max-w-md mx-auto">
          Not just photographs. The feelings, the laughter, and the moments we’ll cherish forever.
        </p>
      </div>

      {/* Hanging Line (Rope/String with clips) */}
      <div className="relative max-w-5xl mx-auto">
        {/* Horizontal String Bar */}
        <div className="h-1 bg-[#854d0e]/60 rounded-full w-full shadow-xs mb-[-12px] relative z-10" />

        {/* Scrollable Polaroid Gallery Container */}
        <div className="flex items-start gap-6 sm:gap-8 overflow-x-auto pt-4 pb-8 px-4 no-scrollbar snap-x snap-mandatory">
          {defaultFrames.map((frame, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="snap-center shrink-0 flex flex-col items-center"
            >
              {/* Wooden Peg / Clip */}
              <div className="w-3.5 h-6 bg-[#b45309] rounded-xs shadow-md border border-[#78350f] relative z-20 mb-[-6px]" />

              {/* Hanging String piece */}
              <div className="w-0.5 h-4 bg-[#854d0e] mb-[-2px]" />

              {/* Card Container */}
              {frame.type === 'photo' ? (
                <div
                  className="w-[240px] sm:w-[260px] bg-white p-3.5 pb-6 rounded-md shadow-xl border border-[#C9A24B]/40 transform hover:rotate-0 transition-transform duration-300"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? '-2deg' : '2.5deg'})`,
                  }}
                >
                  {/* Photo Slot */}
                  <div className="aspect-[4/5] bg-[#FAF6F0] rounded-xs overflow-hidden relative border border-black/5 shadow-inner mb-3 group">
                    <img
                      src={frame.image}
                      alt={frame.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Caption Hashtag */}
                  <div className="text-center">
                    <span className="font-serif italic font-bold text-[#854d0e] text-sm tracking-wide">
                      {frame.tag}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="w-[240px] sm:w-[260px] min-h-[320px] bg-[radial-gradient(ellipse_at_top,#fffdf5,#FAF6F0)] p-6 rounded-md shadow-xl border border-[#C9A24B]/60 flex flex-col justify-between text-center transform hover:rotate-0 transition-transform duration-300"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                  }}
                >
                  <Sparkles size={18} className="text-[#C9A24B] mx-auto mt-2" />
                  <p className="font-serif italic text-sm sm:text-base text-[#0E4D4F] leading-relaxed my-auto">
                    "{frame.text}"
                  </p>
                  <div className="border-t border-[#C9A24B]/40 pt-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#57534e] font-semibold">
                      {frame.author}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Swipe cue */}
        <div className="text-center mt-2">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#C9A24B]/40 text-xs text-[#0E4D4F] font-medium shadow-xs">
            <span>‹‹‹</span>
            <span>Swipe for more memories</span>
            <span>›››</span>
          </span>
        </div>
      </div>
    </section>
  );
}
