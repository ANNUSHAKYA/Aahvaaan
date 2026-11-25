import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, ChevronRight, AlertCircle, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supabase, { isSupabaseConfigured } from '../lib/supabase';

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('account');
  const [name, setName] = useState(profile?.name || user?.user_metadata?.full_name || 'Annu Shakya');
  const [email, setEmail] = useState(user?.email || 'annushakya94526@gmail.com');
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Billing / Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
    else if (user?.user_metadata?.full_name) setName(user.user_metadata.full_name);

    if (user?.email) setEmail(user.email);
  }, [profile, user]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user || !isSupabaseConfigured) return;
      setLoadingOrders(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
      } catch (err) {
        console.warn('Orders fetch error:', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, [user]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    setSavingName(true);
    setNameSuccess(false);

    try {
      if (isSupabaseConfigured && user) {
        await supabase
          .from('profiles')
          .update({ name: name.trim() })
          .eq('id', user.id);
      }
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err) {
      console.error('Save name error:', err);
    } finally {
      setSavingName(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (password.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPasswordMsg({ type: 'success', text: 'Password successfully set!' });
        setPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'success', text: 'Password updated (demo mode).' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const displayName = name || user?.user_metadata?.full_name || 'Annu Shakya';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AS';

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#F8F7FC] font-body text-charcoal">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* ─── 1. TOP VERIFIED PROFILE CARD ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center gap-5 sm:gap-6">
          {/* Avatar Initials Circle */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-heading font-bold text-xl sm:text-2xl flex items-center justify-center shrink-0">
            {initials}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal leading-tight">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full shrink-0">
                <span className="font-bold">✓</span>
                <span>Verified</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-charcoal/60 mt-0.5 truncate">
              {email}
            </p>

            <p className="text-xs text-charcoal/40 mt-1">
              Member since November 2026
            </p>
          </div>
        </div>

        {/* ─── 2. SPLIT SECTION LAYOUT ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-8">
          {/* Left Vertical Nav Links (3 Cols) */}
          <aside className="md:col-span-3 sticky top-24 pl-1">
            <nav className="space-y-4 text-sm font-body">
              <button
                type="button"
                onClick={() => scrollToSection('account')}
                className={`block text-left transition-colors font-medium ${
                  activeSection === 'account'
                    ? 'text-charcoal font-bold'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                Account details
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('password')}
                className={`block text-left transition-colors font-medium ${
                  activeSection === 'password'
                    ? 'text-charcoal font-bold'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                Password
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('billing')}
                className={`block text-left transition-colors font-medium ${
                  activeSection === 'billing'
                    ? 'text-charcoal font-bold'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                Billing
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('actions')}
                className={`block text-left transition-colors font-medium ${
                  activeSection === 'actions'
                    ? 'text-charcoal font-bold'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                Account actions
              </button>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="block text-left text-sm text-charcoal/60 hover:text-rose-600 transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            </nav>
          </aside>

          {/* Right Stacked Content Cards (9 Cols) */}
          <div className="md:col-span-9 space-y-6">
            {/* ─── CARD 1: ACCOUNT DETAILS ─── */}
            <section
              id="account"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <h2 className="font-heading text-lg font-bold text-charcoal mb-1">
                Account details
              </h2>
              <p className="text-xs text-charcoal/60 mb-6">
                Update your name and the email address you sign in with.
              </p>

              <form onSubmit={handleSaveName} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={savingName}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {savingName ? 'Saving...' : 'Save changes'}
                  </button>

                  {nameSuccess && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Check size={14} />
                      Saved!
                    </span>
                  )}
                </div>
              </form>
            </section>

            {/* ─── CARD 2: SET A PASSWORD ─── */}
            <section
              id="password"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <h2 className="font-heading text-lg font-bold text-charcoal mb-1">
                Set a password
              </h2>
              <p className="text-xs text-charcoal/60 mb-6 leading-relaxed">
                You sign in with Google. Adding a password lets you sign in with your email as well - it doesn't remove Google.
              </p>

              {passwordMsg && (
                <div
                  className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <AlertCircle size={15} />
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSetPassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5">
                      New password
                    </label>
                    <input
                      type="password"
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {savingPassword ? 'Updating...' : 'Set password'}
                  </button>
                </div>
              </form>
            </section>

            {/* ─── CARD 3: BILLING ─── */}
            <section
              id="billing"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <h2 className="font-heading text-lg font-bold text-charcoal mb-1">
                Billing
              </h2>
              <p className="text-xs text-charcoal/60 mb-6">
                Your purchases and total spend.
              </p>

              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-gray-200 bg-[#FBF9F7] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-charcoal capitalize block">
                          {ord.type === 'extra_guests'
                            ? '50 Extra Personalized Guest Links'
                            : `${ord.package_id || 'Signature'} Wedding Website Package`}
                        </span>
                        <span className="text-[11px] text-charcoal/50">
                          Order #{ord.razorpay_order_id || ord.id.substring(0, 8)} •{' '}
                          {new Date(ord.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-charcoal text-sm block">
                          ₹{ord.amount_inr || ord.amount || 1499}
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {ord.status || 'Paid'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-2xl p-10 bg-[#FBF9F7] text-center">
                  <p className="font-bold text-sm text-charcoal mb-1">
                    No purchases yet
                  </p>
                  <p className="text-xs text-charcoal/50">
                    Your invitation purchases will appear here with their price.
                  </p>
                </div>
              )}
            </section>

            {/* ─── CARD 4: ACCOUNT ACTIONS ─── */}
            <section
              id="actions"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <h2 className="font-heading text-lg font-bold text-charcoal mb-1">
                Account actions
              </h2>
              <p className="text-xs text-charcoal/60 mb-6">
                Sign out, or permanently delete your account.
              </p>

              <div className="space-y-3">
                <div
                  onClick={() => signOut()}
                  className="border border-gray-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-sm text-charcoal leading-tight">
                      Sign out
                    </h3>
                    <p className="text-xs text-charcoal/50 mt-0.5">
                      Sign out of your account on this device.
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-charcoal/40" />
                </div>

                <div
                  onClick={() =>
                    alert(
                      'To delete your account, please contact support via WhatsApp so we can verify that no active published guest invitations are disrupted.'
                    )
                  }
                  className="border border-gray-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:bg-rose-50/50 cursor-pointer transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-sm text-rose-700 leading-tight">
                      Delete
                    </h3>
                    <p className="text-xs text-charcoal/50 mt-0.5">
                      Permanently delete your account and stored drafts.
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-rose-400" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
