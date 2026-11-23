import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthIllustration from '../components/auth/AuthIllustration';

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (/\s/.test(form.password)) {
      setError('Password must not contain spaces.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.agree) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const data = await signUp({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
      });

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

  return (
    <div className="pt-24 pb-16 min-h-[92vh] bg-ivory flex items-center justify-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-3xl sm:rounded-[36px] border border-champagne/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative"
      >
        {/* Left Side: Modern 3D Wedding Graphic */}
        <div className="hidden md:flex p-4 bg-gradient-to-br from-ivory to-champagne/30 items-center justify-center border-r border-champagne/40">
          <AuthIllustration />
        </div>

        {/* Right Side: Form */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <Link to="/" className="inline-block mb-3">
              <span className="font-heading text-2xl font-bold text-wine tracking-wide">
                Aahvaaan
              </span>
            </Link>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-wine">
              Create your account
            </h2>
            <p className="font-body text-xs text-charcoal/60 mt-1">
              Hosts start here - guests never need an account, they just open their link.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-2" />
              <h3 className="font-heading text-lg font-bold mb-1">Check Your Email</h3>
              <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                We sent a confirmation link to <strong>{form.email}</strong>. Click the link to complete registration and open your dashboard.
              </p>
              <Link
                to="/login"
                className="inline-block px-5 py-2.5 rounded-full bg-wine text-white text-xs font-semibold uppercase tracking-wider"
              >
                Proceed to Log In
              </Link>
            </div>
          ) : (
            <>
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full py-3 px-4 rounded-xl border border-champagne bg-white hover:bg-champagne/10 text-charcoal text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs disabled:opacity-50"
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
                <span>{googleLoading ? 'Signing up with Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-champagne/70" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-charcoal/40 font-body uppercase tracking-wider">
                  or
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-champagne bg-white text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-champagne bg-white text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>

                {/* Password & Confirm Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-champagne bg-white text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-wine"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-champagne bg-white text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-wine"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-charcoal/50">
                  At least 8 characters, no spaces.
                </p>

                {/* Agree Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                    className="mt-1 rounded border-champagne text-wine focus:ring-wine/20"
                  />
                  <label htmlFor="agree" className="text-[11px] text-charcoal/70 uppercase tracking-wider font-semibold">
                    I AGREE TO <Link to="/about" className="text-wine underline">TERMS OF SERVICE</Link> & <Link to="/about" className="text-wine underline">PRIVACY POLICY</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-wine to-[#8A243E] hover:from-wine-dark hover:to-wine text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-60 mt-2"
                >
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-charcoal/70">
                <Link
                  to="/login"
                  className="text-wine hover:text-gold font-semibold transition-colors"
                >
                  Already registered?
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
