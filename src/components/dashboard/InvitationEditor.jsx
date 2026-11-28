'use client';

import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import dynamic from 'next/dynamic';
import {
  ChevronRight, ChevronLeft, Check, Save, AlertCircle, Plus, Trash2,
  Copy, MessageCircle, Music, Image as ImageIcon, Users, Heart, MapPin,
  Eye, X, Upload, Play, Pause, Loader2, Globe
} from 'lucide-react';
import {
  saveDraft, publishInvitation, updateLive, createGuest, deleteGuest
} from '@/app/actions/invitations';

// Lazy-load the preview component
const MorPankhInvitation = dynamic(
  () => import('@/src/components/invitation/templates/MorPankhInvitation'),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-stone-400 text-sm">Loading preview…</div> }
);

// ─── Music tracks ─────────────────────────────────────────────────────────────
const MUSIC_TRACKS = [
  { id: 'shehnai-royal', label: 'Royal Shehnai & Sitar Melody', src: '/audio/shehnai-royal.mp3' },
  { id: 'flute-raag', label: 'Jashn-e-Bahaar Classical Flute', src: '/audio/flute-raag.mp3' },
  { id: 'sitar-symphony', label: 'Palace Sitar & Tanpura Drone', src: '/audio/sitar-symphony.mp3' },
];

const STEPS = [
  { id: 'couple', label: 'Couple', icon: Heart },
  { id: 'events', label: 'Events', icon: MapPin },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'guests', label: 'Guests', icon: Users },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cls(...args) { return args.filter(Boolean).join(' '); }

function newEvent() {
  return { id: crypto.randomUUID(), name: '', date: '', time: '', venue: '', maps_url: '' };
}

function WhatsAppBtn({ href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-sm border border-green-600 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-50">
      <MessageCircle className="h-3 w-3" /> Share
    </a>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="inline-flex items-center gap-1.5 rounded-sm border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
    >
      {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepCouple({ data, onChange }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-stone-500">Enter the couple's names and a family welcome note.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[['bride_name', "Bride's name", 50], ['groom_name', "Groom's name", 50]].map(([field, label, max]) => (
          <label key={field} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-stone-600">{label}</span>
            <input
              type="text" maxLength={max} value={data[field] || ''}
              onChange={e => onChange({ ...data, [field]: e.target.value })}
              placeholder={label}
              className="rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[#0E4D4F] focus:outline-none focus:ring-1 focus:ring-[#0E4D4F]"
            />
          </label>
        ))}
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-stone-600">Family welcome note <span className="text-stone-400">(optional, 500 chars)</span></span>
        <textarea
          maxLength={500} rows={4} value={data.family_note || ''}
          onChange={e => onChange({ ...data, family_note: e.target.value })}
          placeholder="With the blessings of our families, we joyfully invite you…"
          className="rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[#0E4D4F] focus:outline-none focus:ring-1 focus:ring-[#0E4D4F] resize-none"
        />
        <span className="text-right text-[11px] text-stone-400">{(data.family_note || '').length}/500</span>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-stone-600">Wedding date</span>
        <input
          type="date" value={data.wedding_date || ''}
          onChange={e => onChange({ ...data, wedding_date: e.target.value })}
          className="rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[#0E4D4F] focus:outline-none focus:ring-1 focus:ring-[#0E4D4F] w-full sm:w-56"
        />
      </label>
    </div>
  );
}

