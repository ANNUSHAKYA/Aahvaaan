'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Users, CheckCircle2, XCircle, Clock, Download, Trash2,
  Copy, Check, MessageCircle, Search, ArrowLeft, Bell
} from 'lucide-react';
import supabase from '@/src/lib/supabase';

function formatTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex items-center gap-1 rounded-sm border border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}

export default function RsvpsDashboardView({
  invitation,
  initialGuests,
  initialRsvps,
  domain,
}) {
  const [rsvps, setRsvps] = useState(initialRsvps || []);
  const [guests] = useState(initialGuests || []);
  const [filter, setFilter] = useState('all'); // 'all' | 'attending' | 'declined' | 'pending'
  const [search, setSearch] = useState('');
  const [digestEnabled, setDigestEnabled] = useState(Boolean(invitation.rsvp_digest_enabled));
  const [togglingDigest, setTogglingDigest] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const couple = invitation.couple_names || {};
  const coupleTitle =
    couple.bride && couple.groom ? `${couple.bride} & ${couple.groom}` : 'Your Invitation';
  const baseDomain = domain || 'https://aahvaaan.vercel.app';

  // Realtime subscription to public.rsvps
  useEffect(() => {
    const channel = supabase
      .channel(`rsvps_${invitation.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rsvps',
          filter: `invitation_id=eq.${invitation.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRsvps((prev) => {
              if (prev.some((r) => r.id === payload.new.id)) return prev;
              return [payload.new, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setRsvps((prev) =>
              prev.map((r) => (r.id === payload.new.id ? payload.new : r))
            );
          } else if (payload.eventType === 'DELETE') {
            if (payload.old?.id) {
              setRsvps((prev) => prev.filter((r) => r.id !== payload.old.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitation.id]);

  // Combine named guests (with or without reply) + open-link replies
  const { rows, stats } = useMemo(() => {
    const rsvpByGuestId = new Map();
    const openReplies = [];

    for (const r of rsvps) {
      if (r.guest_id) {
        rsvpByGuestId.set(r.guest_id, r);
      } else {
        openReplies.push(r);
      }
    }

    const combined = [];
    let pendingCount = 0;

    for (const g of guests) {
      const r = rsvpByGuestId.get(g.id);
      if (r) {
        combined.push({
          key: `guest-${g.id}`,
          name: g.display_name,
          status: r.attending ? 'attending' : 'declined',
          partySize: r.attending ? r.party_size : 0,
          events: Array.isArray(r.events_attending) ? r.events_attending : [],
          meal: r.meal_preference || '',
          message: r.message || '',
          repliedAt: r.updated_at || r.created_at,
          guestSlug: g.slug,
          isPending: false,
        });
      } else {
        pendingCount += 1;
        combined.push({
          key: `guest-${g.id}`,
          name: g.display_name,
          status: 'pending',
          partySize: 0,
          events: [],
          meal: '',
          message: '',
          repliedAt: null,
          guestSlug: g.slug,
          isPending: true,
        });
      }
    }

    for (const r of openReplies) {
      combined.push({
        key: `rsvp-${r.id}`,
        name: r.name,
        status: r.attending ? 'attending' : 'declined',
        partySize: r.attending ? r.party_size : 0,
        events: Array.isArray(r.events_attending) ? r.events_attending : [],
        meal: r.meal_preference || '',
        message: r.message || '',
        repliedAt: r.updated_at || r.created_at,
        guestSlug: null,
        isPending: false,
      });
    }

    const repliedRows = combined.filter((row) => row.status !== 'pending');
    const attendingPeople = repliedRows
      .filter((row) => row.status === 'attending')
      .reduce((sum, row) => sum + (Number(row.partySize) || 1), 0);
    const declinedCount = repliedRows.filter((row) => row.status === 'declined').length;

    return {
      rows: combined,
      stats: {
        invited: guests.length,
        replied: repliedRows.length,
        attendingPeople,
        declined: declinedCount,
        pending: pendingCount,
      },
    };
  }, [guests, rsvps]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter !== 'all' && row.status !== filter) return false;
      if (q && !row.name.toLowerCase().includes(q) && !row.message.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [rows, filter, search]);

  async function handleToggleDigest() {
    setTogglingDigest(true);
    const next = !digestEnabled;
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/rsvps`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvp_digest_enabled: next }),
      });
      if (res.ok) setDigestEnabled(next);
    } finally {
      setTogglingDigest(false);
    }
  }

  async function handleDeleteAll() {
    setDeletingAll(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/rsvps`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRsvps([]);
        setConfirmDelete(false);
      }
    } finally {
      setDeletingAll(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-10 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-stone-500 mb-1">
              <a href="/dashboard" className="inline-flex items-center gap-1 hover:text-[#0E4D4F]">
                <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
              </a>
              <span>/</span>
              <a href={`/dashboard/invitations/${invitation.id}/edit`} className="hover:text-[#0E4D4F]">
                Edit invitation
              </a>
            </div>
            <h1 className="font-cormorant text-3xl font-semibold text-[#0E4D4F]">
              RSVP Inbox — {coupleTitle}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleDigest}
              disabled={togglingDigest}
              className={`inline-flex items-center gap-1.5 rounded-sm border px-3.5 py-2 text-xs font-medium transition ${
                digestEnabled
                  ? 'border-[#0E4D4F] bg-[#0E4D4F]/10 text-[#0E4D4F]'
                  : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-50'
              }`}
              title="Toggle daily digest email instead of instant per-RSVP email"
            >
              <Bell className="h-3.5 w-3.5" />
              Daily digest: {digestEnabled ? 'On' : 'Off'}
            </button>

            <a
              href={`/api/invitations/${invitation.id}/rsvps/export`}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#0E4D4F] bg-white px-4 py-2 text-xs font-medium text-[#0E4D4F] hover:bg-[#0E4D4F] hover:text-white transition"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </a>

            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={rsvps.length === 0}
                className="inline-flex items-center gap-1.5 rounded-sm border border-red-200 bg-white px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete all RSVPs
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-sm border border-red-300 bg-red-50 px-3 py-1.5 text-xs">
                <span className="text-red-800 font-medium">Delete all?</span>
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  disabled={deletingAll}
                  className="font-semibold text-red-700 underline"
                >
                  {deletingAll ? 'Deleting…' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-stone-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Invited', value: stats.invited, icon: Users, color: 'text-[#0E4D4F]' },
            { label: 'Replied', value: stats.replied, icon: CheckCircle2, color: 'text-emerald-700' },
            { label: 'Attending (people)', value: stats.attendingPeople, icon: Users, color: 'text-emerald-700' },
            { label: 'Declined', value: stats.declined, icon: XCircle, color: 'text-rose-700' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-700' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-sm border border-stone-200 bg-white p-4">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{card.label}</span>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <p className={`mt-2 text-2xl font-semibold ${card.color}`}>{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Filters + Search */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[
              ['all', 'All'],
              ['attending', 'Attending'],
              ['declined', 'Declined'],
              ['pending', 'Pending'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-sm px-3.5 py-1.5 text-xs font-medium transition ${
                  filter === key
                    ? 'bg-[#0E4D4F] text-white'
                    : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guest or message…"
              className="w-full rounded-sm border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-sm focus:border-[#0E4D4F] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Party</th>
                <th className="px-4 py-3">Events</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Replied</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-stone-400">
                    No matching guests or RSVPs found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const guestUrl = row.guestSlug ? `${baseDomain}/n/${row.guestSlug}` : null;
                  const remindHref = guestUrl
                    ? `https://wa.me/?text=${encodeURIComponent(
                        `Namaste ${row.name}, a gentle reminder to share your RSVP for ${coupleTitle}'s wedding: ${guestUrl}`
                      )}`
                    : null;

                  return (
                    <tr key={row.key} className="hover:bg-stone-50/60">
                      <td className="px-4 py-3 font-medium text-stone-800">
                        <div>{row.name}</div>
                        <div className="text-[11px] text-stone-400">
                          {row.guestSlug ? 'Named link' : 'Open link'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {row.status === 'attending' && (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                            Attending
                          </span>
                        )}
                        {row.status === 'declined' && (
                          <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 border border-rose-200">
                            Declined
                          </span>
                        )}
                        {row.status === 'pending' && (
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        {row.status === 'attending' ? row.partySize : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-600 max-w-[180px]">
                        {row.events.length > 0 ? row.events.join(', ') : '—'}
                        {row.meal ? (
                          <span className="block text-[11px] text-stone-400">{row.meal}</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-600 max-w-[220px]">
                        {row.message || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">
                        {formatTime(row.repliedAt)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {guestUrl && <CopyLinkButton url={guestUrl} />}
                          {row.isPending && remindHref && (
                            <a
                              href={remindHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-sm border border-green-600 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                            >
                              <MessageCircle className="h-3 w-3" />
                              Remind on WhatsApp
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
