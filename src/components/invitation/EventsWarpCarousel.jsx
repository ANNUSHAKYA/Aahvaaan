import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ExternalLink, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { WarpCarousel } from '../ui/WarpCarousel';

// Helper for calendar downloads
function buildCalendarUrls(event, brideName, groomName) {
  const brideFirst = (brideName || 'Bride').split(' ')[0];
  const groomFirst = (groomName || 'Groom').split(' ')[0];
  const title = `${brideFirst} & ${groomFirst} • ${event.name || 'Ceremony'}`;
  const details = `${event.description || ''}\n\nVenue: ${event.venue || ''}\nTime: ${event.time || ''}`;
  const location = event.venue || '';

  const formatIsoForCal = (dateStr, timeStr) => {
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

  const startIso = formatIsoForCal(event.date, event.time);
  const endIso = startIso;

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${startIso}&enddt=${endIso}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

  return { googleUrl, outlookUrl };
}

function downloadIcsFile(event, brideName, groomName) {
  const brideFirst = (brideName || 'Bride').split(' ')[0];
  const groomFirst = (groomName || 'Groom').split(' ')[0];
  const title = `${brideFirst} & ${groomFirst}'s ${event.name || 'Ceremony'}`;
  const d = new Date(event.date || '2026-12-06');
  const start = isNaN(d.getTime()) ? '20261206T180000Z' : d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aahvaaan//Invitation//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${event.description || ''}`,
    `LOCATION:${event.venue || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(event.name || 'ceremony').toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper to format ceremony name into two lines for the card
function formatCeremonyTitle(name = 'Wedding Ceremony') {
  if (name.includes('\n')) return name;
  const parts = name.split(' ');
  if (parts.length > 1) {
    const half = Math.ceil(parts.length / 2);
    return `${parts.slice(0, half).join(' ')}\n${parts.slice(half).join(' ')}`;
  }
  return `${name}\nCelebration`;
}

// Helper to extract day number and month from date string
function parseDateParts(dateStr = '') {
  const match = dateStr.match(/(\d{1,2})/);
  const day = match ? String(match[1]).padStart(2, '0') : '01';
  const monthMatch = dateStr.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
  const month = monthMatch ? monthMatch[1].toUpperCase() : 'DEC';
  return { day, month };
}

// Distinct bespoke Indian wedding ceremony pastel theme palettes matching website colors
const CEREMONY_PALETTES = [
  // Ring Ceremony / Soft Blush Rose & Champagne Pearl
  {
    detail: 'ring',
    textColor: '#512D38',
    numeral: ['#512D38', '#C99191'],
    accent: '#B69A70',
    glow: '#C99191',
    mesh: ['#FDF8F5', '#FAF0EA', '#F5E3DB', '#EED4C9', '#F4DFD5', '#FAF7F2', '#F9ECE5', '#F2D9CD', '#E8C2B3', '#DDAA97', '#E5BAA9', '#F8E9E2', '#F5E3DB', '#E8C2B3', '#DBA493', '#CE8573', '#D79685', '#F4DDD4', '#EED4C9', '#DDAA97', '#CE8573', '#BE6351', '#C87462', '#EDCEC2', '#F4DFD5', '#E8C2B3', '#D59685', '#C46D5C', '#D08170', '#F3DCD2', '#F9ECE5', '#F2D9CD', '#E8C2B3', '#DDAA97', '#E5BAA9', '#F8E9E2', '#FDF8F5', '#FAF0EA', '#F5E3DB', '#EED4C9', '#F4DFD5', '#FAF7F2'],
  },
  // Mehendi / Pastel Pistachio & Fresh Henna Cream
  {
    detail: 'slider',
    labels: ['Henna', 'Rhythm'],
    textColor: '#2E4735',
    numeral: ['#2E4735', '#7A9A80'],
    accent: '#5A7A60',
    glow: '#7A9A80',
    mesh: ['#FAF9F5', '#F2F6F0', '#E5EFE2', '#DAE8D6', '#E8F0E4', '#FAF8F5', '#F0F5EE', '#E0ECE0', '#D3E4D1', '#C7DDC5', '#D8E9D6', '#EFF5EC', '#E5EFE2', '#D2E5CE', '#BEDBB9', '#B0D3AA', '#C5E0C2', '#E2ECE0', '#DAE8D6', '#C5DFBF', '#ABD4A3', '#9BCB92', '#B8DBB3', '#D7E6D3', '#E2ECE0', '#D0E4CC', '#BEDBB9', '#B2D5AD', '#C8E1C5', '#E4EFE2', '#F0F5EE', '#DFECE0', '#D2E5CE', '#C7DEC5', '#DAE9D8', '#EFF5EC', '#FAF9F5', '#F2F6F0', '#E5EFE2', '#DAE8D6', '#E8F0E4', '#FAF8F5'],
  },
  // Haldi / Warm Turmeric Cream & Pastel Apricot
  {
    detail: 'wave',
    textColor: '#68400C',
    numeral: ['#7A4B10', '#D48B28'],
    accent: '#D48B28',
    glow: '#E5A93C',
    mesh: ['#FFFBF2', '#FFF6E8', '#FDEED8', '#FDE4C5', '#FCEFD8', '#FFFBF2', '#FFF4E2', '#FDE8CE', '#FCDDB8', '#FCD1A2', '#FCDCB6', '#FFF3E0', '#FDEED8', '#FCDDB8', '#FBCFA0', '#FAC188', '#FBCD9D', '#FDECD6', '#FDE4C5', '#FCD3A6', '#FAC38B', '#F8B270', '#F9C187', '#FDE2C2', '#FDEFD8', '#FCDCB6', '#FAC997', '#F8B678', '#F9C794', '#FDEED8', '#FFF4E2', '#FDE8CE', '#FCDDB8', '#FCD1A2', '#FCDCB6', '#FFF3E0', '#FFFBF2', '#FFF6E8', '#FDEED8', '#FDE4C5', '#FCEFD8', '#FFFBF2'],
  },
  // Sangeet / Ethereal Pastel Lilac & Misty Lavender
  {
    detail: 'cross',
    labels: ['Beats', 'Groove', 'Sur'],
    textColor: '#42285E',
    numeral: ['#4A2E66', '#9B72CF'],
    accent: '#7E52A0',
    glow: '#9B72CF',
    mesh: ['#FAF7FC', '#F5EFF9', '#EFE5F5', '#E8DAF0', '#EEE3F4', '#FAF7FC', '#F2E8F7', '#EAD8F2', '#DEC3EB', '#D1ADE3', '#DDC0EB', '#F1E7F6', '#EFE5F5', '#DEC3EB', '#D0ACE3', '#C194D9', '#CEABE1', '#EFE3F5', '#E8DAF0', '#D3B0E5', '#C296DA', '#B079CD', '#BE92D7', '#E7D8EF', '#EEE3F4', '#DEC1EB', '#CA9FD9', '#B480CF', '#C79DD7', '#EDE1F4', '#F2E8F7', '#EAD8F2', '#DEC3EB', '#D1ADE3', '#DDC0EB', '#F1E7F6', '#FAF7FC', '#F5EFF9', '#EFE5F5', '#E8DAF0', '#EEE3F4', '#FAF7FC'],
  },
  // Shubh Vivaah / Regal Dusty Rose, Warm Sand & Antique Gold
  {
    detail: 'cross',
    labels: ['Pheras', 'Vidhi', 'Vachan'],
    textColor: '#512D38',
    numeral: ['#512D38', '#8B3A4F'],
    accent: '#B69A70',
    glow: '#B69A70',
    mesh: ['#FDF8F6', '#FAF0EC', '#F6E4DE', '#F2D7CE', '#F5E2DA', '#FDF8F6', '#F9ECE7', '#F3DDD4', '#ECCBC0', '#E4B8AB', '#EBCEB7', '#F8EBE5', '#F6E4DE', '#ECCBC0', '#E2B5A7', '#D79C8C', '#E0B39F', '#F5E2DB', '#F2D7CE', '#E5B9AC', '#D89E8F', '#CA8171', '#D59A83', '#F1D5CB', '#F5E2DA', '#ECCBC0', '#DC9E8E', '#CD8372', '#DAA089', '#F4E0D8', '#F9ECE7', '#F3DDD4', '#ECCBC0', '#E4B8AB', '#EBCEB7', '#F8EBE5', '#FDF8F6', '#FAF0EC', '#F6E4DE', '#F2D7CE', '#F5E2DA', '#FDF8F6'],
  },
  // Reception / Champagne Silk & Pearl Ivory
  {
    detail: 'ring',
    textColor: '#512D38',
    numeral: ['#512D38', '#B69A70'],
    accent: '#B69A70',
    glow: '#E9D8CC',
    mesh: ['#FAF8F5', '#F5EDE4', '#EFE4D6', '#E7D8C6', '#EEE1D2', '#FAF8F5', '#F6EFE6', '#EDE0D1', '#E2CFBC', '#D7BFA7', '#E0CBB5', '#F5EAE0', '#EFE4D6', '#E2CFBC', '#D4BDA4', '#C5A88B', '#CEB399', '#EDE0D1', '#E7D8C6', '#D7BFA7', '#C5A88B', '#B49071', '#BD9C7F', '#E5D5C2', '#EEE1D2', '#E0CBB5', '#CEB399', '#BC9B7C', '#C8A88B', '#ECDEC8', '#F6EFE6', '#EDE0D1', '#E2CFBC', '#D7BFA7', '#E0CBB5', '#F5EAE0', '#FAF8F5', '#F5EDE4', '#EFE4D6', '#E7D8C6', '#EEE1D2', '#FAF8F5'],
  },
];

export default function EventsWarpCarousel({
  events = [],
  brideName = 'Bride',
  groomName = 'Groom',
  mapUrl = '',
  venue = 'The Royal Mandapam, Jaipur',
  background = '#FAF4EB',
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Transform events list into rich WarpCards
  const cards = useMemo(() => {
    if (!events || events.length === 0) {
      return [
        {
          title: 'Wedding\nCeremony',
          value: '08',
          unit: 'DEC',
          footer: 'The Palace Mandapam • 6:00 PM',
          detail: 'cross',
          labels: ['Pheras', 'Vidhi', 'Vachan'],
          numeral: ['#FFF5E6', '#D4AF37'],
          accent: '#D4AF37',
          glow: '#8B0000',
        },
      ];
    }

    return events.map((ev, index) => {
      const palette = CEREMONY_PALETTES[index % CEREMONY_PALETTES.length];
      const { day, month } = parseDateParts(ev.date || '');
      const title = formatCeremonyTitle(ev.name);
      const timeStr = ev.time || '7:00 PM';
      const venueStr = ev.venue || venue;

      return {
        title,
        value: day,
        unit: month,
        footer: `${timeStr} • ${venueStr.split(',')[0]}`,
        detail: palette.detail,
        labels: palette.labels,
        textColor: palette.textColor,
        numeral: palette.numeral,
        accent: palette.accent,
        glow: palette.glow,
        mesh: palette.mesh,
      };
    });
  }, [events, venue]);

  const currentEvent = events[activeIdx] || events[0] || {};
  const calendarUrls = buildCalendarUrls(currentEvent, brideName, groomName);
  const eventMapUrl = currentEvent.mapUrl || mapUrl || `https://maps.google.com/?q=${encodeURIComponent(currentEvent.venue || venue)}`;

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : events.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % events.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* 3D Cylindrical Ring Warp Carousel */}
      <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-[#B69A70]/40 bg-gradient-to-b from-[#FAF7F2] via-[#F8F2EA] to-[#F1E5D8] p-1 sm:p-2">
        <WarpCarousel
          cards={cards}
          index={activeIdx}
          onIndexChange={(newIdx) => setActiveIdx(newIdx)}
          autoplay={true}
          interval={3.8}
          step={1}
          background="#FAF7F2"
          glow="#C99191"
          warp={0.85}
          style={{
            minHeight: 380,
            borderRadius: '28px',
            touchAction: 'pan-y',
          }}
        />

        {/* Floating Ceremony Position Pill */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-[#B69A70]/40 text-[#512D38] text-[11px] font-semibold tracking-wider uppercase shadow-md">
            <Sparkles size={11} className="text-[#B69A70]" />
            <span>Ceremony {activeIdx + 1} of {events.length}</span>
          </span>
        </div>

        {/* Swipe Hint overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
          <span className="text-[11px] text-[#65575A] tracking-widest font-body uppercase bg-white/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#E9D8CC] shadow-sm">
            Drag cards or swipe sideways ⇄
          </span>
        </div>
      </div>

      {/* Active Ceremony Action Card below 3D Ring */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="mt-6 bg-[#FAF7F2] border-2 border-[#B69A70]/60 rounded-3xl p-6 sm:p-8 shadow-xl text-center relative max-w-xl mx-auto"
        >
          <div className="absolute inset-2 border border-[#B69A70]/30 rounded-[20px] pointer-events-none" />

          {/* Stepper controls */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full border border-[#B69A70]/40 bg-white hover:bg-[#B69A70]/10 text-[#512D38] transition-colors shadow-xs"
              aria-label="Previous Ceremony"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B69A70]">
              {currentEvent.date || 'Ceremony Date'}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full border border-[#B69A70]/40 bg-white hover:bg-[#B69A70]/10 text-[#512D38] transition-colors shadow-xs"
              aria-label="Next Ceremony"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#512D38] mb-1">
            {currentEvent.name}
          </h3>

          <p className="font-body text-xs font-semibold text-[#B69A70] mb-4">
            {currentEvent.time || '7:00 PM onwards'}
          </p>

          {/* Venue & Maps Pin */}
          <div className="mb-5">
            <a
              href={eventMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#512D38] font-semibold hover:text-[#B69A70] bg-white px-4 py-2 rounded-full border border-[#B69A70]/40 shadow-xs hover:shadow-md transition-all group"
            >
              <MapPin size={14} className="text-[#B69A70] group-hover:scale-110 transition-transform" />
              <span>{currentEvent.venue || venue}</span>
            </a>
          </div>

          {/* Add to Calendar Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => downloadIcsFile(currentEvent, brideName, groomName)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#512D38] via-[#6B3D4A] to-[#C99191] text-white text-xs font-semibold hover:from-[#411F29] hover:to-[#512D38] transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Calendar size={13} />
              <span>Add to Calendar (.ics)</span>
            </button>

            <a
              href={calendarUrls.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-full border border-[#B69A70]/50 bg-white text-[#512D38] hover:bg-[#B69A70]/10 text-xs font-semibold transition-all shadow-xs flex items-center gap-1"
              title="Add to Google Calendar"
            >
              <ExternalLink size={12} />
              <span>Google Cal</span>
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
