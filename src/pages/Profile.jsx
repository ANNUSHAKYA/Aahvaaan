import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, CheckCircle2, ShieldCheck, CreditCard, LogOut,
  Trash2, AlertCircle, Save, Key, ChevronRight, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supabase, { isSupabaseConfigured } from '../lib/supabase';

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'password' | 'billing' | 'actions'
  const [name, setName] = useState(profile?.name || user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingName, setSavingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Orders / Billing state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
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

  const handleSaveName = async (e) => {
    e.preventDefault();
    setSavingName(true);
    setSaveSuccess(false);

    try {
      if (isSupabaseConfigured && user) {
        await supabase
          .from('profiles')
          .update({ name: name.trim() })
          .eq('id', user.id);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
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
        setPasswordMsg({ type: 'success', text: 'Password successfully set! You can now log in with email or Google.' });
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const userInitials = (name || user?.email || 'A')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-ivory">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Top Verified User Card */}
        <div className="bg-white rounded-3xl border border-champagne/80 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-wine/10 text-wine border-2 border-champagne flex items-center justify-center font-heading text-2xl font-bold shrink-0">
            {userInitials}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-wine">
                {name || 'Wedding Host'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={12} className="text-emerald-700" />
                Verified
              </span>
            </div>
            <p className="font-body text-xs sm:text-sm text-charcoal/70">
              {email}
            </p>
            <p className="font-body text-[11px] text-charcoal/40 mt-1">
              Member since November 2026
            </p>
          </div>

          <Link
            to="/dashboard"
            className="py-2.5 px-5 rounded-full bg-wine hover:bg-gold text-white font-body text-xs font-semibold uppercase tracking-wider shadow-xs transition-colors shrink-0"
          >
            My Invitations
          </Link>
        </div>

        {/* Split Settings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Left Vertical Nav */}
          <div className="bg-white rounded-2xl border border-champagne/80 p-3 shadow-2xs space-y-1 text-xs font-semibold font-body">
            {[
              { id: 'account', label: 'Account details', icon: User },
              { id: 'password', label: 'Password', icon: Key },
              { id: 'billing', label: 'Billing', icon: CreditCard },
              { id: 'actions', label: 'Account actions', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-wine text-white shadow-2xs'
                      : 'text-charcoal/70 hover:bg-champagne/20 hover:text-wine'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => signOut()}
              className="w-full py-2.5 px-3.5 rounded-xl text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 transition-colors pt-3 border-t border-champagne/40"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>

          {/* Right Content Panels */}
          <div className="md:col-span-3 space-y-6">
            {/* Account Details Tab */}
            {activeTab === 'account' && (
              <div className="bg-white rounded-3xl border border-champagne/80 p-6 sm:p-8 shadow-xs">
                <h2 className="font-heading text-lg font-bold text-wine mb-1">
                  Account details
                </h2>
                <p className="font-body text-xs text-charcoal/60 mb-6">
                  Update your name and the email address you sign in with.
                </p>

                <form onSubmit={handleSaveName} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-ivory text-xs sm:text-sm text-charcoal/60 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-charcoal/40 mt-1">
                      Email is linked to your authentication provider.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={savingName}
                      className="py-2.5 px-6 rounded-full bg-wine hover:bg-gold text-white font-body text-xs font-bold uppercase tracking-wider shadow-xs transition-all disabled:opacity-50"
                    >
                      {savingName ? 'Saving...' : 'Save changes'}
                    </button>
                    {saveSuccess && (
                      <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                        <Check size={14} />
                        Saved!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Set Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-3xl border border-champagne/80 p-6 sm:p-8 shadow-xs">
                <h2 className="font-heading text-lg font-bold text-wine mb-1">
                  Set a password
                </h2>
                <p className="font-body text-xs text-charcoal/60 mb-6 leading-relaxed">
                  Adding a password lets you sign in with your email directly as well - it doesn't remove Google sign-in.
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

                <form onSubmit={handleSetPassword} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                      New password
                    </label>
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-champagne bg-white text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="py-2.5 px-6 rounded-full bg-wine hover:bg-gold text-white font-body text-xs font-bold uppercase tracking-wider shadow-xs transition-all disabled:opacity-50"
                    >
                      {savingPassword ? 'Updating...' : 'Set password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="bg-white rounded-3xl border border-champagne/80 p-6 sm:p-8 shadow-xs">
                <h2 className="font-heading text-lg font-bold text-wine mb-1">
                  Billing
                </h2>
                <p className="font-body text-xs text-charcoal/60 mb-6">
                  Your purchases, invoices, and active packages.
                </p>

                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-champagne bg-ivory/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-wine capitalize block">
                            {ord.type === 'extra_guests' ? '50 Extra Personalized Guests' : `${ord.package_id || 'Signature'} Wedding Package`}
                          </span>
                          <span className="text-[11px] text-charcoal/50">
                            Order ID: {ord.razorpay_order_id || ord.id.substring(0, 8)} • {new Date(ord.created_at).toLocaleDateString('en-IN')}
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
                  <div className="p-8 rounded-2xl border border-dashed border-champagne bg-ivory/50 text-center text-xs text-charcoal/60">
                    <p className="font-semibold text-charcoal/70 mb-1">No purchases yet</p>
                    <p>Your invitation purchases and add-on orders will appear here with their receipts.</p>
                  </div>
                )}
              </div>
            )}

            {/* Account Actions Tab */}
            {activeTab === 'actions' && (
              <div className="bg-white rounded-3xl border border-champagne/80 p-6 sm:p-8 shadow-xs">
                <h2 className="font-heading text-lg font-bold text-wine mb-1">
                  Account actions
                </h2>
                <p className="font-body text-xs text-charcoal/60 mb-6">
                  Sign out, or manage your active login sessions.
                </p>

                <div className="space-y-3">
                  <div
                    onClick={() => signOut()}
                    className="p-4 rounded-2xl border border-champagne bg-ivory/40 hover:bg-champagne/20 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-bold text-charcoal block">Sign out</span>
                      <span className="text-charcoal/50 text-[11px]">Sign out of your account on this device.</span>
                    </div>
                    <ChevronRight size={16} className="text-charcoal/40" />
                  </div>

                  <div
                    onClick={() => alert('To delete your account, please contact support via WhatsApp so we can confirm no active published guest links are disrupted.')}
                    className="p-4 rounded-2xl border border-champagne bg-ivory/40 hover:bg-rose-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-bold text-rose-700 block">Delete account</span>
                      <span className="text-charcoal/50 text-[11px]">Permanently remove your account and stored drafts.</span>
                    </div>
                    <ChevronRight size={16} className="text-rose-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
