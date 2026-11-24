import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20 flex items-center justify-center px-4">
      <SEO
        title="Page Not Found (404) | Aahvaaan"
        description="The celebration page you are looking for cannot be found."
      />
      <div className="max-w-md w-full bg-white rounded-3xl border border-champagne/80 p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
        {/* Subtle Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-wine via-gold to-wine" />

        {/* 3D Wax Seal / Envelope Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FAF6F0] to-[#E9D7CC] border-2 border-gold/60 mx-auto mb-6 flex items-center justify-center text-3xl shadow-inner relative">
          <span>💌</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-wine text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
            404
          </div>
        </div>

        <span className="text-[10px] font-body text-gold uppercase tracking-widest font-bold block mb-1">
          CELEBRATION NOT FOUND
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-wine mb-3">
          Lost Along the Procession
        </h1>

        <p className="font-body text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-8">
          The link you followed may have expired, or the ceremony link has been moved. Let's guide you back to our royal celebration collections.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-wine hover:bg-wine-light text-white text-xs font-semibold shadow-md transition-all"
          >
            <Home size={15} />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/invitations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-champagne hover:border-wine text-charcoal text-xs font-semibold transition-all"
          >
            <span>Explore Templates</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
