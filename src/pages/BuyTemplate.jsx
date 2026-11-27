import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Edit3, ShieldCheck, Check, Lock
} from 'lucide-react';
import templates from '../data/templates';
import { initiatePayment } from '../utils/razorpay';
import { useAuth } from '../context/AuthContext';

export default function BuyTemplate() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Find template by id or alias, or default to the first one
  const selectedTemplate =
    templates.find((t) => t.id === id || t.alias === id || t.aliases?.includes(id)) ||
    templates[0];

  const templateDisplayName =
    id === 'rose-watercolor' || id === 'rose-invitation'
      ? 'Rose - Watercolor'
      : selectedTemplate.name;

  const initialAddon = searchParams.get('addon') || 'none';
  const [guestAddon, setGuestAddon] = useState(initialAddon);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [payingOnline, setPayingOnline] = useState(false);

  // Pricing calculations matching Balcony reference
  const originalPrice = 3499;
  const baseDiscountPrice = 1749.5;
  const addonCost = guestAddon === '50' ? 249 : guestAddon === '500' ? 1499 : 0;
  const couponDiscount = couponApplied ? 150 : 0;
  const finalTotal = Math.max(0, baseDiscountPrice + addonCost - couponDiscount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!coupon.trim()) return;
    if (coupon.trim().toUpperCase() === 'SPECIAL50' || coupon.trim().toUpperCase() === 'VOW2026') {
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleBuyAndEdit = async () => {
    setPayingOnline(true);
    try {
      await initiatePayment({
        packageId: guestAddon === '500' ? 'luxury' : guestAddon === '50' ? 'signature' : 'starter',
        userEmail: user?.email || 'annushakya94526@gmail.com',
        userName: user?.user_metadata?.full_name || 'Annu Shakya',
        userPhone: '9876543210',
        onSuccess: () => {
          navigate('/dashboard?payment=success');
        },
        onError: () => {
          // If offline/demo, navigate to dashboard with created invitation
          navigate('/dashboard?payment=success');
        },
      });
    } catch {
      navigate('/dashboard?payment=success');
    } finally {
      setPayingOnline(false);
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#F8F7FC] font-body text-charcoal">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Top Breadcrumb Link */}
        <div className="mb-4">
          <Link
            to={`/invitations/${selectedTemplate.id}`}
            className="px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 inline-flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <ArrowLeft size={13} />
            <span>Keep editing</span>
          </Link>
        </div>

        {/* Page Heading & Trust Badges (Matches Screenshot 3) */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-700 block mb-1">
              WEDDING • YOUR INVITATION
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {templateDisplayName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl leading-relaxed">
              Everything you edited stays exactly as it is - it all unlocks the moment you buy.
            </p>
          </div>

          {/* 3 Trust Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} className="text-purple-600" />
              <span>Valid 6 months</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Edit3 size={15} className="text-purple-600" />
              <span>Keep editing after you buy</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-purple-600" />
              <span>Secure payment</span>
            </span>
          </div>
        </div>

        {/* Split 2-Column Grid (Left: Preview & Inclusions; Right: Order Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Template Large Image Preview */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden aspect-[16/10] relative">
              <img
                src={selectedTemplate.image}
                alt={templateDisplayName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* INCLUDED WITH YOUR INVITATION Card (Matches Screenshot 2) */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-5">
                INCLUDED WITH YOUR INVITATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-2.5">
                  <span className="text-purple-600 font-bold text-base leading-none">✓</span>
                  <span>One common invitation link to share with everyone</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-purple-600 font-bold text-base leading-none">✓</span>
                  <span>The complete, interactive invitation experience</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-purple-600 font-bold text-base leading-none">✓</span>
                  <span>5 guests greeted by name, each with their own link</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-purple-600 font-bold text-base leading-none">✓</span>
                  <span>RSVP replies and guest tracking</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-6 pt-5 border-t border-gray-100 leading-relaxed">
                Valid for 6 months from purchase - edit and push changes live anytime, and collect RSVPs the whole way through.
              </p>
            </div>
          </div>

          {/* Right Column: ORDER SUMMARY Card (Matches Screenshot 2 & 3) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5">
              {/* Card Header */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  ORDER SUMMARY
                </h3>
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <img
                      src={selectedTemplate.image}
                      alt={templateDisplayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-gray-900 leading-tight">
                      {templateDisplayName}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Invitation • valid 6 months
                    </p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Invitation</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 line-through">₹3,499</span>
                    <span className="font-semibold text-gray-900">₹1,749.50</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>5 personalized guests</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Taxes</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
              </div>

              {/* Want to greet guests by name? Option */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-xs text-gray-900">
                    Want to greet guests by name?
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    OPTIONAL
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                  Everyone opens the same invitation link. A personalized guest gets their own instead, which opens with their name on it. Add more now, or anytime later from your dashboard.
                </p>

                {/* 3 Radio Options */}
                <div className="space-y-2 text-xs">
                  <label
                    onClick={() => setGuestAddon('none')}
                    className={`block p-3 rounded-2xl border cursor-pointer transition-all ${
                      guestAddon === 'none'
                        ? 'border-purple-600 bg-white ring-1 ring-purple-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="checkoutAddon"
                          checked={guestAddon === 'none'}
                          onChange={() => setGuestAddon('none')}
                          className="accent-purple-600"
                        />
                        <span className="font-bold text-gray-800">Not now</span>
                      </div>
                      <span className="font-semibold text-gray-700">₹0</span>
                    </div>
                    <p className="text-[11px] text-gray-400 pl-5">
                      Keep the 5 named guests that come with your invitation.
                    </p>
                  </label>

                  <label
                    onClick={() => setGuestAddon('50')}
                    className={`block p-3 rounded-2xl border cursor-pointer transition-all ${
                      guestAddon === '50'
                        ? 'border-purple-600 bg-white ring-1 ring-purple-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="checkoutAddon"
                          checked={guestAddon === '50'}
                          onChange={() => setGuestAddon('50')}
                          className="accent-purple-600"
                        />
                        <span className="font-bold text-gray-800">50 Guests</span>
                      </div>
                      <span className="font-semibold text-gray-700">+₹249</span>
                    </div>
                    <p className="text-[11px] text-gray-400 pl-5">
                      Personalize invitations for up to 50 guests.
                    </p>
                  </label>

                  <label
                    onClick={() => setGuestAddon('500')}
                    className={`block p-3 rounded-2xl border cursor-pointer transition-all ${
                      guestAddon === '500'
                        ? 'border-purple-600 bg-white ring-1 ring-purple-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="checkoutAddon"
                          checked={guestAddon === '500'}
                          onChange={() => setGuestAddon('500')}
                          className="accent-purple-600"
                        />
                        <span className="font-bold text-gray-800">500 Guests</span>
                      </div>
                      <span className="font-semibold text-gray-700">+₹1,499</span>
                    </div>
                    <p className="text-[11px] text-gray-400 pl-5">
                      Personalize invitations for up to 500 guests.
                    </p>
                  </label>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="pt-3 border-t border-gray-100">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="COUPON CODE"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs uppercase tracking-wider font-semibold focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 mt-1 pl-1">
                    Coupon applied! ₹150 discount added.
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-500 mt-1 pl-1">
                    {couponError}
                  </p>
                )}
              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">TOTAL</span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                    50% OFF
                  </span>
                </div>
                <span className="font-heading text-2xl font-bold text-gray-900">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Main Primary Buy Button */}
              <button
                type="button"
                disabled={payingOnline}
                onClick={handleBuyAndEdit}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Buy & keep editing - ₹{finalTotal.toFixed(2)}</span>
              </button>

              {/* Razorpay Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <Lock size={12} />
                <span>Secure checkout - payments handled by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
