'use client';

import { useState } from 'react';
import { ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

export default function AdminDashboardView({
  initialUsers,
  initialInvitations,
  initialOrders,
  initialAuditLogs,
}) {
  const [tab, setTab] = useState('orders'); // 'orders' | 'invitations' | 'users' | 'audit'
  const [orders, setOrders] = useState(initialOrders || []);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs || []);
  const [noteByOrder, setNoteByOrder] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [feedback, setFeedback] = useState('');

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
