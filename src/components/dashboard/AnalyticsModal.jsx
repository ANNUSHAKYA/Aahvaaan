import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Eye, Users, Smartphone, Monitor, Download,
  CheckCircle2, Clock, Calendar, AlertCircle, Sparkles,
  Utensils, MessageCircle, RefreshCw, Send, ShieldAlert
} from 'lucide-react';
import supabase, { isSupabaseConfigured } from '../../lib/supabase';

export default function AnalyticsModal({ invitation, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'guests'

  const fetchAnalytics = async () => {
    if (!invitation?.id) return;
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured) {
        // Try RPC first
        const { data, error: rpcErr } = await supabase.rpc('get_invitation_analytics', {
          p_invitation_id: invitation.id,
        });

        if (!rpcErr && data) {
          setAnalytics(data);
          setLoading(false);
          return;
        }

        console.warn('RPC get_invitation_analytics failed, falling back to manual aggregation:', rpcErr);

        // Fallback aggregation
        const [viewsRes, rsvpsRes, guestsRes] = await Promise.all([
          supabase.from('views').select('*').eq('invitation_id', invitation.id),
          supabase.from('rsvps').select('*').eq('invitation_id', invitation.id),
          supabase.from('guests').select('*').eq('invitation_id', invitation.id),
        ]);

        const views = viewsRes.data || [];
        const rsvps = rsvpsRes.data || [];
        const guests = guestsRes.data || [];

        // View metrics
        const totalViews = views.length;
        const uniqueVisitors = new Set(views.map((v) => v.guest_id || v.id)).size;
        let mobileViews = 0;
        let tabletViews = 0;
        let desktopViews = 0;

        views.forEach((v) => {
          const dt = (v.device_type || '').toLowerCase();
          if (dt.includes('mobile')) mobileViews++;
          else if (dt.includes('tablet')) tabletViews++;
          else desktopViews++;
        });

        // RSVP metrics
        let attending = 0;
        let notAttending = 0;
        let maybe = 0;
        let headcount = 0;
        let veg = 0;
        let nonVeg = 0;
        let jain = 0;
        let otherDiet = 0;

        rsvps.forEach((r) => {
          if (r.status === 'attending') {
            attending++;
            headcount += r.guest_count || 1;
            const diet = (r.dietary || '').toLowerCase();
            if (diet.includes('veg') && !diet.includes('non')) veg++;
            else if (diet.includes('non')) nonVeg++;
            else if (diet.includes('jain')) jain++;
            else otherDiet++;
          } else if (r.status === 'not_attending') {
            notAttending++;
          } else {
            maybe++;
          }
        });

        // Merge guests with RSVPs
        const guestRows = guests.map((g) => {
          const rsvp = rsvps.find((r) => r.guest_id === g.id || (r.phone && r.phone === g.phone));
          return {
            id: g.id,
            name: g.name,
            phone: g.phone,
            personal_slug: g.personal_slug,
            delivery_status: g.delivery_status,
            first_viewed_at: g.first_viewed_at,
            last_viewed_at: g.last_viewed_at,
            view_count: g.view_count || 0,
            rsvp_status: rsvp?.status,
            guest_count: rsvp?.guest_count,
            dietary: rsvp?.dietary,
            message: rsvp?.message,
          };
        });

        setAnalytics({
          invitation_id: invitation.id,
          status: invitation.status,
          package: invitation.package,
          published_at: invitation.published_at,
          edit_expires_at: invitation.edit_expires_at,
          updates_used: invitation.updates_used || 0,
          personalized_limit: invitation.personalized_limit || 5,
          views: {
            total: totalViews,
            unique: uniqueVisitors,
            devices: { mobile: mobileViews, desktop: desktopViews, tablet: tabletViews },
          },
          rsvps: {
            attending,
            not_attending: notAttending,
            maybe,
            total_headcount: headcount,
            dietary: { veg, non_veg: nonVeg, jain, other: otherDiet },
          },
          guests: guestRows,
        });
      } else {
        // Mock data
        setAnalytics({
          invitation_id: invitation.id,
          status: 'published',
          package: 'signature',
          published_at: new Date().toISOString(),
          edit_expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          updates_used: 1,
          personalized_limit: 25,
          views: {
            total: 142,
            unique: 88,
            devices: { mobile: 110, desktop: 28, tablet: 4 },
          },
          rsvps: {
            attending: 45,
            not_attending: 6,
            maybe: 8,
            total_headcount: 112,
            dietary: { veg: 72, non_veg: 28, jain: 10, other: 2 },
          },
          guests: [],
        });
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [invitation?.id]);

  // Export full analytics & RSVP to CSV
  const handleExportCsv = () => {
    if (!analytics) return;

    const headers = [
      'Guest Name',
      'Phone',
      'Status',
      'First Viewed',
      'View Count',
      'RSVP Reply',
      'Attending Count',
      'Dietary Preference',
      'Personal Message / Wishes',
    ];

    const rows = (analytics.guests || []).map((g) => [
      `"${g.name || ''}"`,
      `"${g.phone || ''}"`,
      `"${g.delivery_status || 'Sent'}"`,
      `"${g.first_viewed_at ? new Date(g.first_viewed_at).toLocaleString('en-IN') : 'Not yet'}"`,
      g.view_count || 0,
      `"${g.rsvp_status || 'Pending'}"`,
      g.guest_count || (g.rsvp_status === 'attending' ? 1 : 0),
      `"${g.dietary || 'Standard'}"`,
      `"${(g.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Aahvaaan_Wedding_Analytics_${invitation.slug || 'report'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate percentages
  const totalViews = analytics?.views?.total || 0;
  const mobileCount = analytics?.views?.devices?.mobile || 0;
  const desktopCount = analytics?.views?.devices?.desktop || 0;
  const mobilePct = totalViews > 0 ? Math.round((mobileCount / totalViews) * 100) : 75;
  const desktopPct = totalViews > 0 ? Math.round((desktopCount / totalViews) * 100) : 25;

  const totalRsvps =
    (analytics?.rsvps?.attending || 0) +
    (analytics?.rsvps?.not_attending || 0) +
    (analytics?.rsvps?.maybe || 0);

  // Expiry calculation
  const expiresAt = analytics?.edit_expires_at ? new Date(analytics.edit_expires_at) : null;
  const daysLeft = expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-champagne overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* ─── MODAL HEADER ─── */}
        <div className="bg-wine text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L60 0H0L30 30z' fill='%23B69A70'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gold/20 text-gold-light border border-gold/30">
                  Analytics & Insights
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    invitation?.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {invitation?.status === 'published' ? 'Live Published' : 'Draft'}
                </span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">
                {invitation?.draft_content?.brideName && invitation?.draft_content?.groomName
                  ? `${invitation.draft_content.brideName} & ${invitation.draft_content.groomName}`
                  : 'Wedding Celebration'}
              </h2>
              <p className="font-body text-xs text-white/70 mt-0.5">
                Live URL: <span className="text-gold-light">/invite/{invitation?.slug}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 6-Month Editing & Updates Tracker Bar */}
          {invitation?.status === 'published' && (
            <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gold" />
                <span>
                  6-Month Edit Window:{' '}
                  <strong className="text-white">
                    {daysLeft !== null ? `${daysLeft} days remaining` : 'Active'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-gold" />
                <span>
                  Live Updates Used:{' '}
                  <strong className="text-white">
                    {analytics?.updates_used || 0} of 3 updates
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─── TAB NAVIGATION ─── */}
        <div className="bg-ivory border-b border-champagne px-5 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-wine text-white shadow-2xs'
                  : 'text-charcoal/70 hover:bg-champagne/30'
              }`}
            >
              Overview & Breakdown
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'guests'
                  ? 'bg-wine text-white shadow-2xs'
                  : 'text-charcoal/70 hover:bg-champagne/30'
              }`}
            >
              Guest Engagement ({analytics?.guests?.length || 0})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAnalytics}
              className="p-1.5 rounded-lg border border-champagne hover:border-wine text-charcoal/60 hover:text-wine transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleExportCsv}
              className="btn-primary text-xs py-1.5 px-3 rounded-xl shadow-2xs inline-flex items-center gap-1.5"
              title="Export complete RSVP & Dietary list to CSV for caterer"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* ─── BODY CONTENT ─── */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 rounded-full border-3 border-wine border-t-transparent animate-spin mx-auto mb-3" />
              <p className="font-body text-xs text-charcoal/60">Gathering view and RSVP insights...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ) : activeTab === 'overview' ? (
            <>
              {/* 4 Key Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-ivory border border-champagne">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50">Total Views</span>
                    <Eye size={15} className="text-gold" />
                  </div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-wine">
                    {analytics?.views?.total || 0}
                  </span>
                  <span className="text-[11px] text-charcoal/50 block mt-0.5">
                    {analytics?.views?.unique || 0} unique visitors
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-champagne">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50">Attending RSVPs</span>
                    <CheckCircle2 size={15} className="text-emerald-600" />
                  </div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-emerald-700">
                    {analytics?.rsvps?.attending || 0}
                  </span>
                  <span className="text-[11px] text-charcoal/50 block mt-0.5">
                    +{analytics?.rsvps?.maybe || 0} maybe
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-champagne">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50">Total Headcount</span>
                    <Users size={15} className="text-wine" />
                  </div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-wine">
                    {analytics?.rsvps?.total_headcount || 0}
                  </span>
                  <span className="text-[11px] text-charcoal/50 block mt-0.5">
                    Confirmed family guests
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-champagne">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50">Personal Links</span>
                    <Sparkles size={15} className="text-gold" />
                  </div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-gold-dark">
                    {analytics?.guests?.length || 0}
                  </span>
                  <span className="text-[11px] text-charcoal/50 block mt-0.5">
                    Limit: {analytics?.personalized_limit || 5} links
                  </span>
                </div>
              </div>

              {/* Device Breakdown & RSVP Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Device Breakdown */}
                <div className="p-5 rounded-2xl bg-white border border-champagne shadow-2xs">
                  <h4 className="font-heading text-sm font-bold text-wine mb-3 flex items-center gap-2">
                    <Smartphone size={16} className="text-gold" />
                    <span>Device Breakdown</span>
                  </h4>

                  {/* Percentage Meter Bar */}
                  <div className="h-3 w-full rounded-full bg-champagne/30 overflow-hidden flex mb-3">
                    <div
                      style={{ width: `${mobilePct}%` }}
                      className="bg-wine transition-all"
                      title={`Mobile: ${mobileCount} (${mobilePct}%)`}
                    />
                    <div
                      style={{ width: `${desktopPct}%` }}
                      className="bg-gold transition-all"
                      title={`Desktop/Laptop: ${desktopCount} (${desktopPct}%)`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-wine" />
                      <span className="text-charcoal/80 font-medium">Mobile Phone</span>
                      <span className="text-charcoal/50">({mobilePct}%)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                      <span className="text-charcoal/80 font-medium">Desktop & Tablet</span>
                      <span className="text-charcoal/50">({desktopPct}%)</span>
                    </div>
                  </div>
                </div>

                {/* RSVP Status Split */}
                <div className="p-5 rounded-2xl bg-white border border-champagne shadow-2xs">
                  <h4 className="font-heading text-sm font-bold text-wine mb-3 flex items-center gap-2">
                    <Users size={16} className="text-gold" />
                    <span>RSVP Status Distribution</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Attending</span>
                      <span className="font-heading text-lg font-bold text-emerald-700">
                        {analytics?.rsvps?.attending || 0}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">Maybe</span>
                      <span className="font-heading text-lg font-bold text-amber-700">
                        {analytics?.rsvps?.maybe || 0}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                      <span className="text-[10px] font-bold text-rose-800 uppercase block">Declined</span>
                      <span className="font-heading text-lg font-bold text-rose-700">
                        {analytics?.rsvps?.not_attending || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Catering & Dietary Distribution */}
              <div className="p-5 rounded-2xl bg-white border border-champagne shadow-2xs">
                <h4 className="font-heading text-sm font-bold text-wine mb-3 flex items-center gap-2">
                  <Utensils size={16} className="text-gold" />
                  <span>Catering & Dietary Requirements (Confirmed Guests)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-ivory border border-champagne">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Pure Vegetarian</span>
                    <span className="font-heading text-xl font-bold text-wine">
                      {analytics?.rsvps?.dietary?.veg || 0}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory border border-champagne">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Jain Friendly</span>
                    <span className="font-heading text-xl font-bold text-wine">
                      {analytics?.rsvps?.dietary?.jain || 0}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory border border-champagne">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Non-Vegetarian</span>
                    <span className="font-heading text-xl font-bold text-wine">
                      {analytics?.rsvps?.dietary?.non_veg || 0}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory border border-champagne">
                    <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Standard / Any</span>
                    <span className="font-heading text-xl font-bold text-wine">
                      {analytics?.rsvps?.dietary?.other || 0}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Guest Engagement Table */
            <div className="border border-champagne rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory border-b border-champagne text-[11px] font-heading text-wine uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-3">First Viewed</th>
                      <th className="py-3 px-3 text-center">Views</th>
                      <th className="py-3 px-3">RSVP Status</th>
                      <th className="py-3 px-3">Headcount</th>
                      <th className="py-3 px-3">Dietary</th>
                      <th className="py-3 px-4">Wishes / Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne/40">
                    {analytics?.guests?.length > 0 ? (
                      analytics.guests.map((g) => (
                        <tr key={g.id} className="hover:bg-champagne/10 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-charcoal block">{g.name}</span>
                            <span className="text-[10px] text-charcoal/50">{g.phone || 'No phone'}</span>
                          </td>
                          <td className="py-3 px-3">
                            {g.first_viewed_at ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700">
                                <CheckCircle2 size={12} />
                                <span>{new Date(g.first_viewed_at).toLocaleDateString('en-IN')}</span>
                              </span>
                            ) : (
                              <span className="text-charcoal/40 italic">Not opened yet</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-wine">
                            {g.view_count || 0}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                g.rsvp_status === 'attending'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : g.rsvp_status === 'maybe'
                                  ? 'bg-amber-100 text-amber-800'
                                  : g.rsvp_status === 'not_attending'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-charcoal/10 text-charcoal/60'
                              }`}
                            >
                              {g.rsvp_status || 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-charcoal">
                            {g.guest_count ? `${g.guest_count} guests` : '—'}
                          </td>
                          <td className="py-3 px-3 capitalize text-charcoal/70">
                            {g.dietary || '—'}
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-charcoal/60">
                            {g.message || '—'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-charcoal/50 italic">
                          No personalized guest records yet. Add guests from the "Manage Guests & RSVPs" tab.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ─── MODAL FOOTER ─── */}
        <div className="bg-ivory border-t border-champagne p-4 px-6 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-charcoal/60">
            Real-time analytics recorded via secure Supabase functions.
          </p>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-wine hover:bg-gold text-white font-body text-xs font-semibold shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
