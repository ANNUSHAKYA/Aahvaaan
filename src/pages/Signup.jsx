import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await signUp({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      // If Supabase requires email verification
      if (data?.user && !data?.session) {
        setSuccess(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
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
      setError(err.message || 'Google sign-up failed.');
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-24 pb-16 min-h-[90vh] bg-ivory flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-[28px] border border-champagne p-8 text-center card-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Check size={24} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-wine mb-2">Check Your Email</h2>
          <p className="font-body text-xs text-charcoal/75 leading-relaxed mb-6">
            We sent a verification link to <strong>{form.email}</strong>. Tap the link in your email to activate your Aahvaaan account and open your dashboard.
          </p>
          <Link to="/login" className="btn-primary text-xs uppercase tracking-widest font-semibold px-6 py-3">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-[90vh] bg-ivory flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-[28px] border border-champagne/80 p-8 sm:p-10 card-shadow"
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-2">
            <span className="font-heading text-3xl font-bold text-wine tracking-wide block">
              Aahvaaan
            </span>
            <span className="font-body text-[9px] uppercase tracking-[0.25em] text-gold font-semibold block">
              Host Registration
            </span>
          </Link>
          <h2 className="font-heading text-2xl font-bold text-wine">
            Create Your Account
          </h2>
          <p className="font-body text-xs text-charcoal/70 mt-1">
            Build, preview & personalize your wedding invitations
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-champagne bg-ivory/60 hover:bg-champagne/30 text-charcoal font-body text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors mb-4 disabled:opacity-50"
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
          <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-champagne/70 w-full" />
          <span className="bg-white px-3 font-body text-[10px] text-charcoal/40 uppercase tracking-widest font-semibold">
            or sign up with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block font-body text-xs font-semibold text-charcoal mb-1">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ananya Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-semibold text-charcoal mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ananya@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-semibold text-charcoal mb-1">
              WhatsApp Phone Number
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-body text-xs font-semibold text-charcoal mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 chars"
                  className="w-full pl-9 pr-2.5 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs font-semibold text-charcoal mb-1">
                Confirm
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat"
                  className="w-full pl-9 pr-2.5 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-xs uppercase tracking-widest font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Create Host Account'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-champagne/50 text-center">
          <p className="font-body text-xs text-charcoal/70">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-wine hover:text-gold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
