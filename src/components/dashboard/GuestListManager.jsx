import { useState, useEffect, useRef } from 'react';
import {
  Users, Plus, Upload, Download, Copy, Check, MessageCircle,
  ExternalLink, Trash2, AlertCircle, Sparkles, Filter,
  Phone, Eye, Utensils, Heart, ChevronDown, X, ShieldAlert,
  Send, RefreshCw, Hotel, FileSpreadsheet, Tag
} from 'lucide-react';
import * as XLSX from 'xlsx';
import supabase, { isSupabaseConfigured } from '../../lib/supabase';

export default function GuestListManager({ invitation, onClose, onRefreshMetrics }) {
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' | 'rsvps'
  const [guests, setGuests] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Guest Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '', group_tag: 'General', custom_greeting: '' });
  const [adding, setAdding] = useState(false);

  // File Import State (.csv & .xlsx)
  const [uploadingFile, setUploadingFile] = useState(false);
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
    invitation.package === 'luxury' ? 500 : invitation.package === 'signature' ? 50 : 10
  );

  const coupleContent = invitation.published_content || invitation.draft_content || {};
  const brideName = coupleContent.brideName || 'Meera';
  const groomName = coupleContent.groomName || 'Aarav';
  const weddingDate = coupleContent.weddingDate || '27 February 2027';
  const venue = coupleContent.venue || 'The Leela Palace, Jaipur';
  const groomParents = coupleContent.groomParents || 'Sunita & Rajesh Sharma';
  const brideParents = coupleContent.brideParents || 'Kavita & Vikram Kapoor';

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
        // Fallback for offline / demo mode
        const localGuests = JSON.parse(localStorage.getItem(`aahvaaan_guests_${invitation.id}`) || '[]');
        const localRsvps = JSON.parse(localStorage.getItem('aahvaaan_rsvps') || '[]');

        if (localGuests.length > 0) {
          setGuests(localGuests);
        } else {
          setGuests([
            {
              id: 'g-1',
              name: 'The Sharma Family',
              phone: '+91 98290 12345',
              group_tag: 'Ladkewale',
              custom_greeting: 'Aadarneey Chacha ji & Family',
              personal_slug: 'sharma-fam-x9a2',
              delivery_status: 'sent',
              view_count: 3,
              last_viewed_at: new Date().toISOString(),
            },
            {
              id: 'g-2',
              name: 'Mr. & Mrs. Kapoor',
              phone: '+91 98110 54321',
              group_tag: 'Ladkiwale',
              custom_greeting: 'Snehpoorvak Nimantran Mama ji',
              personal_slug: 'kapoor-fam-b8c1',
              delivery_status: 'pending',
              view_count: 1,
              last_viewed_at: new Date().toISOString(),
            },
            {
              id: 'g-3',
              name: 'Delhi College Gang',
              phone: '+91 98765 11223',
              group_tag: 'Friends',
              custom_greeting: 'Bhai wedding mein sabse aage rehna hai!',
              personal_slug: 'delhi-friends-c3d4',
              delivery_status: 'sent',
              view_count: 5,
              last_viewed_at: new Date().toISOString(),
            },
          ]);
        }

        if (localRsvps.length > 0) {
          setRsvps(localRsvps);
        } else {
          setRsvps([
            {
              id: 'r-1',
              name: 'The Sharma Family',
              phone: '9829012345',
              status: 'attending',
              guest_count: 4,
              dietary: 'Pure Vegetarian',
              stay_required: 'Stay Required',
              stay_details: '2 rooms for 2 nights, check-in 25 Feb',
              message: 'Heartiest congratulations! Looking forward to the auspicious pheras in Jaipur.',
              created_at: new Date().toISOString(),
            },
            {
              id: 'r-2',
              name: 'Delhi College Gang',
              phone: '9876511223',
              status: 'attending',
              guest_count: 2,
              dietary: 'Non-Vegetarian',
              stay_required: 'No Stay Needed',
              stay_details: null,
              message: 'Baraat mein dhol pe naachne ke liye ready!',
              created_at: new Date().toISOString(),
            },
          ]);
        }
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

  // 2. Add Single Guest
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
      const generatedSlug = `${newGuest.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16)}-${Math.random().toString(36).substring(2, 7)}`;

      if (isSupabaseConfigured) {
        const { error: insErr } = await supabase.from('guests').insert({
          invitation_id: invitation.id,
          name: newGuest.name.trim(),
          phone: newGuest.phone.trim() || null,
          group_tag: newGuest.group_tag.trim() || 'General',
          custom_greeting: newGuest.custom_greeting.trim() || null,
          personal_slug: generatedSlug,
          delivery_status: 'pending',
        });

        if (insErr) {
          // If direct insert fails, try fallback RPC
          await supabase.rpc('add_personalized_guest', {
            p_invitation_id: invitation.id,
            p_name: newGuest.name.trim(),
            p_phone: newGuest.phone.trim() || null,
          });
        }
        await fetchData();
      } else {
        const mockNew = {
          id: `g-${Date.now()}`,
          name: newGuest.name.trim(),
          phone: newGuest.phone.trim(),
          group_tag: newGuest.group_tag.trim() || 'General',
          custom_greeting: newGuest.custom_greeting.trim() || '',
          personal_slug: generatedSlug,
          delivery_status: 'pending',
          view_count: 0,
        };
        const updated = [mockNew, ...guests];
        setGuests(updated);
        localStorage.setItem(`aahvaaan_guests_${invitation.id}`, JSON.stringify(updated));
      }

      setNewGuest({ name: '', phone: '', group_tag: 'General', custom_greeting: '' });
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
    if (!window.confirm('Delete this guest named link? The guest link will no longer be valid.')) return;

    try {
      if (isSupabaseConfigured) {
        const { error: delErr } = await supabase
          .from('guests')
          .delete()
          .eq('id', guestId);
        if (delErr) throw delErr;
      }
      setGuests((prev) => {
        const updated = prev.filter((g) => g.id !== guestId);
        localStorage.setItem(`aahvaaan_guests_${invitation.id}`, JSON.stringify(updated));
        return updated;
      });
      if (onRefreshMetrics) onRefreshMetrics();
    } catch (err) {
      console.error('Delete guest error:', err);
      setError(err.message || 'Failed to delete guest.');
    }
  };

  // 4. Toggle WhatsApp Sent Status
  const handleToggleSentStatus = async (guest) => {
    const nextStatus = guest.delivery_status === 'sent' ? 'pending' : 'sent';
    try {
      if (isSupabaseConfigured) {
        await supabase
          .from('guests')
          .update({ delivery_status: nextStatus, sent_at: nextStatus === 'sent' ? new Date().toISOString() : null })
          .eq('id', guest.id);
      }
      setGuests((prev) =>
        prev.map((g) => (g.id === guest.id ? { ...g, delivery_status: nextStatus } : g))
      );
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // 5. Excel (.xlsx) and CSV Bulk Importer
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (jsonRows.length === 0) {
        setError('Uploaded file has no data rows.');
        setUploadingFile(false);
        return;
      }

      let addedCount = 0;
      const newGuestsToAdd = [];

      for (const row of jsonRows) {
        if (guests.length + addedCount >= packageLimit) {
          setError(`Package limit reached! Imported ${addedCount} guests before hitting your limit (${packageLimit}). Upgrade for more.`);
          setShowUpgradeModal(true);
          break;
        }

        // Find keys flexibly
        const nameKey = Object.keys(row).find((k) => /name|guest/i.test(k)) || Object.keys(row)[0];
        const phoneKey = Object.keys(row).find((k) => /phone|mobile|whatsapp/i.test(k)) || Object.keys(row)[1];
        const groupKey = Object.keys(row).find((k) => /group|tag|side|family/i.test(k)) || Object.keys(row)[2];
        const greetingKey = Object.keys(row).find((k) => /greeting|salutation|custom/i.test(k)) || Object.keys(row)[3];

        const name = String(row[nameKey] || '').trim();
        const phone = String(row[phoneKey] || '').trim();
        const group_tag = String(row[groupKey] || 'General').trim() || 'General';
        const custom_greeting = String(row[greetingKey] || '').trim();

        if (name) {
          const personal_slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16)}-${Math.random().toString(36).substring(2, 7)}`;
          
          if (isSupabaseConfigured) {
            await supabase.from('guests').insert({
              invitation_id: invitation.id,
              name,
              phone: phone || null,
              group_tag,
              custom_greeting: custom_greeting || null,
              personal_slug,
              delivery_status: 'pending',
            });
          }

          newGuestsToAdd.push({
            id: `g-${Date.now()}-${addedCount}`,
            name,
            phone,
            group_tag,
            custom_greeting,
            personal_slug,
            delivery_status: 'pending',
            view_count: 0,
          });
          addedCount++;
        }
      }

      if (!isSupabaseConfigured) {
        const updated = [...newGuestsToAdd, ...guests];
        setGuests(updated);
        localStorage.setItem(`aahvaaan_guests_${invitation.id}`, JSON.stringify(updated));
      } else {
        await fetchData();
      }

      if (onRefreshMetrics) onRefreshMetrics();
    } catch (err) {
      console.error('File import error:', err);
      setError(err.message || 'Failed to process Excel/CSV file.');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 6. Export RSVPs to Excel (.xlsx)
  const handleExportRsvpsExcel = () => {
    if (rsvps.length === 0) {
      alert('No RSVP responses recorded yet to export.');
      return;
    }

    const excelData = rsvps.map((r, i) => ({
      'S.No': i + 1,
      'Guest Name': r.name || '',
      'Mobile Number': r.phone || '',
      'RSVP Status': r.status === 'attending' ? 'Attending' : r.status === 'maybe' ? 'Tentative' : 'Declined',
      'Headcount (Guests)': r.guest_count || 1,
      'Food Preference': r.dietary || 'Pure Vegetarian',
      'Stay Required': r.stay_required || 'No Stay Needed',
      'Stay Details': r.stay_details || '—',
      'Ceremonies Attending': typeof r.events_attending === 'object' && r.events_attending ? JSON.stringify(r.events_attending) : 'All',
      'Blessing / Message': r.message || '',
      'Submitted At': new Date(r.created_at).toLocaleString('en-IN'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Wedding RSVPs');

    // Auto-fit column widths
    const colWidths = [
      { wch: 6 }, { wch: 24 }, { wch: 16 }, { wch: 14 }, { wch: 18 },
      { wch: 18 }, { wch: 18 }, { wch: 30 }, { wch: 25 }, { wch: 35 }, { wch: 20 },
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `Aahvaaan-RSVP-${brideName}-${groomName}.xlsx`);
  };

  // 7. Export Guests List with Named Links (.xlsx)
  const handleExportGuestsExcel = () => {
    if (guests.length === 0) {
      alert('No guests in list to export.');
      return;
    }

    const excelData = guests.map((g, i) => {
      const inviteUrl = `${window.location.origin}/invite/r/${g.personal_slug}`;
      const rsvp = getRsvpForGuest(g);
      return {
        'S.No': i + 1,
        'Guest Name': g.name || '',
        'Phone Number': g.phone || '',
        'Group / Side': g.group_tag || 'General',
        'Custom Greeting': g.custom_greeting || '',
        'WhatsApp Status': g.delivery_status === 'sent' ? 'Sent' : 'Pending',
        'Personalized Invitation Link': inviteUrl,
        'View Count': g.view_count || 0,
        'RSVP Status': rsvp ? rsvp.status : 'Pending Response',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guest List Links');
    XLSX.writeFile(workbook, `Aahvaaan-Guests-${brideName}-${groomName}.xlsx`);
  };

  // Helper: Copy Personal Link
  const copyLink = (personalSlug, id) => {
    const fullUrl = `${window.location.origin}/invite/r/${personalSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper: WhatsApp Personal Invitation Message Generator
  const getWhatsAppShareUrl = (guest) => {
    const inviteUrl = `${window.location.origin}/invite/r/${guest.personal_slug}`;
    const greeting = guest.custom_greeting ? `${guest.custom_greeting}\n\n` : '';
    
    const message = `🙏 *Auspicious Wedding Invitation* 🙏\n\nDear ${guest.name} Ji,\n\n${greeting}With the blessings of our beloved elders, the families of *${groomParents}* & *${brideParents}* cordially invite you with family to grace the auspicious wedding celebration of:\n\n✨ *${brideName} & ${groomName}* ✨\n\n📅 *Date:* ${weddingDate}\n📍 *Venue:* ${venue}\n\n🌸 *Your Personalized Digital Invitation Link:* 🌸\n${inviteUrl}\n\nKindly open your link to explore ceremony timings, live location, and confirm your gracious presence (RSVP).\n\nWith warm regards,\n*The Families*`;
    
    const cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // Helper: wa.me RSVP Reminder Link
  const getWhatsAppReminderUrl = (guest) => {
    const inviteUrl = `${window.location.origin}/invite/r/${guest.personal_slug}`;
    const message = `Namaste ${guest.name} Ji! 🌸\n\nA gentle reminder from ${brideName} & ${groomName} regarding our upcoming wedding in Jaipur.\n\nWe would be honored to have you and your family grace the celebrations. Kindly confirm your attendance and stay requirements here:\n${inviteUrl}\n\nWith warm regards,\n${brideName} & ${groomName}`;
    const cleanPhone = (guest.phone || '').replace(/[^0-9]/g, '');
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

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

  // Metrics
  const attendingRsvps = rsvps.filter((r) => r.status === 'attending');
  const attendingGuestCount = attendingRsvps.reduce((acc, r) => acc + (parseInt(r.guest_count, 10) || 1), 0);
  const stayRequiredCount = attendingRsvps.filter((r) => r.stay_required === 'Stay Required').length;
  const vegCount = attendingRsvps.filter((r) => r.dietary === 'Pure Vegetarian').length;
  const jainCount = attendingRsvps.filter((r) => r.dietary === 'Jain (No Onion/Garlic)').length;
  const sentCount = guests.filter((g) => g.delivery_status === 'sent').length;

  // Filtered lists
  const filteredGuests = guests.filter((g) => {
    const guestRsvp = getRsvpForGuest(g);
    if (guestFilter === 'pending' && guestRsvp) return false;
    if (guestFilter === 'responded' && !guestRsvp) return false;
    if (guestFilter === 'sent' && g.delivery_status !== 'sent') return false;
    if (guestFilter === 'unsent' && g.delivery_status === 'sent') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (g.name || '').toLowerCase().includes(q) ||
      (g.phone || '').includes(q) ||
      (g.group_tag || '').toLowerCase().includes(q)
    );
  });

  const filteredRsvps = rsvps.filter((r) => {
    if (rsvpFilter !== 'all' && r.status !== rsvpFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (r.name || '').toLowerCase().includes(q) || (r.phone || '').includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-champagne overflow-hidden font-body animate-in fade-in duration-200">
        
        {/* ════════ HEADER ════════ */}
        <div className="bg-ivory border-b border-champagne p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-wine">
                Guest List & RSVP Command Center
              </h2>
            </div>
            <p className="text-xs text-charcoal/70">
              {brideName} & {groomName}'s Wedding • <span className="capitalize font-semibold text-gold">{invitation.package}</span> Tier
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Package Limit Badge with Upgrade Trigger */}
            <div className="bg-white px-3.5 py-1.5 rounded-xl border border-champagne text-xs flex items-center gap-2 shadow-2xs">
              <span className="text-charcoal/60 font-medium">Personal Links:</span>
              <span className={`font-bold ${guests.length >= packageLimit ? 'text-amber-600' : 'text-wine'}`}>
                {guests.length} / {packageLimit}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                {sentCount} Sent
              </span>
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

        {/* ════════ SUB-HEADER TABS & ACTIONS ════════ */}
        <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-champagne bg-white flex flex-wrap items-center justify-between gap-3">
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

          {/* Action buttons: Excel import/export */}
          <div className="flex items-center gap-2">
            {activeTab === 'guests' ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="py-1.5 px-3 rounded-xl border border-champagne hover:border-wine text-charcoal hover:text-wine text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Import Excel (.xlsx) or CSV with columns: Name, Phone, Group/Side, Custom Greeting"
                >
                  <Upload size={13} />
                  <span>{uploadingFile ? 'Importing...' : 'Import Excel / CSV'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportGuestsExcel}
                  className="py-1.5 px-3 rounded-xl border border-champagne hover:border-wine text-charcoal hover:text-wine text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet size={13} />
                  <span>Export Links (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="py-1.5 px-3.5 rounded-xl bg-wine hover:bg-gold text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <Plus size={13} />
                  <span>Add Guest</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleExportRsvpsExcel}
                className="py-1.5 px-3.5 rounded-xl bg-wine hover:bg-gold text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <FileSpreadsheet size={13} />
                <span>Export RSVPs to Excel (.xlsx)</span>
              </button>
            )}
          </div>
        </div>

        {/* ════════ METRICS BAR ════════ */}
        <div className="bg-ivory/60 px-5 sm:px-6 py-3 border-b border-champagne/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-champagne/80">
            <span className="text-charcoal/60 block text-[11px]">Total Headcount</span>
            <span className="text-base font-bold text-wine">{attendingGuestCount} Guests</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-champagne/80">
            <span className="text-charcoal/60 block text-[11px]">Stay / Hotel Needed</span>
            <span className="text-base font-bold text-gold">{stayRequiredCount} Responses</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-champagne/80">
            <span className="text-charcoal/60 block text-[11px]">Dietary Split</span>
            <span className="text-xs font-semibold text-charcoal">Veg: {vegCount} | Jain: {jainCount}</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-champagne/80">
            <span className="text-charcoal/60 block text-[11px]">WhatsApp Invites Sent</span>
            <span className="text-base font-bold text-emerald-700">{sentCount} / {guests.length}</span>
          </div>
        </div>

        {/* ════════ SEARCH & FILTERS BAR ════════ */}
        <div className="p-4 px-5 sm:px-6 border-b border-champagne flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="text"
              placeholder={activeTab === 'guests' ? 'Search by name, phone, or side...' : 'Search RSVPs...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-xl border border-champagne text-xs focus:outline-none focus:border-wine"
            />
            <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'guests' ? (
              <select
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-champagne text-xs text-charcoal/80 bg-white focus:outline-none"
              >
                <option value="all">All Guests ({guests.length})</option>
                <option value="sent">WhatsApp Sent ({sentCount})</option>
                <option value="unsent">WhatsApp Pending ({guests.length - sentCount})</option>
                <option value="responded">RSVP Responded</option>
                <option value="pending">RSVP Awaited</option>
              </select>
            ) : (
              <select
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-champagne text-xs text-charcoal/80 bg-white focus:outline-none"
              >
                <option value="all">All Responses ({rsvps.length})</option>
                <option value="attending">Attending ({attendingRsvps.length})</option>
                <option value="maybe">Tentative / Maybe</option>
                <option value="not_attending">Declined</option>
              </select>
            )}
          </div>
        </div>

        {/* ════════ ERROR BANNER ════════ */}
        {error && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ════════ MAIN CONTENT LIST ════════ */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 bg-[#FAF8F5]">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw size={24} className="animate-spin text-wine mx-auto mb-2" />
              <p className="text-xs text-charcoal/60">Loading records...</p>
            </div>
          ) : activeTab === 'guests' ? (
            /* ──── GUEST LIST TAB ──── */
            filteredGuests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-champagne/60 p-8">
                <Users size={32} className="text-charcoal/30 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-wine mb-1">No Guests Found</h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto mb-4">
                  Add individual guest names or import your complete Excel (.xlsx) / CSV wedding contact list.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="py-2 px-4 rounded-xl bg-wine text-white text-xs font-semibold"
                >
                  Add First Guest
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredGuests.map((guest) => {
                  const rsvp = getRsvpForGuest(guest);
                  const isSent = guest.delivery_status === 'sent';

                  return (
                    <div
                      key={guest.id}
                      className="bg-white rounded-2xl p-4 border border-champagne/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-heading text-base font-bold text-wine leading-tight">
                              {guest.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-charcoal/60 mt-1">
                              {guest.phone && (
                                <span className="flex items-center gap-1 font-mono text-[11px]">
                                  <Phone size={12} />
                                  {guest.phone}
                                </span>
                              )}
                              {guest.group_tag && (
                                <span className="bg-ivory border border-gold/40 text-[#96752d] text-[10px] px-2 py-0.5 rounded-full font-medium">
                                  {guest.group_tag}
                                </span>
                              )}
                            </div>
                            {guest.custom_greeting && (
                              <p className="text-[11px] italic text-stone-500 mt-1">
                                "{guest.custom_greeting}"
                              </p>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="flex flex-col items-end gap-1">
                            {rsvp ? (
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                rsvp.status === 'attending'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : rsvp.status === 'maybe'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                                {rsvp.status} ({rsvp.guest_count}p)
                              </span>
                            ) : (
                              <span className="text-[10px] text-charcoal/50 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                                Awaiting RSVP
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleToggleSentStatus(guest)}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 transition-colors ${
                                isSent
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-emerald-400'
                              }`}
                              title="Click to toggle sent status"
                            >
                              {isSent ? <Check size={10} /> : <Send size={10} />}
                              <span>{isSent ? 'Sent on WhatsApp' : 'Mark as Sent'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Named Link */}
                        <div className="mt-3 bg-ivory/60 p-2 rounded-xl border border-champagne/60 flex items-center justify-between text-xs font-mono text-charcoal/70">
                          <span className="truncate pr-2 text-[11px]">
                            /invite/r/{guest.personal_slug}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => copyLink(guest.personal_slug, guest.id)}
                              className="p-1 rounded-md hover:bg-white text-charcoal/60 hover:text-wine"
                              title="Copy Link"
                            >
                              {copiedId === guest.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                            <a
                              href={`/invite/r/${guest.personal_slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-md hover:bg-white text-charcoal/60 hover:text-wine"
                              title="Preview Guest Link"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Share Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-champagne/40">
                        <span className="text-[10px] text-charcoal/50 flex items-center gap-1">
                          <Eye size={11} /> {guest.view_count || 0} views
                        </span>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={getWhatsAppShareUrl(guest)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-all"
                            onClick={() => {
                              if (!isSent) handleToggleSentStatus(guest);
                            }}
                          >
                            <MessageCircle size={12} />
                            <span>Share on WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="p-1.5 rounded-lg text-charcoal/40 hover:text-red-600 transition-colors"
                            title="Delete guest link"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* ──── RSVP RESPONSES TAB ──── */
            filteredRsvps.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-champagne/60 p-8">
                <Heart size={32} className="text-charcoal/30 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-wine mb-1">No RSVPs Received Yet</h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                  When guests open their link and submit attendance, food, and stay preferences, they will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-champagne/80 shadow-2xs hover:shadow-xs transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-heading text-base sm:text-lg font-bold text-wine">
                          {rsvp.name}
                        </h4>
                        <span className="text-xs font-mono text-charcoal/60">{rsvp.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                          rsvp.status === 'attending'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rsvp.status === 'maybe'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {rsvp.status === 'attending' ? '✓ Attending' : rsvp.status === 'maybe' ? 'Tentative' : 'Declined'}
                        </span>
                        <span className="text-[11px] text-charcoal/50">
                          {new Date(rsvp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* Preferences Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs bg-ivory/50 p-3 rounded-xl border border-champagne/60">
                      <div>
                        <span className="text-charcoal/50 block text-[10px]">Headcount</span>
                        <span className="font-bold text-wine">{rsvp.guest_count || 1} Person(s)</span>
                      </div>
                      <div>
                        <span className="text-charcoal/50 block text-[10px]">Diet / Meal</span>
                        <span className="font-bold text-charcoal">{rsvp.dietary || 'Pure Vegetarian'}</span>
                      </div>
                      <div>
                        <span className="text-charcoal/50 block text-[10px]">Stay Needed</span>
                        <span className={`font-bold ${rsvp.stay_required === 'Stay Required' ? 'text-gold' : 'text-stone-600'}`}>
                          {rsvp.stay_required || 'No Stay Needed'}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal/50 block text-[10px]">Ceremonies</span>
                        <span className="font-bold text-teal">All Celebrations</span>
                      </div>
                    </div>

                    {/* Stay details note if provided */}
                    {rsvp.stay_details && (
                      <div className="mb-2 text-xs bg-amber-50/60 border border-amber-200/60 p-2 rounded-lg text-amber-900 flex items-center gap-1.5">
                        <Hotel size={13} className="text-amber-700 flex-shrink-0" />
                        <span>Stay Note: {rsvp.stay_details}</span>
                      </div>
                    )}

                    {/* Message / Blessing note */}
                    {rsvp.message && (
                      <div className="mt-2 text-xs text-charcoal/80 italic bg-[#FAF8F5] p-2.5 rounded-xl border border-champagne/40">
                        "{rsvp.message}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* ════════ ADD GUEST MODAL ════════ */}
        {showAddForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-champagne animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-wine">Add Personalized Guest</h3>
                <button onClick={() => setShowAddForm(false)} className="text-charcoal/60 hover:text-wine">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddGuest} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-charcoal/80">Guest / Family Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma & Family"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne focus:outline-none focus:border-wine"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold mb-1 text-charcoal/80">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-champagne focus:outline-none focus:border-wine"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-charcoal/80">Family / Side Tag</label>
                    <select
                      value={newGuest.group_tag}
                      onChange={(e) => setNewGuest({ ...newGuest, group_tag: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-champagne focus:outline-none focus:border-wine bg-white"
                    >
                      <option value="General">General</option>
                      <option value="Ladkewale">Ladkewale (Groom)</option>
                      <option value="Ladkiwale">Ladkiwale (Bride)</option>
                      <option value="Family">Family / Relatives</option>
                      <option value="Friends">Friends / Colleagues</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-charcoal/80">Custom Greeting (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Aadarneey Chacha ji & Chachi ji"
                    value={newGuest.custom_greeting}
                    onChange={(e) => setNewGuest({ ...newGuest, custom_greeting: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne focus:outline-none focus:border-wine"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="py-2 px-4 rounded-xl border border-champagne text-charcoal/70 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="py-2 px-5 rounded-xl bg-wine hover:bg-gold text-white font-semibold shadow-xs disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : 'Generate Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
