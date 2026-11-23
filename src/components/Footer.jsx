import { Link } from 'react-router-dom';
import { Heart, Mail, Instagram, MapPin } from 'lucide-react';
import config from '../data/config';
import templates from '../data/templates';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wine text-white/90">
      {/* Main Footer */}
      <div className="container-custom mx-auto section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <span className="font-heading text-3xl font-bold text-white block">
                Aahvaaan
              </span>
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                by Vow & Vision
              </span>
            </Link>
            <p className="font-body text-xs sm:text-sm text-white/70 leading-relaxed mb-4">
              {config.tagline} Thoughtfully crafted interactive digital wedding invitations for modern Indian celebrations.
            </p>
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full border border-white/15 text-[11px] font-body text-gold">
              ✨ 100% WhatsApp & Mobile Optimized
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/invitations', label: 'Explore All Templates' },
                { to: '/buy', label: 'Buy a Template' },
                { to: '/pricing', label: 'Packages & Pricing' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact & Orders' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-xs sm:text-sm text-white/70 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Signature Collections */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-gold mb-4">Signature Collections</h4>
            <ul className="space-y-2.5">
              {templates.map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/invitations/${t.id}`}
                    className="font-body text-xs sm:text-sm text-white/70 hover:text-gold transition-colors duration-200 flex items-center justify-between group"
                  >
                    <span>{t.name}</span>
                    <span className="text-[11px] text-gold/60 group-hover:text-gold font-mono">Live Demo →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Orders */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-gold mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${config.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-xs sm:text-sm text-white/70 hover:text-gold transition-colors"
                >
                  <span className="text-emerald-400 font-bold">WhatsApp:</span>
                  +{config.whatsappNumber}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.email}`}
                  className="flex items-center gap-2 font-body text-xs sm:text-sm text-white/70 hover:text-gold transition-colors"
                >
                  <Mail size={15} />
                  {config.email}
                </a>
              </li>
              <li>
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-xs sm:text-sm text-white/70 hover:text-gold transition-colors"
                >
                  <Instagram size={15} />
                  {config.instagramHandle}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 font-body text-xs sm:text-sm text-white/70">
                  <MapPin size={15} />
                  {config.location}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/50">
            © {currentYear} Aahvaaan by {config.brandName}. All rights reserved.
          </p>
          <p className="font-body text-xs text-white/50 flex items-center gap-1">
            Made with <Heart size={12} className="text-rose fill-rose" /> for memorable Indian weddings
          </p>
        </div>
      </div>
    </footer>
  );
}
