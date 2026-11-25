import React from 'react';

/**
 * Authentic SVG Art & Motifs extracted directly from the Mor Pankh royal invitation design
 */

export function PaperGrainFilter() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full mix-blend-multiply opacity-50" aria-hidden="true">
      <filter id="mor-pankh-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.065" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#mor-pankh-grain)" />
    </svg>
  );
}

export function MorPankhFeather({ className = 'h-36 w-28 shrink-0' }) {
  return (
    <svg viewBox="0 0 160 190" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="mp_feather_grad" x1="0" x2="1" y2="1">
          <stop stopColor="#7dc8a2" />
          <stop offset="0.35" stopColor="#217e74" />
          <stop offset="0.75" stopColor="#124956" />
          <stop offset="1" stopColor="#77b58c" />
        </linearGradient>
      </defs>
      <path d="M80 184Q18 80 80 8Q142 80 80 184" fill="url(#mp_feather_grad)" stroke="#C9A24B" strokeWidth="1.2" />
      <path d="M80 184V10" stroke="#C9A24B" strokeWidth="1.5" />
      <path d="M80 148Q48 126 34 105M80 148Q112 126 126 105" stroke="#C9A24B" strokeWidth="0.8" opacity="0.7" />
      <path d="M80 118Q54 98 44 76M80 118Q106 98 116 76" stroke="#C9A24B" strokeWidth="0.8" opacity="0.7" />
      <path d="M80 88Q60 70 52 50M80 88Q100 70 108 50" stroke="#C9A24B" strokeWidth="0.8" opacity="0.7" />
      <ellipse cx="80" cy="68" rx="27" ry="36" fill="#C9A24B" />
      <ellipse cx="80" cy="70" rx="21" ry="28" fill="#a9b86b" />
      <ellipse cx="80" cy="73" rx="16" ry="21" fill="#2bc0b4" />
      <ellipse cx="80" cy="76" rx="11" ry="14" fill="#284781" />
      <circle cx="80" cy="77" r="7" fill="#101f43" />
    </svg>
  );
}

export function LotusCrest({ className = 'h-20 w-28 shrink-0' }) {
  return (
    <svg viewBox="0 0 150 110" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="mp_lotus_grad" x2="0.2" y2="1">
          <stop stopColor="#fff0df" />
          <stop offset="0.45" stopColor="#ed9ab1" />
          <stop offset="1" stopColor="#a6356d" />
        </linearGradient>
      </defs>
      <ellipse cx="43" cy="90" rx="37" ry="13" fill="#366b4e" transform="rotate(-10 43 90)" />
      <ellipse cx="106" cy="92" rx="36" ry="12" fill="#568661" />
      <path d="M12 95L67 84M89 92L134 93" stroke="#b8bd6b" strokeWidth="0.8" />
      <path d="M75 87C37 63 53 28 75 8C96 29 111 64 75 87Z" transform="rotate(-55 75 87) scale(0.9)" fill="url(#mp_lotus_grad)" stroke="#f5c3bd" strokeWidth="1" />
      <path d="M75 87C37 63 53 28 75 8C96 29 111 64 75 87Z" transform="rotate(-30 75 87) scale(0.9)" fill="url(#mp_lotus_grad)" stroke="#f5c3bd" strokeWidth="1" />
      <path d="M75 87C37 63 53 28 75 8C96 29 111 64 75 87Z" transform="rotate(0 75 87) scale(1)" fill="url(#mp_lotus_grad)" stroke="#f5c3bd" strokeWidth="1" />
      <path d="M75 87C37 63 53 28 75 8C96 29 111 64 75 87Z" transform="rotate(30 75 87) scale(0.9)" fill="url(#mp_lotus_grad)" stroke="#f5c3bd" strokeWidth="1" />
      <path d="M75 87C37 63 53 28 75 8C96 29 111 64 75 87Z" transform="rotate(55 75 87) scale(0.9)" fill="url(#mp_lotus_grad)" stroke="#f5c3bd" strokeWidth="1" />
      <path d="M75 87Q42 67 49 50Q72 57 75 87Q78 57 101 50Q108 67 75 87" fill="#edb4bd" stroke="#ffe1ce" />
      <path d="M62 86Q75 57 88 86" fill="#e9bf68" />
    </svg>
  );
}

export function ArchGoldenTrim({ className = 'pointer-events-none absolute inset-3 h-[calc(100%-24px)] w-[calc(100%-24px)] text-gold' }) {
  return (
    <svg viewBox="0 0 340 540" preserveAspectRatio="none" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M12 528V133Q12 80 60 80Q60 43 111 43Q138 43 170 10Q202 43 229 43Q280 43 280 80Q328 80 328 133V528" strokeWidth="1.2" strokeDasharray="3 2" />
      <path d="M22 528V135Q22 92 68 92Q68 55 115 55Q142 55 170 26Q198 55 225 55Q272 55 272 92Q318 92 318 135V528" strokeWidth="0.8" />
      <circle cx="170" cy="10" r="4" fill="#C9A24B" />
      <circle cx="111" cy="43" r="3" fill="#C9A24B" />
      <circle cx="229" cy="43" r="3" fill="#C9A24B" />
      <circle cx="60" cy="80" r="3" fill="#C9A24B" />
      <circle cx="280" cy="80" r="3" fill="#C9A24B" />
      <path d="M170 43V85" strokeWidth="0.8" strokeDasharray="2 2" />
      <circle cx="170" cy="89" r="3.5" fill="#C9A24B" />
    </svg>
  );
}

export function MorPankhFan({ className = 'h-40 w-48 shrink-0 drop-shadow-[0_7px_5px_#082d2e40] mx-auto mb-5' }) {
  const angles = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
  return (
    <svg viewBox="0 0 240 210" className={className} aria-hidden="true">
      {angles.map((ang, i) => (
        <g key={i} transform={`rotate(${ang} 120 164)`}>
          <path d="M120 166Q72 62 120 7Q168 62 120 166" fill="#39816b" stroke="#C9A24B" strokeWidth="0.7" />
          <ellipse cx="120" cy="52" rx="12" ry="20" fill="#a9b86b" />
          <ellipse cx="120" cy="54" rx="8" ry="14" fill="#2bc0b4" />
          <ellipse cx="120" cy="56" rx="5" ry="9" fill="#284781" />
          <circle cx="120" cy="57" r="3" fill="#101f43" />
        </g>
      ))}
      {/* Center peacock head flourish */}
      <circle cx="120" cy="164" r="14" fill="#082D2E" stroke="#C9A24B" strokeWidth="1.5" />
      <circle cx="120" cy="164" r="6" fill="#2BC0B4" />
    </svg>
  );
}
