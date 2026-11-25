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

// Distinct bespoke Indian wedding ceremony theme palettes
const CEREMONY_PALETTES = [
  // Ring Ceremony / Emerald & Sapphire
  {
    detail: 'ring',
    numeral: ['#F7E2A9', '#D4AF37'],
    accent: '#D4AF37',
    glow: '#C5A15E',
    mesh: ['#041E42', '#0A2540', '#03142B', '#153243', '#091F2C', '#0C2340', '#173F5F', '#0E2938', '#051923', '#000814', '#081C15', '#1B4332', '#001D3D', '#003566', '#FFC300', '#D4AF37', '#740001', '#5B0E2D', '#2B0938', '#140024', '#001E3D', '#0A3A40', '#0F4C5C', '#1D2D44', '#0B132B', '#1C2541', '#3A506B', '#5BC0BE', '#6FFFE9', '#D4AF37', '#0A1128', '#1C2541', '#001F54', '#034078', '#1282A2', '#FEFCFB', '#001427', '#708D81', '#F4D58D', '#BF0603', '#8D0801', '#7209B7'],
  },
  // Mehendi / Lush Mehndi Green & Golden Mustard
  {
    detail: 'slider',
    labels: ['Henna', 'Rhythm'],
    numeral: ['#FFF8D6', '#E2B842'],
    accent: '#E5A93C',
    glow: '#4E6E58',
    mesh: ['#1A3323', '#24452F', '#162C1E', '#325C3E', '#203A27', '#112217', '#3F6E4C', '#51865F', '#24402B', '#0E1A11', '#172714', '#2B4323', '#859B27', '#B6C438', '#E6C653', '#DCAE36', '#4A6B22', '#324C16', '#21330F', '#0F1A07', '#1D3B2B', '#27523C', '#397858', '#4FA075', '#163123', '#2B573D', '#417A57', '#63A87B', '#A7D49B', '#D8C358', '#1E3B27', '#346140', '#569263', '#81BE8F', '#CBE5B8', '#F5EFD3', '#17301F', '#2D5638', '#4F885D', '#80BC8E', '#BADCA5', '#EAE6B9'],
  },
  // Haldi / Turmeric Sun & Gold
  {
    detail: 'wave',
    numeral: ['#FFFCEB', '#F39C12'],
    accent: '#F39C12',
    glow: '#D35400',
    mesh: ['#4A2800', '#5E3402', '#3D2000', '#7A4305', '#522D02', '#2E1800', '#8F4F08', '#B0630D', '#542E02', '#1C0D00', '#2E1700', '#593003', '#C47E0B', '#E69E1C', '#F7B731', '#FA8231', '#8C4D05', '#613402', '#3D1F00', '#1A0C00', '#422401', '#663702', '#A65C08', '#D97D11', '#331A00', '#6B3803', '#A85E09', '#E08514', '#F5CD79', '#F7D794', '#472501', '#753F04', '#B86A0B', '#E88C15', '#F8A5C2', '#F7D794', '#381C00', '#633302', '#A65B07', '#DE8312', '#F3A683', '#F8C291'],
  },
  // Sangeet / Amethyst Violet & Starlight Gold
  {
    detail: 'cross',
    labels: ['Beats', 'Groove', 'Sur'],
    numeral: ['#F3E8FF', '#C084FC'],
    accent: '#A855F7',
    glow: '#7E22CE',
    mesh: ['#300A45', '#3E0F57', '#250736', '#4D146C', '#360D4D', '#1D042B', '#5C1981', '#71229C', '#390D52', '#15021F', '#1E042D', '#3F0D5C', '#8328B5', '#9B3BD4', '#C059F5', '#8E2DE2', '#521075', '#3A0954', '#260438', '#11011A', '#2D0A41', '#471364', '#7525A1', '#9E3CD8', '#230633', '#4E146E', '#7D27AF', '#A841E6', '#CE7BF9', '#E9B9FF', '#2F0945', '#551778', '#8B2FC0', '#B54FF0', '#D689FA', '#F3DCFF', '#260538', '#4A116A', '#7F27B3', '#A73FE4', '#CE76F8', '#ECC6FF'],
  },
  // Shubh Vivaah / Regal Royal Maroon, Sindoor & Heritage Gold
  {
    detail: 'cross',
    labels: ['Pheras', 'Vidhi', 'Vachan'],
    numeral: ['#FFF5E6', '#D4AF37'],
    accent: '#D4AF37',
    glow: '#8B0000',
    mesh: ['#3A0512', '#4D0819', '#2C030D', '#610B20', '#440616', '#22010A', '#750F28', '#911634', '#460516', '#170006', '#220008', '#470414', '#A61E3E', '#C22B4F', '#E63956', '#D4AF37', '#690B23', '#490517', '#2E020D', '#140005', '#380512', '#55091D', '#8C1433', '#BD2249', '#27020C', '#5C081F', '#941437', '#C9254F', '#F06282', '#F7D69E', '#3A0413', '#660923', '#A3153C', '#D42753', '#F27592', '#FAEDCB', '#2D020E', '#56061B', '#921134', '#C72149', '#EC6482', '#FCEADE'],
  },
  // Reception / Midnight Gold Elegance
  {
    detail: 'ring',
    numeral: ['#F7E2A9', '#C5A15E'],
    accent: '#E5C07B',
    glow: '#8E6E3A',
    mesh: ['#1C160F', '#261F16', '#140F0A', '#332A1E', '#241D14', '#100B06', '#423728', '#544734', '#251E14', '#0B0703', '#130E08', '#2B2114', '#705A3A', '#8F744C', '#BA9B6A', '#D4AF37', '#3C301F', '#292014', '#18120B', '#0B0703', '#1B140B', '#2F2416', '#54422A', '#7A6140', '#150E07', '#332717', '#5A462B', '#836842', '#B49364', '#E6CFA6', '#1D1409', '#392B18', '#634C2C', '#8F7146', '#BE9D6C', '#F3E5CB', '#160E05', '#2E200F', '#563F21', '#836237', '#B68E56', '#EED8B6'],
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
      <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-[#D4AF37]/40 bg-gradient-to-b from-[#1C040B] via-[#2A0612] to-[#140207] p-1 sm:p-2">
        <WarpCarousel
          cards={cards}
          index={activeIdx}
          onIndexChange={(newIdx) => setActiveIdx(newIdx)}
          autoplay={true}
          interval={3.8}
          step={1}
          background="#140207"
          glow="#D4AF37"
          warp={0.85}
          style={{
            minHeight: 380,
            borderRadius: '28px',
            touchAction: 'pan-y',
          }}
        />

        {/* Floating Ceremony Position Pill */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 text-[#F7E2A9] text-[11px] font-semibold tracking-wider uppercase shadow-lg">
            <Sparkles size={11} className="text-[#D4AF37]" />
            <span>Ceremony {activeIdx + 1} of {events.length}</span>
          </span>
        </div>

        {/* Swipe Hint overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
          <span className="text-[11px] text-[#F7E2A9]/75 tracking-widest font-body uppercase bg-black/50 backdrop-blur-xs px-3.5 py-1 rounded-full border border-white/10 shadow-sm">
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
          className="mt-6 bg-[#FAF4EB] border-2 border-[#B69A70] rounded-3xl p-6 sm:p-8 shadow-xl text-center relative max-w-xl mx-auto"
        >
          <div className="absolute inset-2 border border-[#B69A70]/40 rounded-[20px] pointer-events-none" />

          {/* Stepper controls */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full border border-[#B69A70]/50 bg-white hover:bg-[#B69A70]/15 text-[#704B50] transition-colors"
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
              className="p-2 rounded-full border border-[#B69A70]/50 bg-white hover:bg-[#B69A70]/15 text-[#704B50] transition-colors"
              aria-label="Next Ceremony"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#704B50] mb-1">
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
              className="inline-flex items-center gap-1.5 text-xs text-[#704B50] font-semibold hover:text-[#B69A70] bg-white px-4 py-2 rounded-full border border-[#B69A70]/40 shadow-xs hover:shadow-md transition-all group"
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
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#704B50] to-[#8C3A4F] text-white text-xs font-semibold hover:from-[#8C3A4F] hover:to-[#704B50] transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Calendar size={13} />
              <span>Add to Calendar (.ics)</span>
            </button>

            <a
              href={calendarUrls.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-full border border-[#B69A70] bg-white text-[#704B50] hover:bg-[#B69A70]/10 text-xs font-semibold transition-all shadow-xs flex items-center gap-1"
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
