'use client';

import { useState } from 'react';
import { ShieldCheck, CheckCircle2, FileText, Music, Trash2, Sparkles, Plus } from 'lucide-react';
import { MUSIC_CATEGORIES, formatDuration } from '@/lib/music/constants';

export default function AdminDashboardView({
  initialUsers,
  initialInvitations,
  initialOrders,
  initialAuditLogs,
  initialMusicTracks = [],
}) {
  const [tab, setTab] = useState('orders'); // 'orders' | 'invitations' | 'users' | 'audit' | 'music'
  const [orders, setOrders] = useState(initialOrders || []);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs || []);
  const [tracks, setTracks] = useState(initialMusicTracks || []);
  const [noteByOrder, setNoteByOrder] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Admin Music Form State
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    movie_or_album: '',
    category: MUSIC_CATEGORIES[0],
    duration_seconds: 180,
    license_type: 'original',
    license_confirmed: false,
    is_featured: false,
    is_published: false,
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [savingTrack, setSavingTrack] = useState(false);

  async function handleAddTrack(e) {
    e.preventDefault();
    setFeedback('');
    if (!newTrack.title.trim() || !audioFile) {
      setFeedback('Song title and audio file are required.');
      return;
    }
    setSavingTrack(true);
    try {
      const form = new FormData();
      Object.entries(newTrack).forEach(([k, v]) => form.append(k, String(v)));
      form.append('audio', audioFile);
      if (coverFile) form.append('cover', coverFile);

      const res = await fetch('/api/admin/music', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok || json.error) {
        setFeedback(json.error || 'Could not add track.');
        return;
      }
      setTracks((prev) => [json.track, ...prev]);
      setNewTrack({
        title: '',
        artist: '',
        movie_or_album: '',
        category: MUSIC_CATEGORIES[0],
        duration_seconds: 180,
        license_type: 'original',
        license_confirmed: false,
        is_featured: false,
        is_published: false,
      });
      setAudioFile(null);
      setCoverFile(null);
      setFeedback(`Added "${json.track.title}" to music library.`);
    } finally {
      setSavingTrack(false);
    }
  }

  async function toggleTrackField(track, field) {
    const res = await fetch('/api/admin/music', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: track.id, [field]: !track[field] }),
    });
    const json = await res.json();
    if (!res.ok || json.error) {
      setFeedback(json.error || 'Could not update track.');
      return;
    }
    setTracks((prev) => prev.map((t) => (t.id === track.id ? json.track : t)));
  }

  async function deleteTrack(trackId) {
    const res = await fetch('/api/admin/music', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: trackId }),
    });
    if (res.ok) {
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
    }
  }

  async function runOrderAction(orderId, action) {
    setBusyId(orderId);
    setFeedback('');
    const note = noteByOrder[orderId] || '';
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action, note }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setFeedback(json.error || 'Action failed.');
        setBusyId(null);
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: action === 'mark_paid' ? 'paid' : o.status,
                admin_note: note || o.admin_note,
              }
            : o
        )
      );
      setAuditLogs((prev) => [
        {
          id: `${Date.now()}`,
          order_id: orderId,
          action,
          note: note || null,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setFeedback(`Order ${orderId.slice(0, 8)} updated (${action}).`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-10 px-4">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-[#0E4D4F]" />
            <h1 className="font-cormorant text-3xl font-semibold text-[#0E4D4F]">
              Admin Console
            </h1>
          </div>
          <a href="/dashboard" className="text-xs text-stone-500 hover:text-[#0E4D4F]">
            ← Back to Dashboard
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ['orders', `Orders (${orders.length})`],
            ['music', `Music Library (${tracks.length})`],
            ['invitations', `Invitations (${initialInvitations.length})`],
            ['users', `Users (${initialUsers.length})`],
            ['audit', `Audit Log (${auditLogs.length})`],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-sm px-4 py-2 text-xs font-medium transition ${
                tab === key
                  ? 'bg-[#0E4D4F] text-white'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {feedback && (
          <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {feedback}
          </div>
        )}

        {tab === 'orders' && (
          <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Note / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono text-xs text-stone-700">
                      {o.id.slice(0, 8)}
                      <div className="text-[11px] text-stone-400">{o.razorpay_order_id || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {o.order_type} {o.addon_quantity ? `(+${o.addon_quantity})` : ''}
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-800">₹{o.amount_inr}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium capitalize text-stone-700">
                        {o.status}
                      </span>
                      {o.admin_note && (
                        <div className="mt-1 text-[11px] text-stone-500">{o.admin_note}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          placeholder="Admin / refund note"
                          value={noteByOrder[o.id] || ''}
                          onChange={(e) =>
                            setNoteByOrder((prev) => ({ ...prev, [o.id]: e.target.value }))
                          }
                          className="w-40 rounded-sm border border-stone-300 px-2 py-1 text-xs"
                        />
                        {o.status !== 'paid' && (
                          <button
                            type="button"
                            disabled={busyId === o.id}
                            onClick={() => runOrderAction(o.id, 'mark_paid')}
                            className="inline-flex items-center gap-1 rounded-sm bg-[#0E4D4F] px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Mark paid
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyId === o.id}
                          onClick={() => runOrderAction(o.id, 'refund_note')}
                          className="inline-flex items-center gap-1 rounded-sm border border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50"
                        >
                          <FileText className="h-3 w-3" /> Refund note
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'music' && (
          <div className="space-y-6">
            <div className="rounded-sm border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
              <strong>Licensing Compliance:</strong> Only upload and publish original compositions, royalty-free recordings, or tracks with confirmed commercial &amp; digital distribution rights. Never publish unlicensed copyrighted recordings.
            </div>

            <form onSubmit={handleAddTrack} className="rounded-sm border border-stone-200 bg-white p-5 space-y-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#0E4D4F]">
                <Plus className="h-4 w-4" /> Add Music Track
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text" required placeholder="Song title *"
                  value={newTrack.title} onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                  className="rounded-sm border border-stone-300 px-3 py-1.5 text-sm"
                />
                <input
                  type="text" placeholder="Artist"
                  value={newTrack.artist} onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                  className="rounded-sm border border-stone-300 px-3 py-1.5 text-sm"
                />
                <input
                  type="text" placeholder="Movie or album"
                  value={newTrack.movie_or_album} onChange={(e) => setNewTrack({ ...newTrack, movie_or_album: e.target.value })}
                  className="rounded-sm border border-stone-300 px-3 py-1.5 text-sm"
                />
                <select
                  value={newTrack.category} onChange={(e) => setNewTrack({ ...newTrack, category: e.target.value })}
                  className="rounded-sm border border-stone-300 px-3 py-1.5 text-sm bg-white"
                >
                  {MUSIC_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="number" min={0} placeholder="Duration (seconds)"
                  value={newTrack.duration_seconds} onChange={(e) => setNewTrack({ ...newTrack, duration_seconds: Number(e.target.value) })}
                  className="rounded-sm border border-stone-300 px-3 py-1.5 text-sm"
                />
                <select
                  value={newTrack.license_type} onChange={(e) => setNewTrack({ ...newTrack, license_type: e.target.value })}
                  className="rounded-sm border border-stone-300 px-3 py-1.5 text-sm bg-white"
                >
                  <option value="original">Original Composition</option>
                  <option value="licensed">Commercially Licensed</option>
                  <option value="royalty_free">Royalty-Free</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs text-stone-600">
                <label className="flex flex-col gap-1">
                  <span>Audio file (MP3/M4A/WAV) *</span>
                  <input type="file" accept="audio/*" required onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                </label>
                <label className="flex flex-col gap-1">
                  <span>Cover artwork (optional)</span>
                  <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-stone-700">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox" checked={newTrack.license_confirmed}
                    onChange={(e) => setNewTrack({ ...newTrack, license_confirmed: e.target.checked })}
                  />
                  Commercial distribution rights confirmed
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox" checked={newTrack.is_featured}
                    onChange={(e) => setNewTrack({ ...newTrack, is_featured: e.target.checked })}
                  />
                  Featured / Popular
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox" checked={newTrack.is_published}
                    onChange={(e) => setNewTrack({ ...newTrack, is_published: e.target.checked })}
                  />
                  Publish immediately
                </label>
              </div>

              <button
                type="submit" disabled={savingTrack}
                className="inline-flex items-center gap-1.5 rounded-sm bg-[#0E4D4F] px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
              >
                <Music className="h-3.5 w-3.5" />
                {savingTrack ? 'Uploading…' : 'Add Track'}
              </button>
            </form>

            <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Track</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">License</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {tracks.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-stone-800">{t.title}</div>
                        <div className="text-[11px] text-stone-500">
                          {[t.artist, t.movie_or_album].filter(Boolean).join(' · ') || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-600">{t.category}</td>
                      <td className="px-4 py-3 text-xs text-stone-600">{formatDuration(t.duration_seconds)}</td>
                      <td className="px-4 py-3 text-xs text-stone-600">
                        {t.license_type} {t.license_confirmed ? '✓' : '(unconfirmed)'}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`rounded-full px-2 py-0.5 font-medium ${t.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                          {t.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => toggleTrackField(t, 'is_featured')}
                          className={`inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-xs ${t.is_featured ? 'border-[#B69A70] bg-[#FAF4E8] text-[#96752d]' : 'border-stone-200 text-stone-600'}`}
                        >
                          <Sparkles className="h-3 w-3" /> {t.is_featured ? 'Featured' : 'Feature'}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleTrackField(t, 'is_published')}
                          className="inline-flex items-center gap-1 rounded-sm border border-[#0E4D4F] px-2.5 py-1 text-xs font-medium text-[#0E4D4F]"
                        >
                          {t.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTrack(t.id)}
                          className="inline-flex items-center rounded-sm border border-red-200 p-1 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${t.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'invitations' && (
          <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Couple</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Wedding Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {initialInvitations.map((inv) => {
                  const c = inv.couple_names || {};
                  return (
                    <tr key={inv.id}>
                      <td className="px-4 py-3 font-mono text-xs">{inv.slug}</td>
                      <td className="px-4 py-3">{c.bride || '—'} &amp; {c.groom || '—'}</td>
                      <td className="px-4 py-3 capitalize">{inv.status}</td>
                      <td className="px-4 py-3 text-stone-500">{inv.wedding_date || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {initialUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-mono text-xs">{u.id}</td>
                    <td className="px-4 py-3">{u.full_name || '—'}</td>
                    <td className="px-4 py-3 text-stone-500">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-stone-500">
                      {new Date(u.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'audit' && (
          <div className="overflow-x-auto rounded-sm border border-stone-200 bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 text-stone-500">
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 font-medium">{log.action}</td>
                    <td className="px-4 py-3 font-mono text-xs">{log.order_id?.slice(0, 8) || '—'}</td>
                    <td className="px-4 py-3 text-stone-600">{log.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