function StepEvents({ data, onChange }) {
  const events = data.events || [];
  function update(idx, field, val) {
    const next = events.map((e, i) => i === idx ? { ...e, [field]: val } : e);
    onChange({ ...data, events: next });
  }
  function add() { onChange({ ...data, events: [...events, newEvent()] }); }
  function remove(idx) { onChange({ ...data, events: events.filter((_, i) => i !== idx) }); }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">Add each ceremony or event (Haldi, Mehendi, Pheras, etc.)</p>
        <button type="button" onClick={add}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0E4D4F] hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add event
        </button>
      </div>
      {events.length === 0 && (
        <div className="rounded-sm border border-dashed border-stone-300 py-10 text-center text-sm text-stone-400">
          No events yet. Click "Add event" to begin.
        </div>
      )}
      {events.map((ev, idx) => (
        <div key={ev.id || idx} className="rounded-sm border border-stone-200 bg-stone-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Event {idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-stone-400 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-stone-500">Event name *</span>
              <input type="text" maxLength={60} value={ev.name}
                onChange={e => update(idx, 'name', e.target.value)}
                placeholder="e.g. Pheras & Vivaah"
                className="rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-[#0E4D4F] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-stone-500">Date</span>
              <input type="date" value={ev.date}
                onChange={e => update(idx, 'date', e.target.value)}
                className="rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-[#0E4D4F] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-stone-500">Time</span>
              <input type="time" value={ev.time}
                onChange={e => update(idx, 'time', e.target.value)}
                className="rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-[#0E4D4F] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-stone-500">Venue (max 100 chars)</span>
              <input type="text" maxLength={100} value={ev.venue}
                onChange={e => update(idx, 'venue', e.target.value)}
                placeholder="The Leela Palace, Jaipur"
                className="rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-[#0E4D4F] focus:outline-none" />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-stone-500">Google Maps link</span>
            <input type="url" value={ev.maps_url}
              onChange={e => update(idx, 'maps_url', e.target.value)}
              placeholder="https://maps.google.com/…"
              className="rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-[#0E4D4F] focus:outline-none" />
          </label>
        </div>
      ))}
    </div>
  );
}

