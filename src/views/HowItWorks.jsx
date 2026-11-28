import { motion } from 'framer-motion';
import { Link } from '../lib/router-compat';
import {
  Palette, Send, Eye, CheckCircle, Share2, ArrowRight,
  MousePointer, FileText, Sparkles, MessageCircle
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { FloralDivider } from '../components/Ornaments';
import SEO from '../components/SEO';

export default function HowItWorks() {
  const steps = [
    {
      icon: Palette,
      number: '01',
      title: 'Select Your Preferred Template',
      description: 'Browse our curated collection of premium digital wedding invitation designs. From traditional royal themes to modern minimal aesthetics – find one that resonates with your wedding vision.',
      tip: 'Not sure which design? We can help you choose based on your wedding theme.',
      color: 'bg-rose/10',
    },
    {
      icon: Send,
      number: '02',
      title: 'Send Your Wedding Details',
      description: 'Share your wedding information with us – couple names, wedding date, venue details, event schedule, your love story, and photos you\'d like to include. We make it easy with a simple enquiry form.',
      tip: 'You can share details over WhatsApp or through our contact form.',
      color: 'bg-champagne/50',
    },
    {
      icon: Eye,
      number: '03',
      title: 'Receive a Personalised Preview',
      description: 'Our design team crafts your personalised wedding invitation using your chosen template and details. You\'ll receive a preview link to review every detail before we finalise.',
      tip: 'Request as many changes as you need – we want it to be perfect.',
      color: 'bg-rose/10',
    },
    {
      icon: CheckCircle,
      number: '04',
      title: 'Approve the Final Invitation',
      description: 'Review the final version of your digital wedding invitation. Check every name, date, and detail. Once you\'re satisfied, give us your approval and we\'ll prepare it for sharing.',
      tip: 'We double-check all details to ensure everything is accurate.',
      color: 'bg-champagne/50',
    },
    {
      icon: Share2,
      number: '05',
      title: 'Share With Your Guests',
      description: 'Receive your unique invitation link that you can share instantly with family and friends via WhatsApp, email, or any messaging platform. Your guests enjoy a beautiful, interactive experience.',
      tip: 'One link works beautifully on all devices – phones, tablets, and desktops.',
      color: 'bg-rose/10',
    },
  ];

  const features = [
    { icon: MousePointer, title: 'Interactive Experience', desc: 'Tap-to-open envelopes, animated reveals, and smooth transitions.' },
    { icon: FileText, title: 'Complete Details', desc: 'Names, dates, venue, map directions, event schedule – all in one link.' },
    { icon: Sparkles, title: 'Premium Design', desc: 'Professional aesthetics that reflect the beauty of your celebration.' },
    { icon: MessageCircle, title: 'Instant Sharing', desc: 'Share via WhatsApp in one tap. No downloads or apps needed.' },
  ];

  return (
    <div className="pt-20">
      <SEO
        title="How It Works – Simple 4-Step Process | Aahvaaan"
        description="Learn how Aahvaaan crafts your bespoke interactive wedding invitation website. Pick a template, share your wedding story, review your draft, and share with guests."
        url="https://aahvaaan.vercel.app/how-it-works"
      />
      {/* Header */}
      <section className="section-padding bg-champagne/30">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Your Journey"
            title="How It Works"
            description="From choosing your design to sharing with your guests – here's how we bring your wedding invitation to life."
          />
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding bg-ivory">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-champagne hidden md:block" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start gap-6 mb-16 last:mb-0 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Number Circle */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-wine text-white items-center justify-center z-10">
                  <span className="font-heading text-lg font-bold">{step.number}</span>
                </div>

                {/* Content Card */}
                <div className={`md:w-[calc(50%-3rem)] ${index % 2 === 0 ? 'md:pr-0' : 'md:pl-0'}`}>
                  <div className={`${step.color} rounded-lg p-6 md:p-8 border border-champagne/30`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="md:hidden w-10 h-10 rounded-full bg-wine text-white flex items-center justify-center flex-shrink-0">
                        <span className="font-heading text-sm font-bold">{step.number}</span>
                      </div>
                      <step.icon size={24} className="text-wine" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-wine mb-3">{step.title}</h3>
                    <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-3">{step.description}</p>
                    <p className="font-body text-xs text-gold italic">💡 {step.tip}</p>
                  </div>
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Our Invitations Special */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="The Experience"
            title="What Makes Our Invitations Special"
            description="More than a digital card – it's a complete, interactive wedding invitation experience."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-full bg-champagne/50 flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={24} className="text-wine" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-wine mb-2">{feature.title}</h3>
                <p className="font-body text-sm text-charcoal/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-wine">
        <div className="container-custom mx-auto text-center">
          <FloralDivider className="text-gold/50 mx-auto mb-8" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="font-body text-base text-white/70 max-w-lg mx-auto mb-8">
              Let's create a wedding invitation that your guests will remember.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/invitations" className="btn-gold">
                Browse Designs
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/30 text-white font-body font-medium text-sm tracking-wide rounded-md hover:bg-white/10 transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
