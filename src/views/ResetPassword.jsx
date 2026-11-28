'use client';

import { useState } from 'react';
import { useNavigate, Link } from '../lib/router-compat';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Update password error:', err);
      setError(err.message || 'Unable to update password. Your reset link may have expired.');
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
        {success ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Check size={24} />
            </div>
            <h2 className="font-heading text-2xl font-bold text-wine mb-2">Password Updated!</h2>
            <p className="font-body text-xs text-charcoal/70 mb-6">
              Your password has been changed successfully. Redirecting you to your dashboard...
            </p>
            <Link to="/dashboard" className="btn-primary text-xs uppercase tracking-widest font-semibold px-6 py-3">
              Go to Dashboard Now
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="font-heading text-2xl font-bold text-wine mb-1">
              Create New Password
            </h2>
            <p className="font-body text-xs text-charcoal/70 mb-6">
              Enter and confirm your new secure password
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
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs font-semibold text-charcoal mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne font-body text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-xs uppercase tracking-widest font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Updating Password...' : 'Save & Sign In'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
