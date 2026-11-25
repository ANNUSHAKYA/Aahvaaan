import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Eye, Users, Edit3, Share2, Copy, Check,
  ExternalLink, Calendar, X, MessageCircle, BarChart2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import templates from '../data/templates';
import packages from '../data/pricing';
import GuestListManager from '../components/dashboard/GuestListManager';
import AnalyticsModal from '../components/dashboard/AnalyticsModal';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    templateSlug: 'champagne-and-rose',
    packageId: 'signature',
    brideName: '',
    groomName: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Share Modal state
  const [activeShareInvite, setActiveShareInvite] = useState(null);
  const [copied, setCopied] = useState(false);

  // Guest Management Modal state
  const [activeGuestInvite, setActiveGuestInvite] = useState(null);

  // Analytics Modal state
  const [activeAnalyticsInvite, setActiveAnalyticsInvite] = useState(null);

  // Fetch host's invitations with resilient schema fallback
  const fetchInvitations = async () => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      let data = null;

      // 1. Try owner_id
      const res1 = await supabase
        .from('invitations')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (!res1.error && res1.data) {
        data = res1.data;
      } else {
        // 2. Try host_id
        const res2 = await supabase
          .from('invitations')
          .select('*')
          .eq('host_id', user.id)
          .order('created_at', { ascending: false });

        if (!res2.error && res2.data) {
          data = res2.data;
        } else {
          // 3. Fallback select all with client-side filter
          const res3 = await supabase
            .from('invitations')
            .select('*')
            .order('created_at', { ascending: false });

          if (!res3.error && res3.data) {
            data = res3.data.filter(
              (inv) =>
                inv.owner_id === user.id ||
                inv.host_id === user.id ||
                inv.user_id === user.id
            );
          } else {
            data = [];
          }
        }
      }

      // Enrich with RSVP counts safely
      const enriched = await Promise.all(
        (data || []).map(async (inv) => {
          try {
            const { count: rsvpCount } = await supabase
              .from('rsvps')
              .select('*', { count: 'exact', head: true })
              .eq('invitation_id', inv.id);

            return {
              ...inv,
              rsvpCount: rsvpCount || 0,
            };
          } catch {
            return { ...inv, rsvpCount: 0 };
          }
        })
      );

      setInvitations(enriched);
    } catch (err) {
      console.warn('Dashboard fetch notice:', err);
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  // Handle Create New Invitation Draft
  const handleCreateInvitation = async (e) => {
    e.preventDefault();
    if (!createForm.brideName.trim() || !createForm.groomName.trim()) return;

    setCreating(true);
    setCreateError(null);

    try {
      const selectedTmpl = templates.find((t) => t.id === createForm.templateSlug) || templates[0];
      const cleanBride = createForm.brideName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanGroom = createForm.groomName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedSlug = `${cleanBride}-${cleanGroom}-${randomSuffix}`;
      const commonCode = Math.random().toString(36).substring(2, 8);

      const draftPayload = {
        brideName: createForm.brideName.trim(),
        groomName: createForm.groomName.trim(),
        brideFormal: `Kum. ${createForm.brideName.trim()}`,
        groomFormal: `Chi. ${createForm.groomName.trim()}`,
        shloka: selectedTmpl.sampleData?.shloka || '|| श्री गणेशाय नमः ||',
        weddingDate: '2027-02-22',
        location: 'Jaipur, Rajasthan',
        venue: 'The Oberoi Rajvilas, Jaipur',
        mapUrl: 'https://maps.google.com/?q=The+Oberoi+Rajvilas+Jaipur',
        coupleStory: selectedTmpl.sampleData?.coupleStory || '',
        events: selectedTmpl.sampleData?.events || [],
        lineage: selectedTmpl.sampleData?.brideLineage || {},
        audio: { enabled: true },
      };

      let insertPayload = {
        owner_id: user.id,
        host_id: user.id,
        template_id: createForm.templateSlug,
        slug: generatedSlug,
        common_code: commonCode,
        status: 'draft',
        package: createForm.packageId,
        package_id: createForm.packageId,
        draft_content: draftPayload,
        published_content: draftPayload,
        personalized_limit: createForm.packageId === 'luxury' ? 50 : createForm.packageId === 'signature' ? 20 : 5,
        bride_name: createForm.brideName.trim(),
        groom_name: createForm.groomName.trim(),
        wedding_date: '2027-02-22',
        location: 'Jaipur, Rajasthan',
        venue: 'The Oberoi Rajvilas, Jaipur',
      };

      let { data, error: insertError } = await supabase
        .from('invitations')
        .insert(insertPayload)
        .select()
        .single();

      // Fallback if table doesn't have owner_id column
      if (insertError && (insertError.message?.includes('owner_id') || insertError.code === '42703')) {
        delete insertPayload.owner_id;
        const fallback = await supabase
          .from('invitations')
          .insert(insertPayload)
          .select()
          .single();

        if (!fallback.error) {
          data = fallback.data;
          insertError = null;
        }
      }

      // Fallback if table doesn't have host_id column
      if (insertError && (insertError.message?.includes('host_id') || insertError.code === '42703')) {
        delete insertPayload.host_id;
        insertPayload.owner_id = user.id;
        const fallback2 = await supabase
          .from('invitations')
          .insert(insertPayload)
          .select()
          .single();

        if (!fallback2.error) {
          data = fallback2.data;
          insertError = null;
        }
      }

      if (insertError) throw insertError;

      setShowCreateModal(false);
      setCreateForm({
        templateSlug: 'champagne-and-rose',
        packageId: 'signature',
        brideName: '',
        groomName: '',
      });

      if (data?.id) {
        navigate(`/dashboard/invitations/${data.id}/edit`);
      } else {
        await fetchInvitations();
      }
    } catch (err) {
      console.error('Error creating invitation draft:', err);
      setCreateError(err.message || 'Failed to create invitation draft.');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#F8F7FC]">
      <div className="container-custom mx-auto px-4 sm:px-8 max-w-6xl">
        {/* Breadcrumb & Section Title */}
        <div className="mb-8">
          <span className="text-[11px] font-body text-charcoal/50 uppercase tracking-widest font-semibold block mb-1">
            DASHBOARD
          </span>
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              My invitations
            </h1>
            {invitations.length > 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-body text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Plus size={15} />
                <span>Create invitation</span>
              </button>
            )}
          </div>
        </div>

        {/* Content State: Loading, Empty, or Populated Grid */}
        {loading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] max-w-4xl mx-auto">
            <div className="w-9 h-9 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin mx-auto mb-3" />
            <p className="font-body text-xs text-charcoal/60">Loading your invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          /* Empty State (Exact Balcony Reference Layout from Screenshot 2) */
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-12 sm:p-16 text-center max-w-4xl mx-auto my-4">
            <div className="text-4xl mb-4 select-none">💌</div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-charcoal mb-2">
              No invitations yet
            </h3>
            <p className="font-body text-xs sm:text-sm text-charcoal/60 leading-relaxed max-w-lg mx-auto mb-7">
              Pick a template and start editing your invitation right inside the design. Every invitation comes with a link to share with everyone, and 5 personalized guest invitations.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/templates"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-body text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                Browse templates
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Invitations Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv) => {
              const tmpl = templates.find((t) => t.id === inv.template_id || t.alias === inv.template_id) || templates[0];
              const content = inv.published_content || inv.draft_content || {};
              const coupleTitle = content.brideName && content.groomName
                ? `${content.brideName} & ${content.groomName}`
                : 'Wedding Celebration';

              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-3xl border border-gray-100/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Preview */}
                    <div className="relative aspect-[16/10] bg-champagne/20 overflow-hidden">
                      <img
                        src={tmpl.image}
                        alt={tmpl.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider text-wine shadow-xs">
                        {tmpl.name}
                      </div>
                      <div
                        className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-xs ${
                          inv.status === 'published'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status === 'published' ? `Published (${inv.updates_used || 0}/3)` : 'Draft'}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-bold text-charcoal mb-1">
                        {coupleTitle}
                      </h3>
                      <p className="font-body text-xs text-charcoal/60 mb-4 truncate">
                        /{inv.slug} • Package: <span className="capitalize font-semibold text-wine">{inv.package || 'signature'}</span>
                      </p>

                      {/* Metrics Pill */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-ivory/60 border border-champagne/40 text-center mb-2">
                        <div>
                          <span className="text-[10px] text-charcoal/50 block font-semibold">VIEWS</span>
                          <span className="font-heading text-base font-bold text-wine flex items-center justify-center gap-1">
                            <Eye size={12} className="text-gold" />
                            {inv.view_count || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-charcoal/50 block font-semibold">RSVPS</span>
                          <span className="font-heading text-base font-bold text-wine flex items-center justify-center gap-1">
                            <Users size={12} className="text-gold" />
                            {inv.rsvpCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="p-5 pt-0">
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        to={`/dashboard/invitations/${inv.id}/edit`}
                        className="py-2 px-2 rounded-xl border border-wine/20 text-wine hover:bg-wine hover:text-white font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                        title="Edit invitation"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </Link>

                      <Link
                        to={`/invite/${inv.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2 rounded-xl border border-gray-200 hover:border-wine text-charcoal font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                        title="Open live preview"
                      >
                        <ExternalLink size={13} />
                        <span>Preview</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setActiveShareInvite(inv)}
                        className="py-2 px-2 rounded-xl bg-wine text-white hover:bg-wine/90 font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1 shadow-2xs transition-colors"
                        title="Share on WhatsApp"
                      >
                        <Share2 size={13} />
                        <span>Share</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setActiveGuestInvite(inv)}
                        className="py-2 px-2 rounded-xl bg-ivory hover:bg-wine hover:text-white border border-champagne text-wine font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        title="Manage guest list and personal invitations"
                      >
                        <Users size={13} />
                        <span>Guests & RSVPs</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveAnalyticsInvite(inv)}
                        className="py-2 px-2 rounded-xl bg-ivory hover:bg-wine hover:text-white border border-champagne text-wine font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        title="View analytics and reports"
                      >
                        <BarChart2 size={13} />
                        <span>Analytics</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── CREATE INVITATION MODAL ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-100 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-charcoal/40 hover:text-wine p-1 rounded-lg"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-body text-wine uppercase tracking-widest font-bold block mb-1">
                  NEW CELEBRATION
                </span>
                <h3 className="font-heading text-2xl font-bold text-charcoal">
                  Create Wedding Invitation
                </h3>
                <p className="font-body text-xs text-charcoal/60">
                  Select your signature design and package to generate your draft
                </p>
              </div>

              {createError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateInvitation} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-body text-xs font-semibold text-charcoal mb-1">
                      Bride's Name
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.brideName}
                      onChange={(e) => setCreateForm({ ...createForm, brideName: e.target.value })}
                      placeholder="e.g. Ananya"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-body text-xs focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs font-semibold text-charcoal mb-1">
                      Groom's Name
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.groomName}
                      onChange={(e) => setCreateForm({ ...createForm, groomName: e.target.value })}
                      placeholder="e.g. Kabir"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-body text-xs focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block font-body text-xs font-semibold text-charcoal mb-1.5">
                    Choose Signature Template
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, templateSlug: t.id })}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          createForm.templateSlug === t.id
                            ? 'border-wine bg-wine/5 shadow-2xs font-semibold text-wine'
                            : 'border-gray-200 hover:border-wine/50 text-charcoal'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-gray-300"
                          style={{ backgroundColor: t.themeStyles?.buttonBg || '#6B1D2F' }}
                        />
                        <span className="font-heading text-xs truncate">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Package Selection */}
                <div>
                  <label className="block font-body text-xs font-semibold text-charcoal mb-1.5">
                    Choose Package Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, packageId: pkg.id })}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          createForm.packageId === pkg.id
                            ? 'border-wine bg-wine text-white font-semibold shadow-2xs'
                            : 'border-gray-200 text-charcoal hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs block font-heading">{pkg.name}</span>
                        <span className="text-[10px] block opacity-80">{pkg.priceDisplay}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-3.5 rounded-full bg-wine hover:bg-wine/90 text-white font-body text-xs font-semibold tracking-wide shadow-md transition-all disabled:opacity-50"
                  >
                    {creating ? 'Creating Draft...' : 'Create Draft & Start Editing'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SHARE MODAL ─── */}
      <AnimatePresence>
        {activeShareInvite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-gray-100 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setActiveShareInvite(null)}
                className="absolute top-5 right-5 text-charcoal/40 hover:text-wine p-1 rounded-lg"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Share2 size={22} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-charcoal mb-1">
                  Share Your Invitation
                </h3>
                <p className="font-body text-xs text-charcoal/60">
                  Send this common web link to family groups or broadcast lists
                </p>
              </div>

              {/* URL box */}
              <div className="p-3 bg-ivory rounded-xl border border-gray-200 flex items-center justify-between gap-2 mb-6 text-xs font-mono text-wine">
                <span className="truncate">
                  {`${window.location.origin}/invite/${activeShareInvite.slug}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyLink(`${window.location.origin}/invite/${activeShareInvite.slug}`)}
                  className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-wine text-charcoal hover:text-wine flex-shrink-0 transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Direct WhatsApp Share button */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `With joyful hearts, we warmly invite you to celebrate our wedding! Tap the link below to open your digital wedding invitation:\n${window.location.origin}/invite/${activeShareInvite.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-body text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle size={16} />
                <span>Share Directly on WhatsApp</span>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guest List & RSVP Manager Modal */}
      {activeGuestInvite && (
        <GuestListManager
          invitation={activeGuestInvite}
          onClose={() => setActiveGuestInvite(null)}
          onRefreshMetrics={fetchInvitations}
        />
      )}

      {/* Analytics & Catering Insights Modal */}
      {activeAnalyticsInvite && (
        <AnalyticsModal
          invitation={activeAnalyticsInvite}
          onClose={() => setActiveAnalyticsInvite(null)}
        />
      )}
    </div>
  );
}
