import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/invitations', label: 'Templates' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const allNavLinks = user
    ? [...navLinks, { to: '/dashboard', label: 'Dashboard' }]
    : navLinks;

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-champagne/60'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Aahvaaan prominently featured */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-wine flex items-center justify-center text-gold font-heading text-xl font-bold shadow-xs">
              आ
            </div>
            <div>
              <span className="font-heading text-2xl md:text-3xl font-bold text-wine tracking-wide block leading-none">
                Aahvaaan
              </span>
              <span className="font-body text-[9px] uppercase tracking-[0.2em] text-gold font-semibold block mt-0.5">
                by Vow & Vision
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {allNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-body text-xs uppercase tracking-wider font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-wine border-b-2 border-gold pb-0.5'
                      : 'text-charcoal/70 hover:text-wine'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="flex items-center gap-2 pl-3 border-l border-champagne">
              {user ? (
                <Link
                  to="/dashboard"
                  className="py-2 px-4 rounded-lg bg-wine text-white hover:bg-gold font-body text-xs uppercase tracking-wider font-semibold shadow-xs transition-all duration-300 flex items-center gap-1.5"
                >
                  <User size={13} />
                  <span>My Invitations</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="py-2 px-3 text-charcoal/70 hover:text-wine font-body text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Host Login
                </Link>
              )}

              <Link
                to="/invitations"
                className="py-2 px-4 rounded-lg border border-wine/30 text-wine hover:bg-wine hover:text-white font-body text-xs uppercase tracking-wider font-semibold transition-all duration-300"
              >
                View Templates
              </Link>
              <Link
                to="/buy"
                className="btn-primary text-xs uppercase tracking-wider font-semibold px-4 py-2.5 shadow-sm hover:shadow flex items-center gap-1.5"
              >
                <ShoppingBag size={14} />
                <span>Buy Template</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-wine hover:text-gold transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-ivory/98 backdrop-blur-md border-t border-champagne overflow-hidden shadow-xl"
          >
            <div className="container-custom mx-auto px-4 py-6 space-y-4">
              {allNavLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block font-body text-sm py-2 transition-colors ${
                      isActive
                        ? 'text-wine font-bold border-l-2 border-gold pl-2'
                        : 'text-charcoal hover:text-wine'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <Link
                  to="/login"
                  className="block font-body text-sm py-2 text-gold font-semibold"
                >
                  Host Sign In / Register
                </Link>
              )}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <Link
                  to="/invitations"
                  className="py-2.5 text-center rounded-lg border border-wine text-wine font-body text-xs uppercase tracking-wider font-semibold"
                >
                  Templates
                </Link>
                <Link
                  to="/buy"
                  className="btn-primary text-center text-xs uppercase tracking-wider font-semibold py-2.5"
                >
                  Buy Template
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
