import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthIllustration from '../components/auth/AuthIllustration';

export default function Login() {
  const { signIn, signInWithGoogle, signInWithOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMode === 'otp') {
        await signInWithOtp(form.email.trim());
        setOtpSent(true);
      } else {
        await signIn({ email: form.email.trim(), password: form.password });
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
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

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-[94vh] bg-[#512D38]/10 backdrop-blur-md flex items-center justify-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative"
      >
        {/* Close Button on Top Right (Exact Balcony screenshot match) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-charcoal hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Left Side: Modern 3D/Card Wedding Illustration */}
        <div className="hidden md:flex p-4 bg-gradient-to-br from-ivory to-champagne/30 items-center justify-center border-r border-gray-100">
          <AuthIllustration />
        </div>

        {/* Right Side: Clean Form */}
        <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          {/* Brand header */}
          <div className="text-center sm:text-left mb-6">
            <Link to="/" className="inline-block mb-3">
              <span className="font-heading text-2xl font-bold text-wine tracking-wide">
                Aahvaaan
              </span>
            </Link>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal">
              Welcome back
            </h2>
            <p className="font-body text-xs text-charcoal/60 mt-1">
              Log in to manage your invitations.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-charcoal text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs disabled:opacity-50"
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
            <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          {/* Clean Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400 font-medium">or</span>
            </div>
          </div>

          {/* Auth Mode Toggle (Password vs Email OTP) */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMode === 'password' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMode === 'otp' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Email OTP
            </button>
          </div>

          {otpSent ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2 mb-4">
              <span className="font-bold block text-sm">✉️ Check your inbox!</span>
              <p className="leading-relaxed">
                We sent an instant login OTP link to <strong>{form.email}</strong>. Tap the link in your email to immediately access your dashboard.
              </p>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-emerald-700 underline font-semibold mt-1 inline-block"
              >
                Send again or use different email
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-charcoal text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                />
              </div>

              {authMode === 'password' && (
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-charcoal text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}

              {/* Gradient Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 mt-2 rounded-2xl bg-gradient-to-r from-[#6B1D2F] via-[#851C34] to-[#A02845] hover:opacity-95 text-white font-body font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading
                  ? authMode === 'otp' ? 'Sending Link...' : 'Logging in...'
                  : authMode === 'otp' ? 'Send Login OTP Link' : 'Log in'}
              </button>
            </form>
          )}

          {/* Links Below Button */}
          <div className="mt-5 flex items-center justify-between text-xs font-body">
            <Link
              to="/signup"
              className="text-wine hover:text-wine-dark font-medium transition-colors"
            >
              Create an account
            </Link>
            <Link
              to="/forgot-password"
              className="text-charcoal/60 hover:text-charcoal transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
