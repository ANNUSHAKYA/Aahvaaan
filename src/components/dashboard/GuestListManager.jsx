import { useState, useEffect, useRef } from 'react';
import {
  Users, Plus, Upload, Download, Copy, Check, MessageCircle,
  ExternalLink, Trash2, AlertCircle, Sparkles, Filter,
  Phone, Eye, Utensils, Heart, ChevronDown, X, ShieldAlert,
  Send, RefreshCw
} from 'lucide-react';
import supabase, { isSupabaseConfigured } from '../../lib/supabase';

export default function GuestListManager({ invitation, onClose, onRefreshMetrics }) {
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' | 'rsvps'
  const [guests, setGuests] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Guest Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '' });
  const [adding, setAdding] = useState(false);

  // CSV Import State
  const [uploadingCsv, setUploadingCsv] = useState(false);
  const fileInputRef = useRef(null);

  // Copy indicator state
  const [copiedId, setCopiedId] = useState(null);

  // RSVP filter & Search
  const [rsvpFilter, setRsvpFilter] = useState('all'); // 'all' | 'attending' | 'maybe' | 'not_attending'
  const [guestFilter, setGuestFilter] = useState('all'); // 'all' | 'pending' | 'responded'
  const [searchQuery, setSearchQuery] = useState('');

  // Upsell Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const packageLimit = invitation.personalized_limit || (
    invitation.package === 'luxury' ? 50 : invitation.package === 'signature' ? 20 : 5
  );

  const coupleContent = invitation.published_content || invitation.draft_content || {};
  const brideName = coupleContent.brideName || 'Bride';
  const groomName = coupleContent.groomName || 'Groom';

  // 1. Fetch Guests and RSVPs from Supabase
  const fetchData = async () => {
    if (!invitation?.id) return;
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured) {
        // Fetch Guests
        const { data: guestsData, error: guestsErr } = await supabase
          .from('guests')
          .select('*')
          .eq('invitation_id', invitation.id)
          .order('created_at', { ascending: false });

        if (guestsErr) throw guestsErr;

        // Fetch RSVPs
        const { data: rsvpsData, error: rsvpsErr } = await supabase
          .from('rsvps')
          .select('*')
          .eq('invitation_id', invitation.id)
          .order('created_at', { ascending: false });

        if (rsvpsErr) throw rsvpsErr;

        setGuests(guestsData || []);
        setRsvps(rsvpsData || []);
      } else {
        // Mock fallback
        setGuests([
          {
            id: 'g-1',
            name: 'The Patidar Family',
            phone: '+91 98290 12345',
            personal_slug: 'patidar-fam-x9a2',
            view_count: 3,
            last_viewed_at: new Date().toISOString(),
          },
          {
            id: 'g-2',
            name: 'Mr. & Mrs. Sharma',
            phone: '+91 98110 54321',
            personal_slug: 'sharma-fam-b8c1',
            view_count: 1,
            last_viewed_at: new Date().toISOString(),
          },
          {
            id: 'g-3',
            name: 'Kapoor Family (Chacha-Chachi)',
            phone: '+91 98765 11223',
            personal_slug: 'kapoor-fam-c3d4',
            view_count: 0,
            last_viewed_at: null,
          },
        ]);
        setRsvps([
          {
            id: 'r-1',
            name: 'The Patidar Family',
            phone: '+91 98290 12345',
            status: 'attending',
            guest_count: 4,
            dietary: 'Pure Vegetarian',
            message: 'Heartiest congratulations! Looking forward to the auspicious pheras.',
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching guest list:', err);
      setError(err.message || 'Failed to load guest list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [invitation.id]);

  // 2. Add Single Guest via RPC
  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;

    if (guests.length >= packageLimit) {
      setShowUpgradeModal(true);
      return;
    }

    setAdding(true);
    setError(null);

    try {
      if (isSupabaseConfigured) {
        const { data, error: rpcErr } = await supabase.rpc('add_personalized_guest', {
          p_invitation_id: invitation.id,
          p_name: newGuest.name.trim(),
          p_phone: newGuest.phone.trim() || null,
        });

        if (rpcErr) throw rpcErr;
        if (data && data.success === false) {
          if (data.error === 'limit_reached') {
            setShowUpgradeModal(true);
          } else {
            setError(data.message || 'Unable to add guest.');
          }
          setAdding(false);
          return;
        }

        await fetchData();
      } else {
        const mockNew = {
          id: `g-${Date.now()}`,
          name: newGuest.name.trim(),
          phone: newGuest.phone.trim(),
          personal_slug: `mock-${Date.now().toString(36)}`,
          view_count: 0,
        };
        setGuests((prev) => [mockNew, ...prev]);
      }

      setNewGuest({ name: '', phone: '' });
      setShowAddForm(false);
      if (onRefreshMetrics) onRefreshMetrics();
    } catch (err) {
      console.error('Add guest error:', err);
      setError(err.message || 'Failed to add guest link.');
    } finally {
      setAdding(false);
    }
  };

  // 3. Delete Guest
  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm('Delete this guest personal link? The personalized link will no longer be valid.')) return;

    try {
      if (isSupabaseConfigured) {
        const { error: delErr } = await supabase
          .from('guests')
          .delete()
          .eq('id', guestId);

        if (delErr) throw delErr;
      }
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      if (onRefreshMetrics) onRefreshMetrics();
    } catch (err) {
      console.error('Delete guest error:', err);
      setError(err.message || 'Failed to delete guest.');
    }
  };

  // 4. CSV Importer
  const handleCsvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCsv(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setError('CSV file is empty or missing data rows.');
        setUploadingCsv(false);
        return;
      }

      const rows = lines.slice(1);
      let addedCount = 0;

      for (const row of rows) {
        if (guests.length + addedCount >= packageLimit) {
          setError(`Package limit reached! Imported ${addedCount} guests before hitting your limit (${packageLimit}). Upgrade for more.`);
          setShowUpgradeModal(true);
          break;
        }

        const parts = row.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
        const name = parts[0];
        const phone = parts[1] || '';

        if (name) {
          if (isSupabaseConfigured) {
            await supabase.rpc('add_personalized_guest', {
              p_invitation_id: invitation.id,
              p_name: name,
              p_phone: phone || null,
            });
          }
          addedCount++;
        }
      }

      await fetchData();
      if (onRefreshMetrics) onRefreshMetrics();
    } catch (err) {
      console.error('CSV import error:', err);
      setError(err.message || 'Failed to process CSV file.');
    } finally {
      setUploadingCsv(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 5. Export RSVPs to CSV
  const handleExportRsvpsCsv = () => {
    if (rsvps.length === 0) {
      alert('No RSVP responses recorded yet to export.');
      return;
    }

    const headers = ['Name', 'Phone', 'Status', 'Guests Count', 'Food Preference', 'Wishes / Note', 'Submitted At'];
    const rows = rsvps.map((r) => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.status || '').replace(/"/g, '""')}"`,
      r.guest_count || 1,
      `"${(r.dietary || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${new Date(r.created_at).toLocaleString('en-IN')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RSVPs-${brideName}-${groomName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper: Copy Personal Link
  const copyLink = (personalSlug, id) => {
    const fullUrl = `${window.location.origin}/invite/r/${personalSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper: wa.me Initial Invitation Link
  const getWhatsAppShareUrl = (guest) => {
    const inviteUrl = `${window.location.origin}/invite/r/${guest.personal_slug}`;
    const message = `Namaste ${guest.name} Ji! 🌸\n\n${brideName} & ${groomName} joyfully invite you and your family to celebrate their sacred wedding.\n\nKindly open your personalized invitation below:\n${inviteUrl}\n\nWe look forward to receiving your warm blessings!`;
    const cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // Helper: wa.me One-Tap RSVP Reminder Link
  const getWhatsAppReminderUrl = (guest) => {
    const inviteUrl = `${window.location.origin}/invite/r/${guest.personal_slug}`;
    const message = `Namaste ${guest.name} Ji! 🌸\n\nA gentle reminder from ${brideName} & ${groomName} regarding our wedding celebrations.\n\nWe would love to know if you and your family will be gracing the occasion. Kindly confirm your RSVP reply here:\n${inviteUrl}\n\nWith warm regards,\n${brideName} & ${groomName}`;
    const cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // Upgrade Limit Handler (e.g. Starter -> Signature -> Luxury -> Unlimited)
  const handleUpgradeLimit = async (newLimit, newPkg) => {
    setUpgrading(true);
    try {
      if (isSupabaseConfigured) {
        const { error: upErr } = await supabase
          .from('invitations')
          .update({
            package: newPkg,
            personalized_limit: newLimit,
          })
          .eq('id', invitation.id);

        if (upErr) throw upErr;
        invitation.personalized_limit = newLimit;
        invitation.package = newPkg;
      }
      setShowUpgradeModal(false);
      await fetchData();
      if (onRefreshMetrics) onRefreshMetrics();
    } catch (err) {
      console.error('Upgrade limit error:', err);
      setError(err.message || 'Failed to update package limit.');
    } finally {
      setUpgrading(false);
    }
  };

  // Metrics for RSVPs
  const attendingRsvps = rsvps.filter((r) => r.status === 'attending');
  const attendingGuestCount = attendingRsvps.reduce((acc, r) => acc + (parseInt(r.guest_count, 10) || 1), 0);
  const vegCount = attendingRsvps.filter((r) => r.dietary === 'Pure Vegetarian').length;
  const jainCount = attendingRsvps.filter((r) => r.dietary === 'Jain (No Onion/Garlic)').length;
  const multiCount = attendingRsvps.filter((r) => r.dietary === 'Multi-Cuisine').length;

  // Correlation helper: find RSVP for a guest
  const getRsvpForGuest = (guest) => {
    const cleanGuestPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    return rsvps.find((r) => {
      if (r.guest_id && r.guest_id === guest.id) return true;
      if (cleanGuestPhone && r.phone) {
        return cleanGuestPhone === r.phone.replace(/[^0-9]/g, '');
      }
      return false;
    });
  };

  // Filtered lists
  const filteredGuests = guests.filter((g) => {
    const guestRsvp = getRsvpForGuest(g);
    if (guestFilter === 'pending' && guestRsvp) return false;
    if (guestFilter === 'responded' && !guestRsvp) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (g.name || '').toLowerCase().includes(q) || (g.phone || '').includes(q);
  });

  const filteredRsvps = rsvps.filter((r) => {
    if (rsvpFilter !== 'all' && r.status !== rsvpFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (r.name || '').toLowerCase().includes(q) || (r.phone || '').includes(q);
  });

  // Pending count
  const pendingCount = guests.filter((g) => !getRsvpForGuest(g)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-champagne overflow-hidden font-body animate-in fade-in duration-200">
        {/* ════════ HEADER ════════ */}
        <div className="bg-ivory border-b border-champagne p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
                Guest Management & RSVPs
              </h2>
            </div>
            <p className="text-xs text-charcoal/70">
              {brideName} & {groomName}'s Wedding • <span className="capitalize font-semibold text-gold">{invitation.package}</span> Tier
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Package Limit Badge with Upgrade Trigger */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-champagne text-xs flex items-center gap-2 shadow-2xs">
              <span className="text-charcoal/60 font-medium">Personal Links:</span>
              <span className={`font-bold ${guests.length >= packageLimit ? 'text-amber-600' : 'text-wine'}`}>
                {guests.length} / {packageLimit}
              </span>
              {guests.length >= packageLimit && (
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="ml-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                >
                  Upgrade
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-champagne/40 text-charcoal/60 hover:text-wine transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ════════ SUB-HEADER TABS & CONTROLS ════════ */}
        <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-champagne bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('guests')}
              className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'guests'
                  ? 'bg-wine text-white shadow-2xs'
                  : 'text-charcoal/70 hover:bg-champagne/30'
              }`}
            >
              <Users size={14} />
              <span>Personalized Guest Links ({guests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rsvps')}
              className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'rsvps'
                  ? 'bg-wine text-white shadow-2xs'
                  : 'text-charcoal/70 hover:bg-champagne/30'
              }`}
            >
              <Heart size={14} />
              <span>RSVP Responses ({rsvps.length})</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {activeTab === 'guests' && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingCsv}
                  className="py-1.5 px-3 rounded-lg border border-champagne hover:border-wine text-charcoal hover:text-wine text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                  title="Upload CSV with Name, Phone"
                >
                  <Upload size={13} />
                  <span>{uploadingCsv ? 'Importing...' : 'Upload CSV'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (guests.length >= packageLimit) {
                      setShowUpgradeModal(true);
                    } else {
                      setShowAddForm(true);
                    }
                  }}
                  className="py-1.5 px-3.5 rounded-lg bg-wine hover:bg-gold text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all"
                >
                  <Plus size={14} />
                  <span>Add Guest</span>
                </button>
              </>
            )}

            {activeTab === 'rsvps' && (
              <button
                type="button"
                onClick={handleExportRsvpsCsv}
                className="py-1.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all"
              >
                <Download size={13} />
                <span>Export to CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* ════════ ERROR BANNER ════════ */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0 text-amber-600" />
              <span>{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)} className="text-amber-800 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* ════════ QUICK ADD GUEST FORM ════════ */}
        {showAddForm && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-ivory border border-champagne animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading text-sm font-bold text-wine">Add New Personalized Guest</h4>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-charcoal/50 hover:text-wine">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Guest / Family Name (e.g. Gupta Family)"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp Mobile (e.g. +91 98765 43210)"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 py-2 px-3 bg-wine hover:bg-gold text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {adding ? 'Creating Link...' : 'Create Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="py-2 px-3 border border-champagne text-xs font-semibold rounded-xl hover:bg-champagne/30"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════ MAIN CONTENT AREA ════════ */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
          {/* ──────────────── TAB 1: GUESTS LIST ──────────────── */}
          {activeTab === 'guests' && (
            <div className="space-y-4">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search guests by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs w-full px-3.5 py-1.5 bg-ivory/60 border border-champagne rounded-xl text-xs focus:outline-none focus:border-wine"
                  />

                  {/* Filter by RSVP state */}
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pending', label: `Pending (${pendingCount})` },
                      { id: 'responded', label: `Responded (${guests.length - pendingCount})` },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setGuestFilter(f.id)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                          guestFilter === f.id
                            ? 'bg-wine text-white shadow-2xs'
                            : 'bg-ivory border border-champagne text-charcoal/70 hover:bg-champagne/30'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-xs text-charcoal/50">
                  Showing {filteredGuests.length} of {guests.length} guests
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-wine border-t-transparent animate-spin mx-auto mb-2" />
                  <p className="text-xs text-charcoal/60">Loading guest list...</p>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-champagne bg-ivory/40">
                  <Users size={32} className="text-gold mx-auto mb-2 opacity-60" />
                  <h4 className="font-heading text-base font-bold text-wine mb-1">
                    {searchQuery ? 'No matching guests found' : 'No personalized guest links yet'}
                  </h4>
                  <p className="text-xs text-charcoal/60 max-w-sm mx-auto mb-4">
                    Create personalized links to greet your guests by name on WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="py-2 px-4 rounded-xl bg-wine hover:bg-gold text-white text-xs font-semibold shadow-xs"
                  >
                    + Add First Guest
                  </button>
                </div>
              ) : (
                <div className="border border-champagne rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-ivory border-b border-champagne text-[11px] font-bold text-charcoal/70 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Guest Name</th>
                          <th className="py-3 px-4">Phone</th>
                          <th className="py-3 px-4">Views</th>
                          <th className="py-3 px-4">RSVP Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-champagne/40">
                        {filteredGuests.map((g) => {
                          const isCopied = copiedId === g.id;
                          const guestRsvp = getRsvpForGuest(g);
                          const isPending = !guestRsvp;

                          return (
                            <tr key={g.id} className="hover:bg-champagne/10 transition-colors">
                              <td className="py-3.5 px-4 font-semibold text-wine">
                                {g.name}
                              </td>

                              <td className="py-3.5 px-4 text-charcoal/70">
                                {g.phone || '—'}
                              </td>

                              {/* View Tracking Status */}
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  g.view_count > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-charcoal/60'
                                }`}>
                                  <Eye size={11} />
                                  <span>{g.view_count > 0 ? `${g.view_count} views` : 'Unopened'}</span>
                                </span>
                              </td>

                              {/* Highlighted RSVP Status */}
                              <td className="py-3.5 px-4">
                                {isPending ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span>RSVP Pending</span>
                                  </span>
                                ) : (
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    guestRsvp.status === 'attending'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : guestRsvp.status === 'maybe'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    <span>
                                      {guestRsvp.status === 'attending'
                                        ? `Attending (${guestRsvp.guest_count || 1})`
                                        : guestRsvp.status === 'maybe'
                                        ? 'Tentative'
                                        : 'Declined'}
                                    </span>
                                  </span>
                                )}
                              </td>

                              {/* Actions: Copy, Send on WhatsApp (wa.me), One-Tap Resend */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* 1-Click Copy Link */}
                                  <button
                                    type="button"
                                    onClick={() => copyLink(g.personal_slug, g.id)}
                                    className="p-1.5 rounded-lg border border-champagne hover:border-wine text-charcoal hover:text-wine transition-colors"
                                    title="Copy Personal Link"
                                  >
                                    {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                  </button>

                                  {/* Send on WhatsApp via wa.me */}
                                  <a
                                    href={getWhatsAppShareUrl(g)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors"
                                    title="Send on WhatsApp via wa.me"
                                  >
                                    <MessageCircle size={13} />
                                    <span>Send</span>
                                  </a>

                                  {/* One-Tap Resend Reminder if RSVP is Pending */}
                                  {isPending && (
                                    <a
                                      href={getWhatsAppReminderUrl(g)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="py-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors"
                                      title="One-Tap Resend WhatsApp RSVP Reminder"
                                    >
                                      <Send size={12} />
                                      <span>Remind</span>
                                    </a>
                                  )}

                                  {/* Delete Link */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGuest(g.id)}
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete guest link"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──────────────── TAB 2: RSVPS & CATERING SUMMARY ──────────────── */}
          {activeTab === 'rsvps' && (
            <div className="space-y-6">
              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-ivory p-4 rounded-2xl border border-champagne text-center">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block mb-0.5">
                    Total Attending
                  </span>
                  <span className="font-heading text-2xl font-bold text-wine">
                    {attendingGuestCount} Guests
                  </span>
                </div>

                <div className="bg-ivory p-4 rounded-2xl border border-champagne text-center">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block mb-0.5">
                    Pure Vegetarian
                  </span>
                  <span className="font-heading text-2xl font-bold text-emerald-700">
                    {vegCount}
                  </span>
                </div>

                <div className="bg-ivory p-4 rounded-2xl border border-champagne text-center">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block mb-0.5">
                    Jain (No Onion/Garlic)
                  </span>
                  <span className="font-heading text-2xl font-bold text-amber-700">
                    {jainCount}
                  </span>
                </div>

                <div className="bg-ivory p-4 rounded-2xl border border-champagne text-center">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block mb-0.5">
                    Multi-Cuisine
                  </span>
                  <span className="font-heading text-2xl font-bold text-gold">
                    {multiCount}
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Responses' },
                    { id: 'attending', label: 'Attending' },
                    { id: 'maybe', label: 'Tentative / Maybe' },
                    { id: 'not_attending', label: 'Declined' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setRsvpFilter(f.id)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        rsvpFilter === f.id
                          ? 'bg-wine text-white shadow-2xs'
                          : 'bg-ivory border border-champagne text-charcoal/70 hover:bg-champagne/30'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Search RSVPs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 bg-ivory/60 border border-champagne rounded-xl text-xs focus:outline-none focus:border-wine"
                />
              </div>

              {/* RSVPs Table */}
              {loading ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-wine border-t-transparent animate-spin mx-auto mb-2" />
                  <p className="text-xs text-charcoal/60">Loading RSVPs...</p>
                </div>
              ) : filteredRsvps.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-champagne bg-ivory/40">
                  <Heart size={32} className="text-gold mx-auto mb-2 opacity-60" />
                  <h4 className="font-heading text-base font-bold text-wine mb-1">
                    No RSVP Responses Yet
                  </h4>
                  <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                    When guests submit their response on your invitation link, their dietary choices and count will appear here.
                  </p>
                </div>
              ) : (
                <div className="border border-champagne rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-ivory border-b border-champagne text-[11px] font-bold text-charcoal/70 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Guest</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Guests</th>
                          <th className="py-3 px-4">Food Preference</th>
                          <th className="py-3 px-4">Wishes / Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-champagne/40">
                        {filteredRsvps.map((r) => (
                          <tr key={r.id} className="hover:bg-champagne/10 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-wine">
                              <div>{r.name}</div>
                              <div className="text-[10px] text-charcoal/50 font-normal">{r.phone}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                  r.status === 'attending'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : r.status === 'maybe'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {r.status === 'attending' ? 'Attending' : r.status === 'maybe' ? 'Maybe' : 'Declined'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-semibold text-charcoal">
                              {r.status === 'attending' ? r.guest_count : '—'}
                            </td>

                            <td className="py-3.5 px-4 text-charcoal/80">
                              {r.status === 'attending' ? r.dietary : '—'}
                            </td>

                            <td className="py-3.5 px-4 text-charcoal/70 italic max-w-xs truncate">
                              {r.message || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ════════ UPSELL PACKAGE MODAL ════════ */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-champagne shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={26} className="text-gold" />
            </div>

            <h3 className="font-heading text-2xl font-bold text-wine mb-2">
              Upgrade Personalized Guest Links
            </h3>

            <p className="font-body text-xs text-charcoal/70 mb-6 leading-relaxed">
              You have reached your {invitation.package} limit of <strong>{packageLimit} personalized links</strong>. Upgrade your invitation to send personalized links to all your wedding guests.
            </p>

            <div className="space-y-3 mb-6 text-left">
              {packageLimit < 20 && (
                <div
                  onClick={() => handleUpgradeLimit(20, 'signature')}
                  className="p-4 rounded-2xl border border-champagne hover:border-wine hover:bg-ivory/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="font-heading text-sm font-bold text-wine block">Signature Tier (20 Links)</span>
                    <span className="text-[11px] text-charcoal/60">Includes guest RSVP tracking + WhatsApp delivery</span>
                  </div>
                  <span className="font-heading text-sm font-bold text-wine">₹1,499</span>
                </div>
              )}

              {packageLimit < 50 && (
                <div
                  onClick={() => handleUpgradeLimit(50, 'luxury')}
                  className="p-4 rounded-2xl border border-wine bg-wine/5 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="font-heading text-sm font-bold text-wine block">Luxury Tier (50 Links)</span>
                    <span className="text-[11px] text-charcoal/60">Includes custom domain + unlimited updates</span>
                  </div>
                  <span className="font-heading text-sm font-bold text-gold">₹1,999</span>
                </div>
              )}

              <div
                onClick={() => handleUpgradeLimit(999, 'luxury')}
                className="p-4 rounded-2xl border border-champagne hover:border-gold hover:bg-ivory/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <span className="font-heading text-sm font-bold text-wine block">Unlimited VIP Links Add-on</span>
                  <span className="text-[11px] text-charcoal/60">Invite up to 1,000+ guests individually</span>
                </div>
                <span className="font-heading text-sm font-bold text-wine">+₹499</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="w-full py-2.5 rounded-xl border border-champagne text-xs font-semibold text-charcoal hover:bg-champagne/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
