import { Link } from 'react-router-dom';
import { Instagram, ArrowUp } from 'lucide-react';
import config from '../data/config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#24050E] text-white/90 pt-16 pb-10 border-t border-white/10 font-body">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand & Description (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-heading text-3xl font-bold text-white tracking-tight">
                Aahvaaan
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm">
              Beautiful, interactive, useful digital invitations - shared in a tap, with every RSVP tracked in one place.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/invitations"
                className="px-5 py-2 rounded-full bg-white text-wine hover:bg-gold hover:text-white font-semibold text-xs transition-colors shadow-xs"
              >
                View templates
              </Link>

              <a
                href={config.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
                title="Follow us on Instagram"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-gold-light mb-4">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link to="/invitations" className="hover:text-gold transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-gold transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#sharing" className="hover:text-gold transition-colors">
                  Sharing
                </a>
              </li>
              <li>
                <Link to="/invitations" className="hover:text-gold transition-colors">
                  All templates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-gold-light mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <a href="/#faqs" className="hover:text-gold transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Account */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-gold-light mb-4">
              ACCOUNT
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link to="/login" className="hover:text-gold transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-gold transition-colors">
                  Create an account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-gold transition-colors">
                  My invitations
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-gold transition-colors">
                  Profile & settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {currentYear} Aahvaaan by Vow & Vision. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
