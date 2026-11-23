import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
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
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight mb-2">
            All templates
          </h1>
          <p className="font-body text-xs sm:text-sm text-charcoal/60">
            Every invitation experience we offer.
          </p>
        </div>

        {/* 3-Column Template Cards Grid (Exact Balcony Reference Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <Link
                to={`/invitations/${template.id}`}
                className="bg-white rounded-3xl border border-gray-100/90 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full cursor-pointer"
              >
                <div>
                  {/* Card Image Preview */}
                  <div className="relative aspect-[16/11] bg-champagne/20 overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `data:image/svg+xml,${encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" fill="#FAF6F0"><rect width="800" height="500"/><text x="400" y="250" text-anchor="middle" font-family="Georgia" font-size="32" fill="#704B50">${template.name}</text></svg>`
                        )}`;
                      }}
                    />
                  </div>

                  {/* Card Header & Description */}
                  <div className="p-6 pb-2">
                    <h3 className="font-heading text-lg font-bold text-charcoal group-hover:text-wine transition-colors mb-2">
                      {template.name}
                    </h3>
                    <p className="font-body text-xs text-charcoal/65 leading-relaxed line-clamp-3">
                      {template.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Badge, Price & Chevron */}
                <div className="p-6 pt-3 flex items-center justify-between border-t border-gray-50 mt-2">
                  <div className="flex items-center gap-2">
                    {template.isNew && (
                      <span className="px-2.5 py-0.5 rounded-full bg-wine text-white text-[10px] font-bold tracking-wide uppercase">
                        New
                      </span>
                    )}
                    <span className="font-body font-bold text-wine text-sm">
                      ₹{template.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-charcoal/40 group-hover:text-wine group-hover:translate-x-1 transition-all">
                    <ChevronRight size={18} />
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
