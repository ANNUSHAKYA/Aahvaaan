import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Annu Shakya';

  // Smooth scroll handler for anchor links
  const handleScrollTo = (id) => (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    }
  };

  // Dedicated App Top Header (for Dashboard, Templates/Gallery, Profile, and Host pages)
  const isAppPage = [
    '/dashboard',
    '/host',
    '/invitations',
    '/templates',
    '/gallery',
    '/profile',
    '/buy',
  ].some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));

  if (isAppPage) {
    const isDashboard = location.pathname === '/dashboard' || location.pathname === '/host';
    const isTemplates = location.pathname === '/invitations' || location.pathname === '/templates' || location.pathname === '/gallery';

    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="container-custom mx-auto px-4 sm:px-8 h-16 flex items-center justify-between max-w-6xl">
          {/* Left: Brand & Navigation Tabs */}
          <div className="flex items-center gap-8 h-16">
            <Link to="/" className="font-heading text-2xl font-bold text-[#512D38] tracking-tight">
              Aahvaaan
            </Link>

            <nav className="flex items-center gap-6 sm:gap-8 h-16 text-sm font-body">
              <Link
                to="/dashboard"
                className={`h-full flex items-center transition-colors relative font-medium ${
                  isDashboard
                    ? 'text-charcoal font-semibold border-b-2 border-[#512D38]'
                    : 'text-charcoal/70 hover:text-[#512D38]'
                }`}
              >
                My invitations
              </Link>

              <Link
                to="/templates"
                className={`h-full flex items-center transition-colors relative font-medium ${
                  isTemplates
                    ? 'text-charcoal font-semibold border-b-2 border-[#512D38]'
                    : 'text-charcoal/70 hover:text-[#512D38]'
                }`}
              >
                Templates
              </Link>
            </nav>
          </div>

          {/* Right: Dashboard CTA (Matches Screenshot 3) & User Profile */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-1.5 rounded-full bg-[#512D38] hover:bg-[#3D1E28] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Dashboard
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 font-body text-sm text-charcoal/80 hover:text-[#512D38] transition-colors group"
                title="Account Settings"
              >
                <div className="w-8 h-8 rounded-full bg-ivory border border-champagne flex items-center justify-center text-charcoal/70 group-hover:border-[#512D38] group-hover:text-[#512D38] transition-colors">
                  <User size={16} />
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </header>
    );
  }

  // Marketing / Home Page Floating Pill Navigation
  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="w-full max-w-5xl flex flex-col items-center">
        {/* Floating Pill Nav Bar */}
        <nav className="pointer-events-auto w-full bg-white/95 backdrop-blur-md rounded-full px-5 sm:px-7 py-2 sm:py-2.5 shadow-lg border border-champagne/60 flex items-center justify-between transition-all">
          {/* Logo on Left */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-heading text-xl sm:text-2xl font-bold text-wine tracking-tight">
              Aahvaaan
            </span>
          </Link>

          {/* Desktop Links in Center */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold font-body text-charcoal/70">
            <Link to="/templates" className="hover:text-wine transition-colors">
              Templates
            </Link>
            <a
              href="#features"
              onClick={handleScrollTo('features')}
              className="hover:text-wine transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#sharing"
              onClick={handleScrollTo('sharing')}
              className="hover:text-wine transition-colors cursor-pointer"
            >
              Sharing
            </a>
            <a
              href="#faqs"
              onClick={handleScrollTo('faqs')}
              className="hover:text-wine transition-colors cursor-pointer"
            >
              FAQs
            </a>
            <a
              href="#about"
              onClick={handleScrollTo('about')}
              className="hover:text-wine transition-colors cursor-pointer"
            >
              About us
            </a>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="px-4 sm:px-5 py-2 rounded-full bg-wine hover:bg-gold text-white font-body text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  My invitations
                </Link>
                <Link
                  to="/profile"
                  className="w-8 h-8 rounded-full bg-ivory text-wine hover:bg-wine hover:text-white flex items-center justify-center transition-colors border border-champagne shrink-0"
                  title="My Profile & Settings"
                >
                  <User size={15} />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 sm:px-6 py-2 rounded-full bg-wine hover:bg-gold text-white font-body text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                Sign in
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 text-wine hover:text-gold transition-colors ml-1"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-full mt-2 bg-white rounded-3xl border border-champagne shadow-2xl p-5 space-y-3 md:hidden"
            >
              <div className="space-y-1 font-body text-sm font-semibold text-charcoal">
                <Link
                  to="/templates"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-3 rounded-xl hover:bg-ivory hover:text-wine transition-colors"
                >
                  Templates
                </Link>
                <a
                  href="#features"
                  onClick={handleScrollTo('features')}
                  className="block py-2 px-3 rounded-xl hover:bg-ivory hover:text-wine transition-colors"
                >
                  Features
                </a>
                <a
                  href="#sharing"
                  onClick={handleScrollTo('sharing')}
                  className="block py-2 px-3 rounded-xl hover:bg-ivory hover:text-wine transition-colors"
                >
                  Sharing
                </a>
                <a
                  href="#faqs"
                  onClick={handleScrollTo('faqs')}
                  className="block py-2 px-3 rounded-xl hover:bg-ivory hover:text-wine transition-colors"
                >
                  FAQs
                </a>
                <a
                  href="#about"
                  onClick={handleScrollTo('about')}
                  className="block py-2 px-3 rounded-xl hover:bg-ivory hover:text-wine transition-colors"
                >
                  About us
                </a>
              </div>

              <div className="pt-2 border-t border-champagne/60 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 text-center rounded-full bg-wine text-white font-body text-xs font-semibold shadow-xs"
                    >
                      My invitations
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 text-center rounded-full border border-champagne text-charcoal font-body text-xs font-semibold"
                    >
                      My Profile & Settings
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 text-center rounded-full bg-wine text-white font-body text-xs font-semibold shadow-xs"
                  >
                    Sign in / Register
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
