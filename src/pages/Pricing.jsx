import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import packages from '../data/pricing';
import PricingCard from '../components/PricingCard';
import SectionHeading from '../components/SectionHeading';

export default function Pricing() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-padding bg-champagne/30">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Transparent Pricing"
            title="Choose Your Perfect Package"
            description="Every package includes a fully personalised, mobile-friendly digital wedding invitation based on one of our 4 signature collections. Clear starting prices with no hidden charges."
          />

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {packages.map((plan) => (
              <PricingCard key={plan.id} plan={plan} featured={plan.popular} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="font-body text-xs text-charcoal/60">
              💡 Looking for a specific design? You can also <Link to="/invitations" className="text-wine font-semibold underline">explore the 4 Signature Templates</Link> and click "Buy This Template" to have your design pre-selected!
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <SectionHeading
            subtitle="Detailed Feature Breakdown"
            title="Package Comparison"
            description="Compare every capability across our Starter, Signature, and Luxury packages."
          />

          <div className="overflow-x-auto bg-ivory rounded-xl p-6 border border-champagne/50 shadow-xs">
            <table className="w-full font-body text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-champagne">
                  <th className="text-left py-4 pr-4 font-heading text-lg sm:text-xl text-wine">Features & Inclusions</th>
                  {packages.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-3 font-heading text-base sm:text-lg text-wine">
                      {plan.name}
                      <span className="block text-xs font-body font-normal text-gold mt-0.5">{plan.priceDisplay}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Selected Signature Template Design', starter: true, signature: true, luxury: true },
                  { feature: 'Personalised Couple Names & Wedding Date', starter: true, signature: true, luxury: true },
                  { feature: 'Ceremony Schedule & Itinerary', starter: true, signature: true, luxury: true },
                  { feature: 'Venue Details & Google Maps Link', starter: true, signature: true, luxury: true },
                  { feature: 'Instant WhatsApp Shareable Link', starter: true, signature: true, luxury: true },
                  { feature: 'Mobile-First Responsive Experience', starter: true, signature: true, luxury: true },
                  { feature: 'Personalised Couple Love Story', starter: false, signature: true, luxury: true },
                  { feature: 'Wedding Photo Gallery (up to 8 Photos)', starter: false, signature: true, luxury: true },
                  { feature: 'Live Wedding Countdown Timer', starter: false, signature: true, luxury: true },
                  { feature: 'Interactive Guest RSVP Form Demo', starter: false, signature: true, luxury: true },
                  { feature: 'Signature Envelope Opening Animation', starter: false, signature: true, luxury: true },
                  { feature: 'Add-to-Calendar (.ics) Event Downloads', starter: false, signature: true, luxury: true },
                  { feature: 'Multiple Ceremony Sections (Unlimited Events)', starter: false, signature: false, luxury: true },
                  { feature: 'Enhanced Bespoke Typography & Border Styling', starter: false, signature: false, luxury: true },
                  { feature: 'Priority 1-on-1 Design Support via WhatsApp', starter: false, signature: false, luxury: true },
                  { feature: 'Unlimited Design Revisions until Approval', starter: false, signature: false, luxury: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-champagne/40">
                    <td className="py-3.5 pr-4 text-charcoal font-medium">{row.feature}</td>
                    <td className="text-center py-3.5 px-3">
                      {row.starter ? (
                        <span className="text-gold text-base font-bold">✓</span>
                      ) : (
                        <span className="text-charcoal/20">—</span>
                      )}
                    </td>
                    <td className="text-center py-3.5 px-3 bg-champagne/20">
                      {row.signature ? (
                        <span className="text-gold text-base font-bold">✓</span>
                      ) : (
                        <span className="text-charcoal/20">—</span>
                      )}
                    </td>
                    <td className="text-center py-3.5 px-3">
                      {row.luxury ? (
                        <span className="text-gold text-base font-bold">✓</span>
                      ) : (
                        <span className="text-charcoal/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Custom Requirements Banner */}
      <section className="section-padding bg-ivory">
        <div className="container-custom mx-auto text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-md mb-4">Have Custom Or Multi-Day Celebrations?</h2>
            <p className="text-body mb-8">
              Need a multilingual invitation (Hindi + English), custom background music, audio narration, or multiple PDF cards? We would love to tailor a bespoke package for your wedding.
            </p>
            <Link to="/contact" className="btn-primary">
              <MessageCircle size={16} className="mr-2" />
              Discuss Custom Requirements
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
