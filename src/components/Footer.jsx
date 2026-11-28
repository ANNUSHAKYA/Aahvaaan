import { Link } from '../lib/router-compat';
import { Instagram, Mail, ArrowUp } from 'lucide-react';
import siteConfig from '../../lib/siteConfig';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1F0510] text-white/90 pt-16 pb-12 border-t border-white/10 font-body relative">
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
              {siteConfig.tagline}
            </p>

            <div className="pt-1">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-gold transition-colors"
              >
                <Mail size={14} className="text-gold-light" />
                <span>{siteConfig.email}</span>
              </a>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/templates"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6B1D2F] via-[#851C34] to-[#A02845] hover:opacity-95 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg"
              >
                View templates
              </Link>

              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15"
                title="Follow us on Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-gold-light mb-4">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link to="/templates" className="hover:text-gold transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-gold transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#send" className="hover:text-gold transition-colors">
                  Sending
                </a>
              </li>
              <li>
                <a href="/#faqs" className="hover:text-gold transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-gold-light mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <a href="/#about" className="hover:text-gold transition-colors">
                  About us
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-gold transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Account (Hide "My invitations" & "Profile & settings" unless logged in) */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-gold-light mb-4">
              ACCOUNT
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {user ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {currentYear} Aahvaaan. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
