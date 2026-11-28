import { Link } from '../lib/router-compat';
import { Eye, ShoppingBag, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TemplateCard({ template, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white rounded-[24px] overflow-hidden border border-champagne/70 hover:border-gold/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Landscape Mockup Preview (Matching Loom Video 16:10 aspect ratio) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-champagne/30">
        <Link
          to={`/templates/${template.id}`}
          className="block w-full h-full relative"
          aria-label={`Preview ${template.name}`}
        >
          <img
            src={template.image}
            alt={`${template.name} – ${template.collection}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" fill="${template.palette.warmIvory || '#FAF6F0'}"><rect width="800" height="500"/><text x="400" y="230" text-anchor="middle" font-family="Georgia" font-size="36" fill="${template.themeStyles.textPrimary || '#512D38'}">${template.name}</text><text x="400" y="275" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#65575A">${template.collection}</text></svg>`
              )}`;
            }}
          />

          {/* Soft hover glow */}
          <div className="absolute inset-0 bg-wine/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>

        {/* Collection Badge (Top-Left) */}
        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-champagne/60">
          <span className="font-heading text-[11px] tracking-wider uppercase font-semibold text-wine">
            {template.collection}
          </span>
        </div>

        {/* Starting Price Pill (Top-Right) */}
        <div className="absolute top-3.5 right-3.5 bg-wine text-white px-3 py-1 rounded-full shadow-xs text-xs font-semibold tracking-wide">
          {template.priceDisplay}
        </div>
      </div>

      {/* Card Info & Actions */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Collection Subtitle & Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold font-bold block mb-1">
                {template.category}
              </span>
              <h3 className="font-heading text-2xl font-bold text-wine group-hover:text-gold transition-colors">
                <Link to={`/templates/${template.id}`}>
                  {template.name}
                </Link>
              </h3>
            </div>
            <Link
              to={`/templates/${template.id}`}
              className="w-8 h-8 rounded-full bg-ivory border border-champagne/80 flex items-center justify-center text-charcoal/60 hover:text-wine hover:border-wine transition-colors flex-shrink-0 mt-1"
              title="View Design"
            >
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Description */}
          <p className="font-body text-xs sm:text-sm text-charcoal/75 leading-relaxed mb-4 line-clamp-2">
            {template.shortDescription}
          </p>

          {/* 5-Shade Colour Swatches */}
          <div className="mb-5 pt-3 border-t border-champagne/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-[11px] text-charcoal/60 uppercase tracking-wider font-semibold">
                Colour Palette
              </span>
              <span className="font-body text-[10px] text-charcoal/50">
                5 Signature Shades
              </span>
            </div>
            <div className="flex items-center gap-2">
              {template.colors.map((c, i) => (
                <div key={i} className="group/color relative">
                  <div
                    className="w-5 h-5 rounded-full border border-champagne/90 shadow-2xs transition-transform hover:scale-130 cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex})`}
                  />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/color:block bg-wine text-white text-[10px] py-0.5 px-2 rounded whitespace-nowrap shadow-md z-20 pointer-events-none">
                    {c.name} ({c.hex})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons: View Design + Buy This Template */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-champagne/40">
          <Link
            to={`/templates/${template.id}`}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-wine/30 text-wine hover:bg-wine hover:text-white font-body text-xs font-semibold tracking-wide transition-all duration-200"
          >
            <Eye size={14} />
            <span>View Design</span>
          </Link>
          <Link
            to={`/buy/${template.id}`}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-wine text-white hover:bg-gold font-body text-xs font-semibold tracking-wide shadow-xs hover:shadow transition-all duration-200"
          >
            <ShoppingBag size={14} />
            <span>Buy Template</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
