import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Eye, Users, Edit3, Share2, Copy, Check,
  ExternalLink, Sparkles, AlertCircle, Heart, Calendar,
  Clock, MapPin, X, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import templates from '../data/templates';
import packages from '../data/pricing';
import GuestListManager from '../components/dashboard/GuestListManager';

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    templateSlug: 'champagne-and-rose',
    packageId: 'signature',
    brideName: '',
    groomName: '',
  });
  const [creating, setCreating] = useState(false);

  // Share Modal state
  const [activeShareInvite, setActiveShareInvite] = useState(null);
  const [copied, setCopied] = useState(false);

  // Guest Management Modal state
  const [activeGuestInvite, setActiveGuestInvite] = useState(null);

  // Fetch host's invitations
  const fetchInvitations = async () => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch invitations
      const { data, error: invError } = await supabase
        .from('invitations')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (invError) throw invError;

      // 2. For each invitation, fetch RSVP counts
      const enriched = await Promise.all(
        (data || []).map(async (inv) => {
          const { count: rsvpCount } = await supabase
            .from('rsvps')
            .select('*', { count: 'exact', head: true })
            .eq('invitation_id', inv.id);

          return {
            ...inv,
            rsvpCount: rsvpCount || 0,
          };
        })
      );

      setInvitations(enriched);
    } catch (err) {
      console.error('Error fetching dashboard invitations:', err);
      setError(err.message || 'Unable to load invitations.');
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
    setError(null);

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
        shloka: selectedTmpl.sampleData.shloka,
        weddingDate: '2027-02-22',
        location: 'Jaipur, Rajasthan',
        venue: 'The Oberoi Rajvilas, Jaipur',
        mapUrl: 'https://maps.google.com/?q=The+Oberoi+Rajvilas+Jaipur',
        coupleStory: selectedTmpl.sampleData.coupleStory,
        events: selectedTmpl.sampleData.events,
        lineage: selectedTmpl.sampleData.brideLineage,
        audio: { enabled: true },
      };

      const { data, error: insertError } = await supabase
        .from('invitations')
        .insert({
          owner_id: user.id,
          template_id: createForm.templateSlug,
          slug: generatedSlug,
          common_code: commonCode,
          status: 'draft',
          package: createForm.packageId,
          draft_content: draftPayload,
          published_content: draftPayload,
          personalized_limit: createForm.packageId === 'luxury' ? 50 : createForm.packageId === 'signature' ? 20 : 5,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setShowCreateModal(false);
      setCreateForm({
        templateSlug: 'champagne-and-rose',
        packageId: 'signature',
        brideName: '',
        groomName: '',
      });

      // Navigate directly into the invitation live editor
      if (data?.id) {
        navigate(`/dashboard/invitations/${data.id}/edit`);
      } else {
        await fetchInvitations();
      }
    } catch (err) {
      console.error('Error creating invitation draft:', err);
      setError(err.message || 'Failed to create invitation draft.');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stats calculation
  const totalViews = invitations.reduce((acc, inv) => acc + (inv.view_count || 0), 0);
  const totalRsvps = invitations.reduce((acc, inv) => acc + (inv.rsvpCount || 0), 0);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-ivory">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-champagne/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne/50 text-wine text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={12} className="text-gold" />
              <span>Host Dashboard</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-wine">
              Namaste, {profile?.name || user?.email?.split('@')[0]}
            </h1>
            <p className="font-body text-xs sm:text-sm text-charcoal/70 mt-1">
              Manage your digital wedding websites, track live views & monitor guest RSVPs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-xs uppercase tracking-widest font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Create Invitation</span>
            </button>

            <button
              onClick={signOut}
              className="px-4 py-2.5 rounded-xl border border-wine/20 text-wine hover:bg-wine hover:text-white font-body text-xs font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-champagne shadow-xs">
            <span className="text-[10px] font-body text-charcoal/50 uppercase tracking-wider block font-semibold mb-1">
              Total Invitations
            </span>
            <span className="font-heading text-3xl font-bold text-wine">
              {invitations.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-champagne shadow-xs">
            <span className="text-[10px] font-body text-charcoal/50 uppercase tracking-wider block font-semibold mb-1">
              Total Guest Views
            </span>
            <span className="font-heading text-3xl font-bold text-wine">
              {totalViews}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-champagne shadow-xs">
            <span className="text-[10px] font-body text-charcoal/50 uppercase tracking-wider block font-semibold mb-1">
              Total Responses
            </span>
            <span className="font-heading text-3xl font-bold text-wine">
              {totalRsvps}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-champagne shadow-xs">
            <span className="text-[10px] font-body text-charcoal/50 uppercase tracking-wider block font-semibold mb-1">
              Active Package
            </span>
            <span className="font-heading text-2xl font-bold text-gold capitalize">
              {invitations[0]?.package || 'Signature'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Invitations List Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-wine">
              My Wedding Invitations
            </h2>
            <span className="text-xs font-body text-charcoal/60">
              Showing {invitations.length} {invitations.length === 1 ? 'invitation' : 'invitations'}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-champagne">
              <div className="w-10 h-10 rounded-full border-2 border-wine border-t-transparent animate-spin mx-auto mb-3" />
              <p className="font-heading text-base font-bold text-wine">Loading your invitations...</p>
            </div>
          ) : invitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((inv) => {
                const tmpl = templates.find((t) => t.id === inv.template_id) || templates[0];
                const content = inv.published_content || inv.draft_content || {};
                const coupleTitle = content.brideName && content.groomName
                  ? `${content.brideName} & ${content.groomName}`
                  : 'Ananya & Kabir';
                const inviteUrl = `${window.location.origin}/invite/${inv.slug}`;

                return (
                  <div
                    key={inv.id}
                    className="bg-white rounded-2xl overflow-hidden border border-champagne shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail Preview */}
                      <div className="relative aspect-[16/10] bg-champagne/40 overflow-hidden">
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
                          {inv.status === 'published' ? 'Published' : 'Draft'}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h3 className="font-heading text-xl font-bold text-wine mb-1">
                          {coupleTitle}
                        </h3>
                        <p className="font-body text-xs text-charcoal/60 mb-4 truncate">
                          /{inv.slug} • Package: <span className="capitalize font-semibold text-gold">{inv.package}</span>
                        </p>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-ivory border border-champagne/60 text-center mb-4">
                          <div>
                            <span className="text-[10px] text-charcoal/50 block font-semibold">VIEWS</span>
                            <span className="font-heading text-lg font-bold text-wine flex items-center justify-center gap-1">
                              <Eye size={13} className="text-gold" />
                              {inv.view_count || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-charcoal/50 block font-semibold">RSVPS</span>
                            <span className="font-heading text-lg font-bold text-wine flex items-center justify-center gap-1">
                              <Users size={13} className="text-gold" />
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
                          className="py-2 px-2.5 rounded-lg border border-wine/30 text-wine hover:bg-wine hover:text-white font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                          title="Edit invitation content"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </Link>

                        <Link
                          to={`/invite/${inv.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-2.5 rounded-lg border border-champagne hover:border-wine text-charcoal font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                          title="Open live invitation"
                        >
                          <ExternalLink size={13} />
                          <span>Preview</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setActiveShareInvite(inv)}
                          className="py-2 px-2.5 rounded-lg bg-wine text-white hover:bg-gold font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1 shadow-2xs transition-colors"
                          title="Share on WhatsApp"
                        >
                          <Share2 size={13} />
                          <span>Share</span>
                        </button>
                      </div>

                      {/* Prominent Manage Guests & RSVPs Button */}
                      <button
                        type="button"
                        onClick={() => setActiveGuestInvite(inv)}
                        className="w-full mt-2.5 py-2 px-3 rounded-xl bg-ivory hover:bg-wine hover:text-white border border-champagne text-wine font-body text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        title="Manage guest list, create personal links and review RSVPs"
                      >
                        <Users size={13} />
                        <span>Manage Guests & RSVPs</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-champagne/80 p-10 sm:p-14 text-center max-w-xl mx-auto card-shadow">
              <div className="w-14 h-14 rounded-full bg-champagne/40 text-wine flex items-center justify-center mx-auto mb-4">
                <Heart size={26} className="text-gold" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-wine mb-2">
                No Invitations Created Yet
              </h3>
              <p className="font-body text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-8 max-w-sm mx-auto">
                Begin your celebration! Pick one of our 4 signature designs, add your ceremony details, and share personalized invitation links on WhatsApp.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Create Your First Invitation</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── CREATE INVITATION MODAL ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-champagne shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-charcoal/40 hover:text-wine p-1 rounded-lg"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-body text-gold uppercase tracking-widest font-bold block mb-1">
                  New Celebration
                </span>
                <h3 className="font-heading text-2xl font-bold text-wine">
                  Create Wedding Invitation
                </h3>
                <p className="font-body text-xs text-charcoal/70">
                  Select your signature design and package to generate your draft
                </p>
              </div>

              <form onSubmit={handleCreateInvitation} className="space-y-4">
                {/* Bride & Groom */}
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
                      className="w-full px-3 py-2.5 rounded-xl border border-champagne font-body text-xs focus:outline-none focus:ring-1 focus:ring-gold"
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
                      className="w-full px-3 py-2.5 rounded-xl border border-champagne font-body text-xs focus:outline-none focus:ring-1 focus:ring-gold"
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
                            : 'border-champagne hover:border-wine/50 text-charcoal'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-champagne"
                          style={{ backgroundColor: t.themeStyles.buttonBg }}
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
                            : 'border-champagne text-charcoal hover:bg-champagne/20'
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
                    className="w-full btn-primary text-xs uppercase tracking-widest font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
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
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-champagne shadow-2xl relative"
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
                <h3 className="font-heading text-2xl font-bold text-wine mb-1">
                  Share Your Invitation
                </h3>
                <p className="font-body text-xs text-charcoal/70">
                  Send this common web link to family groups or broadcast lists
                </p>
              </div>

              {/* URL box */}
              <div className="p-3 bg-ivory rounded-xl border border-champagne flex items-center justify-between gap-2 mb-6 text-xs font-mono text-wine">
                <span className="truncate">
                  {`${window.location.origin}/invite/${activeShareInvite.slug}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyLink(`${window.location.origin}/invite/${activeShareInvite.slug}`)}
                  className="p-1.5 rounded-lg bg-white border border-champagne hover:border-wine text-charcoal hover:text-wine flex-shrink-0 transition-colors"
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
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-body text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
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
    </div>
  );
}
