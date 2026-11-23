import { motion } from 'framer-motion';

export default function SectionHeading({ subtitle, title, description, light = false, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${alignClass}`}
    >
      {subtitle && (
        <span className={`font-body text-xs tracking-[0.2em] uppercase font-medium ${light ? 'text-gold-light' : 'text-gold'} mb-3 block`}>
          {subtitle}
        </span>
      )}
      <h2 className={`heading-lg ${light ? 'text-white' : ''} mb-4`}>
        {title}
      </h2>
      {align === 'center' && <div className={`gold-divider mb-4 ${light ? 'bg-gold-light' : ''}`} />}
      {description && (
        <p className={`font-body text-base max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-charcoal/70'} leading-relaxed`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
