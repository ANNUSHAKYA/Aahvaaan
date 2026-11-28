import { NextRequest, NextResponse } from 'next/server';
import { fetchPublicInvitation } from '@/lib/invitations/public';

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function formatIcsLocalDateTime(dateStr?: string | null, timeStr?: string | null, addHours = 0): string {
  // Parse YYYY-MM-DD (or fallback 2027-02-27)
  let year = 2027;
  let month = 2;
  let day = 27;
  if (dateStr) {
    const match = String(dateStr).match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      year = parseInt(match[1], 10);
      month = parseInt(match[2], 10);
      day = parseInt(match[3], 10);
    }
  }

  // Parse HH:MM (24h) or "10:00 AM" / "4:30 PM"
  let hour = 16;
  let minute = 0;
  if (timeStr) {
    const m24 = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (m24) {
      hour = parseInt(m24[1], 10);
      minute = parseInt(m24[2], 10);
      const ampm = m24[3]?.toUpperCase();
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
    }
  }

  // Apply addHours safely using UTC arithmetic on nominal local date
  const nominal = new Date(Date.UTC(year, month - 1, day, hour + addHours, minute, 0));
  const y = nominal.getUTCFullYear();
  const mo = String(nominal.getUTCMonth() + 1).padStart(2, '0');
  const d = String(nominal.getUTCDate()).padStart(2, '0');
  const h = String(nominal.getUTCHours()).padStart(2, '0');
  const mi = String(nominal.getUTCMinutes()).padStart(2, '0');
  return `${y}${mo}${d}T${h}${mi}00`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params?.slug;
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const invitation = await fetchPublicInvitation(slug);
  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
  }

  const eventParam = request.nextUrl.searchParams.get('event');
  const eventIndex = eventParam !== null ? parseInt(eventParam, 10) : 0;
  const events = invitation.events || [];
  const selectedEvent =
    !Number.isNaN(eventIndex) && eventIndex >= 0 && eventIndex < events.length
      ? events[eventIndex]
      : null;

  const coupleTitle = `${invitation.bride_name} & ${invitation.groom_name}`;
  const summary = selectedEvent
    ? `${selectedEvent.name} — ${coupleTitle}`
    : `${coupleTitle} Wedding`;

  const dateStr = selectedEvent?.date || invitation.wedding_date;
  const timeStr = selectedEvent?.time || '16:30';
  const dtStart = formatIcsLocalDateTime(dateStr, timeStr, 0);
  const dtEnd = formatIcsLocalDateTime(dateStr, timeStr, 3);
  const location = selectedEvent?.venue || invitation.venue_address || invitation.venue_name || '';
  const description = selectedEvent?.note || invitation.family_note || `Wedding celebration of ${coupleTitle}`;
  const uid = `${invitation.slug}-${selectedEvent ? `event-${eventIndex}` : 'wedding'}@aahvaaan.com`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  // RFC 5545 CRLF line endings with standard Asia/Kolkata VTIMEZONE for iOS & Android
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aahvaaan//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Kolkata',
    'X-LIC-LOCATION:Asia/Kolkata',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:IST',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=Asia/Kolkata:${dtStart}`,
    `DTEND;TZID=Asia/Kolkata:${dtEnd}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const icsBody = lines.join('\r\n') + '\r\n';
  const safeFilename = (selectedEvent?.name || coupleTitle)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'wedding-event';

  return new NextResponse(icsBody, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeFilename}.ics"`,
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}
