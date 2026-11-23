import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn({ email: form.email.trim(), password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError(err.message || 'Google sign-in failed. Please try with email/password.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] bg-ivory flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-[28px] border border-champagne/80 p-8 sm:p-10 card-shadow"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <span className="font-heading text-3xl font-bold text-wine tracking-wide block">
              Aahvaaan
            </span>
            <span className="font-body text-[9px] uppercase tracking-[0.25em] text-gold font-semibold block">
              Host Portal
            </span>
          </Link>
          <h2 className="font-heading text-2xl font-bold text-wine">
            Welcome Back
          </h2>
          <p className="font-body text-xs text-charcoal/70 mt-1">
            Sign in to manage your wedding invitations, guest lists & live RSVPs
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full py-3 px-4 rounded-xl border border-champagne bg-ivory/60 hover:bg-champagne/30 text-charcoal font-body text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors mb-5 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-champagne/70 w-full" />
          <span className="bg-white px-3 font-body text-[11px] text-charcoal/40 uppercase tracking-widest font-semibold">
            or email
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-xs font-semibold text-charcoal mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-body text-xs font-semibold text-charcoal">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-body text-gold hover:text-wine font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-xs uppercase tracking-widest font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-champagne/50 text-center">
          <p className="font-body text-xs text-charcoal/70">
            Don't have a host account yet?{' '}
            <Link to="/signup" className="font-semibold text-wine hover:text-gold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
