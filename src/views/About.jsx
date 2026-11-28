import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '../lib/router-compat';
import { Heart, Award, Users, Sparkles, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { FloralDivider } from '../components/Ornaments';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Crafted With Love',
      description: 'Every invitation we create is designed with the same care and attention you put into planning your wedding. We believe in meaningful design, not mass production.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We don\'t cut corners. From typography to animations, every detail is polished to perfection. Your invitation should look and feel premium.',
    },
    {
      icon: Users,
      title: 'Personal Touch',
      description: 'We work directly with couples to understand their vision. No generic templates applied blindly – every invitation is personalised to tell your unique story.',
    },
    {
      icon: Sparkles,
      title: 'Modern Innovation',
      description: 'Interactive features, smooth animations, and mobile-first design. We bring modern web technology to the timeless tradition of wedding invitations.',
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-champagne/30">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-body text-xs tracking-[0.2em] uppercase font-medium text-gold mb-3 block">
                Our Story
              </span>
              <h1 className="heading-xl mb-6">
                About <span className="text-gold italic">Vow & Vision</span>
              </h1>
              <div className="gold-divider mb-6" />
              <p className="font-body text-lg text-charcoal/70 leading-relaxed">
                Every celebration deserves a beautiful beginning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="bg-champagne rounded-lg overflow-hidden aspect-[4/5] relative">
                  <Image
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=750&fit=crop&q=80"
                    alt="Indian wedding celebration with traditional flower garlands and decor"
                    width={600}
                    height={750}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-gold/30 rounded-lg -z-10" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="font-body text-xs tracking-[0.2em] uppercase font-medium text-gold mb-3 block">
                Who We Are
              </span>
              <h2 className="heading-lg mb-6">
                Beautiful Beginnings,<br />Thoughtfully Designed.
              </h2>
              <div className="space-y-4 font-body text-charcoal/70 leading-relaxed">
                <p>
                  <strong className="text-wine">Vow & Vision</strong> was born from a simple belief: every couple deserves a wedding invitation as beautiful as their love story. In a world where first impressions matter, your wedding invitation sets the tone for your entire celebration.
                </p>
                <p>
                  We specialise in crafting premium digital wedding invitations designed specifically for Indian weddings. Our invitations go beyond static images – they're interactive, animated, and built to create a memorable experience for every guest who receives them.
                </p>
                <p>
                  From the grandeur of a traditional royal wedding to the understated elegance of a modern celebration, we bring your vision to life through thoughtful design, beautiful typography, and seamless technology.
                </p>
                <p>
                  <strong className="text-wine">Aahvaaan</strong> – our brand name, meaning "invitation" – embodies our mission: to transform the way Indian couples invite their loved ones to celebrate.
                </p>
              </div>
              <FloralDivider className="text-gold mt-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-ivory">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Our Values"
            title="What We Stand For"
            description="The principles that guide every invitation we create."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 card-shadow border border-champagne/30"
              >
                <div className="w-12 h-12 rounded-lg bg-champagne/50 flex items-center justify-center mb-4">
                  <value.icon size={22} className="text-wine" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-wine mb-2">{value.title}</h3>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-wine">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { number: '1,200+', label: 'Happy Couples' },
              { number: '50+', label: 'Unique Designs' },
              { number: '4.9', label: 'Average Rating' },
              { number: '100%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="font-heading text-3xl md:text-4xl font-bold text-gold block mb-1">{stat.number}</span>
                <span className="font-body text-sm text-white/60">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-ivory">
        <div className="container-custom mx-auto text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-lg mb-4">Let's Create Something Beautiful</h2>
            <p className="text-body mb-8">
              Your love story deserves an invitation that does it justice. Let us help you make a stunning first impression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/templates" className="btn-primary">
                Explore Designs
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
