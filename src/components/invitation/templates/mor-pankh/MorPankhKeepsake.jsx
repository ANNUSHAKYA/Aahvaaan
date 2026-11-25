import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { MorPankhFeather } from './MorPankhArt';

export default function MorPankhKeepsake({
  bride = 'Meera',
  groom = 'Aarav',
}) {
  const [noteIndex, setNoteIndex] = useState(0);

  const notes = [
    {
      number: '01 / 04',
      title: 'The Blessing of Elders',
      body: 'With the divine grace of Lord Ganesha and the cherished blessings of our parents and departed elders, two souls and two families unite in lifelong harmony and timeless love.',
      signature: 'With folded hands, The Sharmas & The Kapoors'
    },
    {
      number: '02 / 04',
      title: 'Two Families, One Sacred Bond',
      body: 'More than a union of two hearts, this celebration is a confluence of shared traditions, values, and memories that will be treasured across generations.',
      signature: 'Sunita & Rajesh · Kavita & Vikram'
    },
    {
      number: '03 / 04',
      title: 'Your Presence is Our Gift',
      body: 'Your presence, blessings, and warm smiles are the most priceless gift we could ever receive as we begin our new chapter together.',
      signature: 'Warmly, Aarav & Meera'
    },
    {
      number: '04 / 04',
      title: 'A Note From Our Hearts',
      body: 'Bring your blessings, your laughter, and your dancing shoes. The most precious part of our celebration will be having you there by our side.',
      signature: `With love, ${groom} & ${bride}`
    },
  ];

  const current = notes[noteIndex];

  return (
    <section className="py-16 px-4 sm:px-8 text-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top,#235b54,#082d2e_80%)] text-[#FAF6F0]">
      <div className="max-w-lg mx-auto relative z-10">
        <MorPankhFeather className="h-20 w-16 mx-auto mb-2 drop-shadow-md text-[#C9A24B]" />
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#E3D3AE] font-bold block mb-1">
          The Mor Pankh Keepsake
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl italic text-[#FAF6F0] mb-2">
          A Little Note, Just For You
        </h2>
        <div className="w-12 h-0.5 bg-[#C9A24B] mx-auto mb-8" />

        {/* Parchment Keepsake Note Card */}
        <div className="relative min-h-[300px] flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={noteIndex}
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -10 }}
              transition={{ duration: 0.35 }}
              className="w-full bg-[radial-gradient(ellipse_at_top_left,#fffdf5,#FBF5E9_60%,#eee3cc)] text-[#082D2E] p-7 sm:p-9 rounded-3xl border-2 border-[#C9A24B] shadow-2xl relative text-left"
            >
              {/* Note Header */}
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#0E4D4F] font-bold border-b border-[#C9A24B]/40 pb-3 mb-4">
                <span className="flex items-center gap-1.5">
                  <Bookmark size={14} className="text-[#C9A24B]" />
                  <span>Note {current.number}</span>
                </span>
                <span className="text-[10px] text-[#C9A24B] font-mono">
                  Aahvaaan · Mor Pankh
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0E4D4F] mb-3">
                {current.title}
              </h3>

              <p className="font-serif italic text-sm sm:text-base text-[#27665e] leading-relaxed mb-6">
                "{current.body}"
              </p>

              <div className="border-t border-[#C9A24B]/30 pt-3 flex items-center justify-between text-xs text-[#57534e]">
                <span className="italic font-medium">{current.signature}</span>
                <Sparkles size={14} className="text-[#C9A24B]" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center justify-between max-w-xs mx-auto text-xs text-[#E3D3AE]">
          <button
            onClick={() => setNoteIndex((prev) => (prev - 1 + notes.length) % notes.length)}
            className="flex items-center gap-1 hover:text-[#C9A24B] transition-colors py-2 px-3 rounded-full hover:bg-white/10"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <span className="font-mono text-xs">{noteIndex + 1} / {notes.length}</span>
          <button
            onClick={() => setNoteIndex((prev) => (prev + 1) % notes.length)}
            className="flex items-center gap-1 hover:text-[#C9A24B] transition-colors py-2 px-3 rounded-full hover:bg-white/10"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
