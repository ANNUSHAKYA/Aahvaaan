import React from 'react';
import MorPankhInvitation from './templates/MorPankhInvitation';

// ─── Add to Calendar Helper ───
export function downloadEventCalendar(event, bride, groom) {
  const formatDate = (dateStr, timeStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const m = (timeStr || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (m) {
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const p = m[3].toUpperCase();
        if (p === 'PM' && h !== 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;
        d.setHours(h, min, 0, 0);
      }
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    } catch {
      return '';
    }
  };

  const start = formatDate(event.date, event.time);
  const brideFirst = (bride || 'Bride').split(' ')[0];
  const groomFirst = (groom || 'Groom').split(' ')[0];
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aahvaaan//WeddingInvitation//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `SUMMARY:${brideFirst} & ${groomFirst}'s ${event.name || 'Wedding Celebration'}`,
    `DESCRIPTION:${event.description || ''}${event.dressCode ? ` | Dress Code: ${event.dressCode}` : ''}`,
    `LOCATION:${event.venue || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(event.name || 'Ceremony').toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── PURE DATA-DRIVEN TEMPLATE RENDERER ───
export default function TemplateRenderer({
  template,
  content = {},
  guestName,
  rsvpComponent = null,
  showEnvelope = false,
  onOpenEnvelope = null,
  isPreview = false,
}) {
  return (
    <MorPankhInvitation
      template={template}
      content={content}
      guestName={guestName}
      rsvpComponent={rsvpComponent}
      isPreview={isPreview}
    />
  );
}
