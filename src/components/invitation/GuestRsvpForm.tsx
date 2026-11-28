'use client';

import { useState } from 'react';
import { Calendar, Check, Heart, Loader2, Lock, AlertCircle } from 'lucide-react';
import type { PublicInvitation } from '@/lib/invitations/public';

const MEAL_OPTIONS = [
  '',
  'Pure Vegetarian',
  'Jain',
  'Vegetarian + Egg',
  'Non-Vegetarian',
  'No Preference',
];

export default function GuestRsvpForm({
  invitation,
}: {
  invitation: PublicInvitation;
}) {
  const isNamedGuest = Boolean(invitation.guest);
  const maxParty = invitation.guest?.max_party_size || 10;
  const events = invitation.events || [];

  const [name, setName] = useState(invitation.guest?.display_name || '');
  const [attending, setAttending] = useState<boolean>(true);
  const [partySize, setPartySize] = useState<number>(1);
  const [eventsAttending, setEventsAttending] = useState<string[]>(
    events.map((e) => e.name).filter(Boolean)
  );
  const [mealPreference, setMealPreference] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<{ isUpdate: boolean } | null>(null);

  function toggleEvent(eventName: string) {
    setEventsAttending((prev) =>
      prev.includes(eventName)
        ? prev.filter((e) => e !== eventName)
        : [...prev, eventName]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (invitation.is_sample) {
      setSubmitted({ isUpdate: false });
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitation_slug: invitation.slug,
          guest_slug: invitation.guest?.slug || null,
          name: isNamedGuest ? invitation.guest!.display_name : name.trim(),
          attending,
          party_size: attending ? partySize : 1,
          events_attending: attending ? eventsAttending : [],
          meal_preference: attending && mealPreference ? mealPreference : null,
          message: message.trim() || null,
          website,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || 'Could not save your RSVP. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted({ isUpdate: Boolean(json.is_update) });
    } catch {
      setError('Network error while sending your RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-md rounded-3xl border-2 border-[#B69A70]/70 bg-[#fffdf5] p-7 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0E4D4F] text-[#B69A70]">
          <Check size={24} />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-[#0E4D4F]">
          {submitted.isUpdate ? 'Your RSVP is updated' : 'Thank you for replying'}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
          {attending
            ? `We look forward to celebrating with you${partySize > 1 ? ` (party of ${partySize})` : ''}.`
            : 'Thank you for letting us know. You will be missed at the celebrations.'}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={`/api/ics/${encodeURIComponent(invitation.slug)}?event=0`}
            download
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0E4D4F] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition hover:bg-[#093839] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
          >
            <Calendar size={15} />
            Add to calendar
          </a>

          {isNamedGuest && (
            <button
              type="button"
              onClick={() => setSubmitted(null)}
              className="text-xs font-medium text-[#0E4D4F] underline underline-offset-4 hover:opacity-80"
            >
              Update my reply
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border-2 border-[#B69A70]/70 bg-[#fffdf5] p-6 sm:p-8 shadow-xl">
      <div className="text-center mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#96752d]">
          RSVP
        </p>
        <h2 className="mt-1 font-serif text-3xl text-[#0E4D4F]">
          Kindly Reply
        </h2>
        <p className="mt-1.5 text-[15px] text-stone-600">
          Let {invitation.bride_name} &amp; {invitation.groom_name} know if you can join.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>

        {/* Name */}
        <label className="block">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-600">
            Your Name
            {isNamedGuest && <Lock size={12} className="text-[#96752d]" aria-hidden="true" />}
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => !isNamedGuest && setName(e.target.value)}
            readOnly={isNamedGuest}
            maxLength={80}
            required
            placeholder="Full name or family name"
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#B69A70] ${
              isNamedGuest
                ? 'border-stone-200 bg-stone-100 text-stone-700 cursor-not-allowed'
                : 'border-stone-300 bg-white text-stone-800'
            }`}
          />
        </label>

        {/* Attending Yes / No */}
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
            Will you be attending?
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`min-h-11 rounded-lg border px-3 py-2 text-[15px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70] ${
                attending
                  ? 'border-[#0E4D4F] bg-[#0E4D4F] text-white'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#0E4D4F]'
              }`}
            >
              Yes, joyfully
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`min-h-11 rounded-lg border px-3 py-2 text-[15px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70] ${
                !attending
                  ? 'border-[#6B2D2D] bg-[#6B2D2D] text-white'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#6B2D2D]'
              }`}
            >
              Regretfully no
            </button>
          </div>
        </div>

        {/* Conditional fields when attending */}
        {attending && (
          <>
            {/* Party size */}
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Party Size (1–{maxParty})
              </span>
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-[15px] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#B69A70]"
              >
                {Array.from({ length: maxParty }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </label>

            {/* Per-event attendance checkboxes (optional) */}
            {events.length > 0 && (
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Events Attending (optional)
                </span>
                <div className="space-y-2 rounded-lg border border-stone-200 bg-white p-3">
                  {events.map((ev, idx) => {
                    const checked = eventsAttending.includes(ev.name);
                    return (
                      <label key={ev.id || idx} className="flex items-center gap-2.5 text-[15px] text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEvent(ev.name)}
                          className="h-4 w-4 accent-[#0E4D4F]"
                        />
                        <span>{ev.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Meal preference (optional) */}
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Meal Preference (optional)
              </span>
              <select
                value={mealPreference}
                onChange={(e) => setMealPreference(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-[15px] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#B69A70]"
              >
                <option value="">Select preference…</option>
                {MEAL_OPTIONS.filter(Boolean).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {/* Message */}
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Blessings or Note (optional)
          </span>
          <textarea
            rows={3}
            maxLength={300}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your blessings or arrival note…"
            className="mt-1.5 w-full resize-none rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-[15px] text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#B69A70]"
          />
          <span className="block text-right text-xs text-stone-500">
            {message.length}/300
          </span>
        </label>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0E4D4F] to-[#1D6A6C] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition hover:opacity-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Heart size={15} />
              {isNamedGuest ? 'Confirm / Update RSVP' : 'Send RSVP'}
            </>
          )}
        </button>

        <p className="text-center text-xs text-stone-500">
          Your reply is shared with the hosts only.
        </p>
      </form>
    </section>
  );
}
