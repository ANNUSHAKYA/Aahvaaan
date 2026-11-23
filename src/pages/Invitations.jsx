import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import templates from '../data/templates';

export default function Invitations() {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-ivory/30">
      <div className="container-custom mx-auto px-4 sm:px-8 max-w-6xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-charcoal/60 hover:text-wine transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Page Heading */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wine/10 text-wine text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Sparkles size={13} className="text-gold" />
            <span>4 Signature Collections</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-2">
            All templates
          </h1>
          <p className="font-body text-xs sm:text-sm text-charcoal/60 max-w-xl">
            Every invitation experience we offer — each with its bespoke colour palette, traditional Indian lineages, and interactive guest RSVP experience.
          </p>
        </div>

        {/* 2x2 / 4-Card Responsive Grid with 3D Hover Depth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group"
            >
              <Link
                to={`/invitations/${template.id}`}
                className="bg-white rounded-3xl border border-champagne/60 shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col justify-between h-full cursor-pointer relative"
              >
                <div>
                  {/* Card Image Preview with 16:10 Aspect Ratio */}
                  <div className="relative aspect-[16/10] bg-champagne/20 overflow-hidden border-b border-champagne/40">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Collection Tag */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-champagne/50">
                      <span className="font-heading text-[11px] font-semibold text-wine tracking-wide">
                        {template.collection}
                      </span>
                    </div>

                    {/* Price Pill */}
                    <div className="absolute top-4 right-4 bg-wine text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {template.priceDisplay}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
                      {template.category}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-wine group-hover:text-gold transition-colors mb-2">
                      {template.name}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-6">
                      {template.shortDescription}
                    </p>

                    {/* 5 Signature Colour Swatches */}
                    <div className="pt-4 border-t border-champagne/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-charcoal/50 uppercase tracking-wider">
                          Signature Colour Palette
                        </span>
                        <span className="text-[10px] text-charcoal/40 font-mono">
                          5 Shades
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {template.colors.map((color, i) => (
                          <div
                            key={i}
                            className="relative group/swatch"
                          >
                            <div
                              className="w-6 h-6 rounded-full border border-champagne shadow-sm hover:scale-125 transition-transform cursor-pointer"
                              style={{ backgroundColor: color.hex }}
                              title={`${color.name} (${color.hex})`}
                            />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/swatch:block bg-wine text-white text-[10px] py-0.5 px-2 rounded-md whitespace-nowrap shadow-md z-20 pointer-events-none">
                              {color.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="px-6 sm:px-7 py-4 bg-ivory/50 border-t border-champagne/40 flex items-center justify-between">
                  <span className="text-xs font-semibold text-wine group-hover:text-gold transition-colors flex items-center gap-1">
                    <span>Preview & Customize</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white border border-champagne flex items-center justify-center text-charcoal/60 group-hover:bg-wine group-hover:text-white group-hover:border-wine transition-all shadow-2xs">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
