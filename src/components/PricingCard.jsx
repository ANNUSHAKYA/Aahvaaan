import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingCard({ plan, featured = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-xl overflow-hidden flex flex-col justify-between ${
        featured
          ? 'bg-wine text-white ring-2 ring-gold shadow-2xl scale-[1.02]'
          : 'bg-white text-charcoal card-shadow border border-champagne/60'
      }`}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 bg-gold text-white text-center font-body text-xs font-semibold tracking-wider uppercase py-2">
          ★ Most Popular Choice
        </div>
      )}

      <div className={`p-8 ${featured ? 'pt-12' : ''} flex-1 flex flex-col`}>
        {/* Plan Name */}
        <h3 className={`font-heading text-2xl font-bold mb-1.5 ${featured ? 'text-white' : 'text-wine'}`}>
          {plan.name}
        </h3>
        <p className={`font-body text-xs mb-6 ${featured ? 'text-white/70' : 'text-charcoal/60'} leading-relaxed`}>
          {plan.description}
        </p>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-champagne/30">
          <span className={`font-heading text-5xl font-bold ${featured ? 'text-gold' : 'text-wine'}`}>
            {plan.priceDisplay}
          </span>
          <span className={`font-body text-xs ml-2 ${featured ? 'text-white/60' : 'text-charcoal/50'}`}>
            starting price
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check
                size={16}
                className={`mt-0.5 flex-shrink-0 ${featured ? 'text-gold' : 'text-gold'}`}
              />
              <span className={`font-body text-xs leading-relaxed ${featured ? 'text-white/85' : 'text-charcoal/70'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to={`/buy?package=${plan.id}`}
          className={`block text-center py-3.5 px-6 rounded-lg font-body text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
            featured
              ? 'bg-gold text-white hover:bg-gold-light shadow-md'
              : 'bg-wine text-white hover:bg-wine-light'
          }`}
        >
          {plan.ctaText || `Choose ${plan.name}`}
        </Link>
      </div>
    </motion.div>
  );
}
