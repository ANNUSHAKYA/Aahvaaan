'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, BarChart2, Eye, Users, Link2, CheckCircle2,
  MessageCircle, Check
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

const DEVICE_COLORS = ['#0E4D4F', '#B69A70', '#8C6D62'];

function formatDateTime(iso) {
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

export default function AnalyticsDashboardView({ invitation, analytics, domain }) {
  const couple = invitation.couple_names || {};
  const coupleTitle =
    couple.bride && couple.groom ? `${couple.bride} & ${couple.groom}` : 'Your Invitation';
  const baseDomain = domain || 'https://aahvaaan.vercel.app';

  const [onlyNotOpened, setOnlyNotOpened] = useState(false);
  const [preset, setPreset] = useState('invite'); // 'invite' | 'please_rsvp' | 'venue_update' | 'day_before'
  const [messageTemplate, setMessageTemplate] = useState(
    `Namaste {name}, we are delighted to invite you to ${coupleTitle}'s wedding. Open your personal invitation here: {link}`
  );
  const [sentIds, setSentIds] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`aahvaaan_sent_${invitation.id}`) || '{}');
      setSentIds(saved);
    } catch {
      // ignore
    }
  }, [invitation.id]);

  function applyPreset(nextPreset) {
    setPreset(nextPreset);
    if (nextPreset === 'invite') {
      setMessageTemplate(
        `Namaste {name}, we are delighted to invite you to ${coupleTitle}'s wedding. Open your personal invitation here: {link}`
      );
    } else if (nextPreset === 'please_rsvp') {
      setMessageTemplate(
        `Namaste {name}, a gentle reminder to please share your RSVP for ${coupleTitle}'s wedding using your link: {link}`
      );
    } else if (nextPreset === 'venue_update') {
      setMessageTemplate(
        `Namaste {name}, we have updated the venue / schedule details on ${coupleTitle}'s wedding invitation. Please check the latest details here: {link}`
      );
    } else if (nextPreset === 'day_before') {
      setMessageTemplate(
        `Namaste {name}, we can't wait to celebrate with you tomorrow at ${coupleTitle}'s wedding! Here is your invitation with venue directions: {link}`
      );
    }
  }

  function markSent(guestId) {
    const next = { ...sentIds, [guestId]: true };
    setSentIds(next);
    try {
      localStorage.setItem(`aahvaaan_sent_${invitation.id}`, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const totalViews = analytics?.total_views || 0;
  const uniqueVisitors = analytics?.unique_visitors || 0;
  const namedOpened = analytics?.named_opened || 0;
  const namedTotal = analytics?.named_total || 0;
  const namedNotOpened = Math.max(0, namedTotal - namedOpened);
  const repliedCount = analytics?.replied_count || 0;
  const conversionPct = totalViews > 0 ? Math.min(100, Math.round((repliedCount / totalViews) * 100)) : 0;

  const viewsByDay = useMemo(() => {
    const raw = Array.isArray(analytics?.views_by_day) ? analytics.views_by_day : [];
    return raw.map((d) => ({
      day: String(d.day).slice(5),
      views: Number(d.views) || 0,
    }));
  }, [analytics?.views_by_day]);

  const deviceSplit = useMemo(() => {
    const raw = Array.isArray(analytics?.device_split) ? analytics.device_split : [];
    return raw.map((d) => ({
      name: String(d.device || 'unknown').toUpperCase(),
      value: Number(d.count) || 0,
    }));
  }, [analytics?.device_split]);

  const guestActivity = useMemo(() => {
    const raw = Array.isArray(analytics?.guest_activity) ? analytics.guest_activity : [];
    if (!onlyNotOpened) return raw;
    return raw.filter((g) => (Number(g.view_count) || 0) === 0);
  }, [analytics?.guest_activity, onlyNotOpened]);

  const shareCandidates = useMemo(() => {
    const raw = Array.isArray(analytics?.guest_activity) ? analytics.guest_activity : [];
    if (preset === 'please_rsvp') {
      return raw.filter((g) => g.rsvp_status === 'pending');
    }
    return raw;
  }, [analytics?.guest_activity, preset]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-10 px-4">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-stone-500 mb-1">
              <a href="/dashboard" className="inline-flex items-center gap-1 hover:text-[#0E4D4F]">
                <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
              </a>
              <span>/</span>
              <a href={`/dashboard/invitations/${invitation.id}/edit`} className="hover:text-[#0E4D4F]">
                Edit
              </a>
              <span>/</span>
              <a href={`/dashboard/invitations/${invitation.id}/rsvps`} className="hover:text-[#0E4D4F]">
                RSVPs
              </a>
            </div>
            <h1 className="font-cormorant text-3xl font-semibold text-[#0E4D4F]">
              Analytics &amp; Reminders — {coupleTitle}
            </h1>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total views', value: totalViews, icon: Eye },
            { label: 'Unique visitors', value: uniqueVisitors, icon: Users },
            {
              label: 'Named links opened',
              value: `${namedOpened} / ${namedTotal}`,
              sub: `${namedNotOpened} not opened`,
              icon: Link2,
            },
            {
              label: 'RSVP conversion',
              value: `${conversionPct}%`,
              sub: `${repliedCount} replied`,
              icon: CheckCircle2,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-sm border border-stone-200 bg-white p-4">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>{card.label}</span>
                  <Icon className="h-4 w-4 text-[#0E4D4F]" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-[#0E4D4F]">{card.value}</p>
                {card.sub && <p className="mt-0.5 text-[11px] text-stone-400">{card.sub}</p>}
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-sm border border-stone-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-stone-700">
              <BarChart2 className="h-4 w-4 text-[#0E4D4F]" />
              Views per day (last 30 days)
            </h2>
            {viewsByDay.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-stone-400">
                No view data yet.
              </div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#0E4D4F"
                      fill="#0E4D4F"
                      fillOpacity={0.18}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-sm border border-stone-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-stone-700">Device split</h2>
            {deviceSplit.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-stone-400">
                No device data yet.
              </div>
            ) : (
              <div className="h-56 w-full flex flex-col items-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={deviceSplit}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={66}
                      paddingAngle={2}
                    >
                      {deviceSplit.map((_, idx) => (
                        <Cell key={idx} fill={DEVICE_COLORS[idx % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 text-xs text-stone-600">
                  {deviceSplit.map((d, idx) => (
                    <span key={d.name} className="inline-flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: DEVICE_COLORS[idx % DEVICE_COLORS.length] }}
                      />
                      {d.name}: {d.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guest Activity Table */}
        <section className="rounded-sm border border-stone-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-stone-700">Named Guest Activity</h2>
            <label className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyNotOpened}
                onChange={(e) => setOnlyNotOpened(e.target.checked)}
                className="accent-[#0E4D4F]"
              />
              Not opened yet
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-4 py-2.5">Guest</th>
                  <th className="px-4 py-2.5">Opened</th>
                  <th className="px-4 py-2.5">Views</th>
                  <th className="px-4 py-2.5">Last opened</th>
                  <th className="px-4 py-2.5">RSVP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {guestActivity.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-stone-400">
                      No matching guests found.
                    </td>
                  </tr>
                ) : (
                  guestActivity.map((g) => {
                    const count = Number(g.view_count) || 0;
                    return (
                      <tr key={g.id}>
                        <td className="px-4 py-2.5 font-medium text-stone-800">{g.display_name}</td>
                        <td className="px-4 py-2.5 text-xs">
                          {count > 0 ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 border border-emerald-200">
                              Yes
                            </span>
                          ) : (
                            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-600 border border-stone-200">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-stone-600">{count}</td>
                        <td className="px-4 py-2.5 text-xs text-stone-500">
                          {formatDateTime(g.last_opened_at)}
                        </td>
                        <td className="px-4 py-2.5 text-xs capitalize text-stone-600">
                          {g.rsvp_status}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* WhatsApp Bulk-Share & Reminders */}
        <section className="rounded-sm border border-stone-200 bg-white p-5 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-stone-800">
              WhatsApp Sharing &amp; Reminders
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Choose a preset, edit your message, and tap Send on WhatsApp for each guest.
            </p>
          </div>

          {/* Preset pills */}
          <div className="flex flex-wrap gap-2">
            {[
              ['invite', 'Initial invite'],
              ['please_rsvp', 'Please RSVP (not replied)'],
              ['venue_update', 'Venue update'],
              ['day_before', 'Day-before reminder'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`rounded-sm px-3 py-1.5 text-xs font-medium transition ${
                  preset === key
                    ? 'bg-[#0E4D4F] text-white'
                    : 'border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Editable message template */}
          <label className="block">
            <span className="text-xs font-medium text-stone-600">
              Message template (use <code>{'{name}'}</code> and <code>{'{link}'}</code>)
            </span>
            <textarea
              rows={3}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[#0E4D4F] focus:outline-none"
            />
          </label>

          {/* Guest send list */}
          <div className="divide-y divide-stone-100 rounded-sm border border-stone-200">
            {shareCandidates.length === 0 ? (
              <div className="py-8 text-center text-sm text-stone-400">
                No guests match this preset.
              </div>
            ) : (
              shareCandidates.map((g) => {
                const link = `${baseDomain}/n/${g.slug}`;
                const msg = messageTemplate
                  .replace(/\{name\}/g, g.display_name)
                  .replace(/\{link\}/g, link);
                const waHref = `https://wa.me/?text=${encodeURIComponent(msg)}`;
                const isSent = Boolean(sentIds[g.id]);

                return (
                  <div key={g.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-stone-800">{g.display_name}</p>
                      <p className="text-xs text-stone-400">{link}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <Check className="h-3 w-3" /> Sent
                        </span>
                      )}
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markSent(g.id)}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-green-600 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Send on WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
