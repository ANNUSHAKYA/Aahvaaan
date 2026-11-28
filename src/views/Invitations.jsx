import { Link } from '../lib/router-compat';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import templates from '../data/templates';
import SEO from '../components/SEO';

export default function Invitations() {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#FAF7F2]">
      <SEO
        title="Wedding Invitation Templates & Gallery | Aahvaaan"
        description="Explore Aahvaaan's signature interactive Indian wedding invitation templates. Experience live countdowns, music, personalized guest reveals, and RSVP management."
        url="https://aahvaaan.vercel.app/templates"
      />
      <div className="container-custom mx-auto px-4 sm:px-8 max-w-6xl">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-1.5">
            All templates
          </h1>
          <p className="font-body text-xs sm:text-sm text-gray-500">
            Every invitation experience we offer.
          </p>
        </div>

        {/* Template Catalog Grid */}
        <div className={templates.length === 1 ? 'max-w-md mx-auto' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7'}>
          {templates.map((template, index) => (
            <motion.div
              key={template.id + index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={`/templates/${template.id}`}
                className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full group cursor-pointer"
              >
                <div>
                  {/* Card Image Preview with Curved Corners */}
                  <div className="relative aspect-[4/3] bg-[#F7F5FA] overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900 group-hover:text-wine transition-colors mb-2">
                      {template.name}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {template.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 pt-0 flex items-end justify-between">
                  <div>
                    {template.isNew && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E9D8CC] text-[#512D38] border border-[#B69A70]/30 mb-1">
                        New
                      </span>
                    )}
                    <span className="font-bold text-base sm:text-lg text-wine block">
                      {template.priceDisplay || '₹3,499'}
                    </span>
                  </div>

                  <div className="text-gray-400 group-hover:text-[#B69A70] group-hover:translate-x-1 transition-all pb-0.5">
                    <ChevronRight size={20} />
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
