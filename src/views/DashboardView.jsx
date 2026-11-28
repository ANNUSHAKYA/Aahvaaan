'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Edit3, Eye, Calendar, Clock, Sparkles,
  FileText, CheckCircle2, Archive, Users, BarChart2
} from 'lucide-react';
import { createInvitation } from '@/app/actions/invitations';

function statusBadge(status) {
  const map = {
    draft: { label: 'Draft', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
    published: { label: 'Published', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    archived: { label: 'Archived', cls: 'bg-stone-100 text-stone-500 border border-stone-200' },
  };
  const s = map[status] || map.draft;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {status === 'published' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'draft' && <FileText className="h-3 w-3" />}
      {status === 'archived' && <Archive className="h-3 w-3" />}
      {s.label}
    </span>
  );
}

function coupleName(couple_names) {
  if (!couple_names) return 'Untitled Invitation';
  const { bride, groom } = couple_names;
  if (bride && groom) return `${bride} & ${groom}`;
  if (bride || groom) return bride || groom;
  return 'Untitled Invitation';
}

export default function DashboardView({ invitations, user }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  async function handleCreate() {
    setCreating(true);
    setCreateError('');
    try {
      const result = await createInvitation('mor-pankh');
      if (result.error) {
        setCreateError(result.error);
        setCreating(false);
        return;
      }
      router.push(`/dashboard/invitations/${result.id}/edit`);
    } catch (e) {
      setCreateError('Something went wrong. Please try again.');
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-cormorant text-3xl font-semibold text-[#0E4D4F]">
              Your Invitations
            </h1>
            <p className="mt-1 text-sm text-stone-500">{user.email}</p>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-none bg-gradient-to-r from-[#6B2D2D] to-[#B69A70] px-5 py-2.5 text-sm font-medium tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {creating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create invitation
          </button>
        </div>

        {createError && (
          <div className="mb-6 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {createError}
          </div>
        )}

        {/* Empty state */}
        {invitations.length === 0 && (
          <div className="flex flex-col items-center rounded-sm border border-dashed border-stone-300 bg-white py-20 text-center">
            <Sparkles className="mb-4 h-10 w-10 text-[#B69A70]" />
            <h2 className="font-cormorant text-2xl font-semibold text-[#0E4D4F]">
              No invitations yet
            </h2>
            <p className="mt-2 max-w-xs text-sm text-stone-500">
              Create your first digital wedding invitation — it only takes a few minutes.
            </p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#6B2D2D] to-[#B69A70] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create invitation'}
            </button>
          </div>
        )}

        {/* Invitation cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {invitations.map((inv) => {
            const title = coupleName(inv.couple_names);
            const isPublished = inv.status === 'published';
            const updatesLeft = isPublished
              ? Math.max(0, 5 - (inv.live_updates_used || 0))
              : null;

            return (
              <article
                key={inv.id}
                className="flex flex-col rounded-sm border border-stone-200 bg-white p-5 shadow-sm"
              >
                {/* Title + badge */}
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-cormorant text-xl font-semibold text-[#0E4D4F] leading-tight">
                    {title}
                  </h2>
                  {statusBadge(inv.status)}
                </div>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
                  {inv.wedding_date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(inv.wedding_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  )}
                  {isPublished && updatesLeft !== null && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {updatesLeft} update{updatesLeft !== 1 ? 's' : ''} left
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-stone-400">
                    Created {new Date(inv.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short',
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
                  <a
                    href={`/dashboard/invitations/${inv.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[#0E4D4F] px-3.5 py-1.5 text-xs font-medium text-[#0E4D4F] transition hover:bg-[#0E4D4F] hover:text-white"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </a>
                  <a
                    href={`/dashboard/invitations/${inv.id}/rsvps`}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-stone-300 px-3.5 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    <Users className="h-3 w-3" />
                    RSVPs
                  </a>
                  <a
                    href={`/dashboard/invitations/${inv.id}/analytics`}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-stone-300 px-3.5 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    <BarChart2 className="h-3 w-3" />
                    Analytics
                  </a>
                  {isPublished && (
                    <a
                      href={`/i/${inv.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-sm border border-stone-300 px-3.5 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-100"
                    >
                      <Eye className="h-3 w-3" />
                      View live
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
