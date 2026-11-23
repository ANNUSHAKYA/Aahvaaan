import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPasswordForEmail(email.trim());
      setSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Unable to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-[90vh] bg-ivory flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-[28px] border border-champagne/80 p-8 sm:p-10 card-shadow text-center"
      >
        <Link to="/login" className="inline-flex items-center gap-1.5 text-charcoal/60 hover:text-wine font-body text-xs font-semibold mb-6 transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>

        {submitted ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Check size={24} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-wine mb-2">Check Your Inbox</h2>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed mb-6">
              We have sent a secure password reset link to <strong>{email}</strong>. Tap the link in your email to choose a new password.
            </p>
            <Link to="/login" className="btn-primary text-xs uppercase tracking-widest font-semibold px-6 py-3">
              Return to Login
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="font-heading text-2xl font-bold text-wine mb-1">
              Reset Your Password
            </h2>
            <p className="font-body text-xs text-charcoal/70 mb-6">
              Enter your registered host email address and we'll send you an instant reset link
            </p>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block font-body text-xs font-semibold text-charcoal mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-xs uppercase tracking-widest font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
