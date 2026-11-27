import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShoppingBag, Smartphone, Monitor, RotateCcw,
  UserCheck, Volume2, VolumeX, Edit3, Eye
} from 'lucide-react';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import templates from '../data/templates';
import TemplateRenderer from '../components/invitation/TemplateRenderer';

export default function InvitationPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find template by id or alias, or default to first
  const template = templates.find((t) => t.id === id || t.alias === id || t.aliases?.includes(id)) || templates[0];
  const templateDisplayName =
    id === 'rose-watercolor' || id === 'rose-invitation'
      ? 'Rose - Watercolor'
      : template.name;
  const { themeStyles } = template;

  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [guestName, setGuestName] = useState('Mr. Joshi and Family');
  const [dynamicContent, setDynamicContent] = useState(template.defaultData || template.sampleData);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [guestAddon, setGuestAddon] = useState('none');

  // Fetch Supabase default_content for this template if configured
  useEffect(() => {
    let isMounted = true;
    async function loadTemplateContent() {
      if (!isSupabaseConfigured) return;
      try {
        const { data } = await supabase
          .from('templates')
          .select('default_content')
          .eq('slug', template.id)
          .maybeSingle();

        if (isMounted && data?.default_content) {
          setDynamicContent((prev) => ({
            ...prev,
            ...data.default_content,
          }));
        }
      } catch (err) {
        // Fallback silently to template.sampleData
      }
    }

    loadTemplateContent();
    return () => {
      isMounted = false;
    };
  }, [template.id]);

  const basePrice = 1749.5;
  const addonCost = guestAddon === '50' ? 249 : guestAddon === '500' ? 1499 : 0;
  const totalModalPrice = (basePrice + addonCost).toFixed(2);

  return (
    <div className="pt-16 min-h-screen bg-[#FAF8F5]">
      {/* Top Floating Preview Action Bar (Matches Reference Exactly) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="container-custom mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Back Button & "This is what your guests will see" indicator */}
          <div className="flex items-center gap-3">
            <Link
              to="/templates"
              className="px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </Link>

            <span className="text-xs font-semibold text-[#512D38] flex items-center gap-1.5">
              <Eye size={14} className="text-[#B69A70]" />
              <span>This is what your guests will see</span>
            </span>
          </div>

          {/* Right: Try Editing CTA */}
          <div className="flex items-center gap-3">
            <Link
              to={`/dashboard/invitations/create?template=${template.id}`}
              className="px-4 py-1.5 rounded-full border border-[#B69A70]/40 text-[#512D38] bg-white hover:bg-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Edit3 size={13} className="text-[#B69A70]" />
              <span>Try editing</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Repeating Diagonal Watermark Grid (Matches Screenshot 1 trial/preview mode) */}
      <div
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none opacity-[0.04] flex flex-wrap gap-x-24 gap-y-16 -rotate-12 scale-125 items-center justify-center"
        aria-hidden="true"
      >
        {Array.from({ length: 90 }).map((_, i) => (
          <span
            key={i}
            className="font-heading text-4xl sm:text-5xl font-black tracking-widest text-[#512D38] uppercase"
          >
            Aahvaaan
          </span>
        ))}
      </div>

      {/* Main Preview Container */}
      <div className="w-full relative z-10">
        <TemplateRenderer
          template={template}
          content={dynamicContent}
          guestName={guestName}
          isPreview={true}
        />
      </div>

      {/* Floating Bottom Right Action: Buy This Template Button */}
      <div className="fixed bottom-6 right-6 z-40 pointer-events-none">
        {/* Buy This Template Trigger Button */}
        <button
          type="button"
          onClick={() => setShowBuyModal(true)}
          className="pointer-events-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#512D38] via-[#6B3D4A] to-[#8C3A50] hover:from-[#3E212A] hover:to-[#732F42] text-[#FAF7F2] font-body font-semibold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2 border border-[#B69A70]/50 transition-all cursor-pointer"
        >
          <ShoppingBag size={15} className="text-[#B69A70]" />
          <span>Buy this template</span>
        </button>
      </div>

      {/* ─── EXACT MODAL FROM SCREENSHOT 1 ─── */}
      <AnimatePresence>
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-left relative max-h-[92vh] overflow-y-auto"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#512D38] block mb-1">
                WEDDING
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-5">
                {templateDisplayName}
              </h3>

              {/* Your Invitation Box (Royal Wine border with warm ivory bg) */}
              <div className="rounded-2xl border border-[#512D38]/20 bg-[#FAF7F2] p-5 mb-5 text-xs text-gray-700 space-y-2.5">
                <h4 className="font-bold text-[#512D38] text-sm mb-3">Your Invitation</h4>
                <div className="flex items-start gap-2">
                  <span className="text-[#B69A70] font-bold">✓</span>
                  <span>One common invitation link to share with everyone</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#B69A70] font-bold">✓</span>
                  <span>The complete, interactive invitation experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#B69A70] font-bold">✓</span>
                  <span>5 guests greeted by name, each with their own link</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#B69A70] font-bold">✓</span>
                  <span>RSVP replies and guest tracking</span>
                </div>
              </div>

              {/* Want to greet guests by name? */}
              <div className="mb-6">
                <h4 className="font-bold text-sm text-gray-900 mb-1">
                  Want to greet guests by name?
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  Everyone opens the same invitation link. A personalized guest gets their own instead, which opens with their name on it. Add more now, or anytime later from your dashboard.
                </p>

                {/* 3 Radio options matching refined palette */}
                <div className="space-y-2 text-xs">
                  <label
                    onClick={() => setGuestAddon('none')}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      guestAddon === 'none'
                        ? 'border-[#512D38] bg-[#FAF7F2] ring-1 ring-[#512D38]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="modalAddon"
                        checked={guestAddon === 'none'}
                        onChange={() => setGuestAddon('none')}
                        className="accent-[#512D38]"
                      />
                      <span className="font-semibold text-gray-800">Not now</span>
                    </div>
                    <span className="font-semibold text-gray-700">₹0</span>
                  </label>

                  <label
                    onClick={() => setGuestAddon('50')}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      guestAddon === '50'
                        ? 'border-[#512D38] bg-[#FAF7F2] ring-1 ring-[#512D38]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="modalAddon"
                        checked={guestAddon === '50'}
                        onChange={() => setGuestAddon('50')}
                        className="accent-[#512D38]"
                      />
                      <span className="font-semibold text-gray-800">50 Guests</span>
                    </div>
                    <span className="font-semibold text-gray-700">+₹249</span>
                  </label>

                  <label
                    onClick={() => setGuestAddon('500')}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      guestAddon === '500'
                        ? 'border-[#512D38] bg-[#FAF7F2] ring-1 ring-[#512D38]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="modalAddon"
                        checked={guestAddon === '500'}
                        onChange={() => setGuestAddon('500')}
                        className="accent-[#512D38]"
                      />
                      <span className="font-semibold text-gray-800">500 Guests</span>
                    </div>
                    <span className="font-semibold text-gray-700">+₹1,499</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    TOTAL
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">₹3,499</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{totalModalPrice}
                    </span>
                    <span className="text-[10px] font-bold text-[#512D38] bg-[#512D38]/10 border border-[#512D38]/20 px-2 py-0.5 rounded-full">
                      50% OFF
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowBuyModal(false)}
                    className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/buy/${template.id}/checkout?addon=${guestAddon}`)}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#512D38] via-[#6B3D4A] to-[#8C3A50] hover:from-[#3E212A] hover:to-[#732F42] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all border border-[#B69A70]/30"
                  >
                    Proceed to Buy
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