function StepPhotos({ data, onChange, invitationId }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const photos = data.photos || [];
  const fileRef = useRef(null);

  async function handleFiles(files) {
    setUploadError('');
    if (photos.length >= 8) { setUploadError('Maximum 8 photos allowed.'); return; }
    setUploading(true);
    const newPaths = [...photos];
    for (const file of Array.from(files)) {
      if (newPaths.length >= 8) break;
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`/api/invitations/${invitationId}/photos`, { method: 'POST', body: form });
      const json = await res.json();
      if (json.error) { setUploadError(json.error); break; }
      newPaths.push(json.signedUrl || json.path);
    }
    onChange({ ...data, photos: newPaths });
    setUploading(false);
  }

  async function removePhoto(idx) {
    const path = photos[idx];
    onChange({ ...data, photos: photos.filter((_, i) => i !== idx) });
    // Best-effort delete from storage
    if (path && !path.startsWith('http')) {
      await fetch(`/api/invitations/${invitationId}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-stone-500">Upload up to 8 photos (jpg, png, webp · max 3 MB each). They will appear in your invitation's gallery.</p>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="flex flex-col items-center rounded-sm border-2 border-dashed border-stone-300 bg-stone-50 py-10 cursor-pointer hover:border-[#0E4D4F] transition"
      >
        <Upload className="h-8 w-8 text-stone-400 mb-2" />
        <p className="text-sm text-stone-500">Click or drag photos here</p>
        <p className="text-xs text-stone-400 mt-1">{photos.length}/8 uploaded</p>
        <input
          ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
        </div>
      )}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-sm overflow-hidden border border-stone-200">
              {url.startsWith('http') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-stone-200 flex items-center justify-center text-xs text-stone-400">Photo {idx + 1}</div>
              )}
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepMusic({ data, onChange }) {
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef(null);

  function togglePlay(trackId, src) {
    if (playing === trackId) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = src; audioRef.current.play(); }
      setPlaying(trackId);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-stone-500">Choose background music for your invitation. Guests can toggle it on or off.</p>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} onEnded={() => setPlaying(null)} className="hidden" />
      <div className="space-y-3">
        {MUSIC_TRACKS.map(track => (
          <label
            key={track.id}
            className={cls(
              'flex items-center gap-4 rounded-sm border p-4 cursor-pointer transition',
              data.music_choice === track.id
                ? 'border-[#0E4D4F] bg-[#0E4D4F]/5'
                : 'border-stone-200 bg-white hover:border-stone-300'
            )}
          >
            <input
              type="radio" name="music_choice" value={track.id}
              checked={data.music_choice === track.id}
              onChange={() => onChange({ ...data, music_choice: track.id })}
              className="accent-[#0E4D4F]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800">{track.label}</p>
            </div>
            <button
              type="button"
              onClick={e => { e.preventDefault(); togglePlay(track.id, track.src); }}
              className="shrink-0 rounded-full border border-stone-300 p-1.5 text-stone-500 hover:border-[#0E4D4F] hover:text-[#0E4D4F] transition"
            >
              {playing === track.id ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepGuests({ invitationId, initialGuests, config }) {
  const [guests, setGuests] = useState(initialGuests || []);
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const csvRef = useRef(null);
  const [csvError, setCsvError] = useState('');

  const domain = config.domain || 'https://aahvaaan.vercel.app';
  const remaining = config.namedLinksIncluded - guests.length;

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true); setAddError('');
    const res = await createGuest(invitationId, name.trim(), partySize);
    if (res.error) { setAddError(res.error); setAdding(false); return; }
    setGuests(prev => [...prev, res.guest]);
    setName(''); setPartySize(2); setAdding(false);
  }

  async function handleDelete(guest) {
    setDeleting(guest.id);
    await deleteGuest(guest.id, invitationId);
    setGuests(prev => prev.filter(g => g.id !== guest.id));
    setDeleting(null);
  }

  async function handleCsvUpload(e) {
    setCsvError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split('\n').filter(l => l.trim());
    // Header detection: skip if first row contains "name" or "display"
    const hasHeader = /name|display|guest/i.test(lines[0]);
    const rows = hasHeader ? lines.slice(1) : lines;
    let added = 0;
    for (const row of rows) {
      if (guests.length + added >= config.namedLinksIncluded) {
        setCsvError(`Only ${config.namedLinksIncluded} named links allowed; added first ${added}.`);
        break;
      }
      const cols = row.split(',').map(c => c.replace(/"/g, '').trim());
      const guestName = cols[0];
      const size = parseInt(cols[1]) || 2;
      if (!guestName) continue;
      const res = await createGuest(invitationId, guestName, Math.min(Math.max(1, size), 20));
      if (res.ok) { setGuests(prev => [...prev, res.guest]); added++; }
    }
    e.target.value = '';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          Add named links for each family or guest ({remaining} remaining).
          Each link opens the invitation personalised for them.
        </p>
      </div>

      {/* Add form */}
      {remaining > 0 ? (
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3 rounded-sm border border-stone-200 bg-stone-50 p-4">
          <label className="flex flex-col gap-1 flex-1 min-w-36">
            <span className="text-[11px] font-medium text-stone-500">Guest / family name</span>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              maxLength={80} placeholder="e.g. Sharma Family"
              className="rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-[#0E4D4F] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 w-28">
            <span className="text-[11px] font-medium text-stone-500">Party size</span>
            <input
              type="number" min={1} max={20} value={partySize}
              onChange={e => setPartySize(Number(e.target.value))}
              className="rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-[#0E4D4F] focus:outline-none"
            />
          </label>
          <button
            type="submit" disabled={adding || !name.trim()}
            className="inline-flex items-center gap-1.5 bg-[#0E4D4F] px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Add
          </button>
          <button
            type="button" onClick={() => csvRef.current?.click()}
            className="inline-flex items-center gap-1.5 border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100"
          >
            <Upload className="h-3.5 w-3.5" /> CSV
          </button>
          <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
        </form>
      ) : (
        <div className="rounded-sm border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Named link limit reached ({config.namedLinksIncluded} included). Contact us on WhatsApp to upgrade.
        </div>
      )}

      {addError && <p className="text-sm text-red-600">{addError}</p>}
      {csvError && <p className="text-sm text-amber-700">{csvError}</p>}

      {/* Guest list */}
      {guests.length === 0 ? (
        <div className="rounded-sm border border-dashed border-stone-200 py-10 text-center text-sm text-stone-400">
          No guests added yet.
        </div>
      ) : (
        <div className="divide-y divide-stone-100 rounded-sm border border-stone-200">
          {guests.map(guest => {
            const link = `${domain}/n/${guest.slug}`;
            const waText = encodeURIComponent(
              `You're invited! 🎉 Open your personalised wedding invitation from ${link}`
            );
            const waHref = `https://wa.me/?text=${waText}`;
            return (
              <div key={guest.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{guest.display_name}</p>
                  <p className="text-xs text-stone-400 truncate">{link}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-stone-500">
                  <span className="rounded bg-stone-100 px-2 py-0.5">Party of {guest.max_party_size}</span>
                  <CopyBtn text={link} />
                  <WhatsAppBtn href={waHref} />
                  <button
                    type="button" onClick={() => handleDelete(guest)}
                    disabled={deleting === guest.id}
                    className="p-1 text-stone-400 hover:text-red-500 disabled:opacity-40"
                  >
                    {deleting === guest.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function InvitationEditor({ invitation, initialDraft, initialGuests, config }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    bride_name: '',
    groom_name: '',
    family_note: '',
    wedding_date: '',
    events: [],
    photos: [],
    music_choice: '',
    venue_name: '',
    venue_address: '',
    maps_url: '',
    ...initialDraft,
  });
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [publishState, setPublishState] = useState({
    status: invitation.status,
    live_updates_used: invitation.live_updates_used || 0,
    edit_window_ends_at: invitation.edit_window_ends_at,
  });
  const [publishError, setPublishError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const saveTimerRef = useRef(null);
  const isDirtyRef = useRef(false);

  // ── Autosave (3-second debounce) ──
  const triggerSave = useCallback((latestData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus('saving');
    saveTimerRef.current = setTimeout(async () => {
      const result = await saveDraft(invitation.id, latestData);
      setSaveStatus(result.error ? 'error' : 'saved');
    }, 3000);
  }, [invitation.id]);

  function handleDataChange(newData) {
    setData(newData);
    isDirtyRef.current = true;
    triggerSave(newData);
  }

  // Save on unmount
  useEffect(() => {
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, []);

  // ── Publish ──
  async function handlePublish() {
    setPublishing(true); setPublishError('');
    // Force-save first
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    await saveDraft(invitation.id, data);

    const res = await publishInvitation(invitation.id);
    if (res.error) { setPublishError(res.error); setPublishing(false); return; }
    setPublishState(prev => ({ ...prev, status: 'published' }));
    setPublishing(false);
  }

  // ── Live update ──
  async function handleUpdateLive() {
    setUpdating(true); setPublishError('');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    await saveDraft(invitation.id, data);
    const res = await updateLive(invitation.id);
    if (res.error) { setPublishError(res.error); setUpdating(false); return; }
    setPublishState(prev => ({ ...prev, live_updates_used: (prev.live_updates_used || 0) + 1 }));
    setUpdating(false);
  }

  const updatesUsed = publishState.live_updates_used || 0;
  const updatesLeft = Math.max(0, config.liveUpdatesIncluded - updatesUsed);
  const windowOpen = !publishState.edit_window_ends_at || new Date(publishState.edit_window_ends_at) > new Date();
  const canUpdateLive = publishState.status === 'published' && updatesLeft > 0 && windowOpen;

  const isPublished = publishState.status === 'published';

  // Build preview props from draft data (matches MorPankhInvitation content prop)
  const previewContent = {
    brideName: data.bride_name || 'Meera',
    groomName: data.groom_name || 'Aarav',
    familyNote: data.family_note || '',
    weddingDate: data.wedding_date
      ? new Date(data.wedding_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : '27 February 2027',
    events: data.events?.length > 0 ? data.events : undefined,
    musicSrc: data.music_choice
      ? (MUSIC_TRACKS.find(t => t.id === data.music_choice)?.src || undefined)
      : undefined,
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-xs text-stone-400 hover:text-[#0E4D4F] transition">
              ← Dashboard
            </a>
            <span className="text-stone-200">|</span>
            <span className="text-sm font-medium text-stone-700">
              {data.bride_name && data.groom_name
                ? `${data.bride_name} & ${data.groom_name}`
                : 'New Invitation'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={cls(
              'text-xs font-medium',
              saveStatus === 'saved' ? 'text-emerald-600' : saveStatus === 'saving' ? 'text-stone-400' : 'text-red-500'
            )}>
              {saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'saving' ? 'Saving…' : '⚠ Save failed'}
            </span>
            <button
              type="button" onClick={() => setShowPreview(v => !v)}
              className="hidden md:inline-flex items-center gap-1.5 border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:grid md:grid-cols-[1fr_380px] md:gap-8 lg:grid-cols-[1fr_420px]">
        {/* ── Left: Steps ── */}
        <div>
          {/* Step tabs */}
          <nav className="mb-8 flex gap-1 overflow-x-auto pb-1" aria-label="Editor steps">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const active = idx === step;
              const done = idx < step;
              return (
                <button
                  key={s.id} type="button"
                  onClick={() => setStep(idx)}
                  className={cls(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs font-medium transition',
                    active ? 'bg-[#0E4D4F] text-white' : done ? 'bg-[#0E4D4F]/10 text-[#0E4D4F]' : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-300'
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                  {s.label}
                </button>
              );
            })}
          </nav>

          {/* Step content */}
          <div className="rounded-sm border border-stone-200 bg-white p-6">
            <h2 className="mb-6 font-cormorant text-2xl font-semibold text-[#0E4D4F]">
              {STEPS[step].label}
            </h2>

            {step === 0 && <StepCouple data={data} onChange={handleDataChange} />}
            {step === 1 && <StepEvents data={data} onChange={handleDataChange} />}
            {step === 2 && <StepPhotos data={data} onChange={handleDataChange} invitationId={invitation.id} />}
            {step === 3 && <StepMusic data={data} onChange={handleDataChange} />}
            {step === 4 && (
              <StepGuests
                invitationId={invitation.id}
                initialGuests={initialGuests}
                config={config}
              />
            )}
          </div>

          {/* Step nav */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button" onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 disabled:opacity-30 hover:bg-stone-50 transition"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button" onClick={() => setStep(s => s + 1)}
                className="inline-flex items-center gap-1.5 bg-[#0E4D4F] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d3f41] transition"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {/* Publish bar */}
          <div className="mt-8 rounded-sm border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-800">
                  {isPublished ? 'Your invitation is live 🎉' : 'Ready to publish?'}
                </h3>
                {isPublished ? (
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <a
                      href={`/i/${invitation.slug}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#0E4D4F] underline flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" /> View live
                    </a>
                    <span className="text-xs text-stone-500">
                      {updatesLeft} live update{updatesLeft !== 1 ? 's' : ''} remaining
                    </span>
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs text-stone-400">
                    {config.paymentsEnabled ? 'Payment required to publish.' : 'Test mode — publish is free.'}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!isPublished && (
                  <button
                    type="button" onClick={handlePublish} disabled={publishing}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6B2D2D] to-[#B69A70] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 transition hover:opacity-90"
                  >
                    {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {config.paymentsEnabled ? 'Publish' : 'Publish (Test Mode)'}
                  </button>
                )}
                {isPublished && (
                  <button
                    type="button" onClick={handleUpdateLive}
                    disabled={updating || !canUpdateLive}
                    className="inline-flex items-center gap-2 border border-[#0E4D4F] px-4 py-2 text-sm font-medium text-[#0E4D4F] disabled:opacity-40 transition hover:bg-[#0E4D4F]/5"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Update live
                  </button>
                )}
              </div>
            </div>
            {publishError && (
              <div className="mt-3 flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {publishError}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Preview (desktop) ── */}
        <div className="hidden md:block">
          <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto rounded-sm border border-stone-200 bg-white">
            <div className="border-b border-stone-100 px-4 py-2.5 flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-stone-400" />
              <span className="text-xs font-medium text-stone-500">Live preview</span>
            </div>
            <div className="p-2 scale-[0.6] origin-top-left w-[167%] pointer-events-none">
              <MorPankhInvitation content={previewContent} isPreview />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile preview button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden border-t border-stone-200 bg-white px-4 py-3">
        <a
          href={`/i/${invitation.slug}`} target="_blank" rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 bg-[#0E4D4F] py-2.5 text-sm font-medium text-white"
        >
          <Eye className="h-4 w-4" /> Preview invitation
        </a>
      </div>
    </div>
  );
}
