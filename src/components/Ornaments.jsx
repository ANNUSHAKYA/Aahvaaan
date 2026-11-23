// Decorative SVG ornament component
export function FloralDivider({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 30"
      className={`w-48 h-8 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 15 C30 15, 40 5, 50 5 C60 5, 60 15, 70 15 C80 15, 80 5, 90 5 C95 5, 100 10, 100 15 C100 10, 105 5, 110 5 C120 5, 120 15, 130 15 C140 15, 140 5, 150 5 C160 5, 170 15, 200 15"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="100" cy="15" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="80" cy="10" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="120" cy="10" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function GoldOrnament({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={`w-32 h-10 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 20 Q30 5 60 20 Q90 35 110 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M10 20 Q30 35 60 20 Q90 5 110 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <circle cx="60" cy="20" r="4" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
      <circle cx="60" cy="20" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function CornerOrnament({ className = '', position = 'top-left' }) {
  const rotations = {
    'top-left': '',
    'top-right': 'scale(-1, 1)',
    'bottom-left': 'scale(1, -1)',
    'bottom-right': 'scale(-1, -1)',
  };

  return (
    <svg
      viewBox="0 0 80 80"
      className={`w-16 h-16 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: rotations[position] }}
    >
      <path
        d="M5 5 C5 5 5 40 5 55 C5 65 10 75 25 75 C40 75 75 75 75 75"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <path
        d="M15 5 C15 5 15 35 15 48 C15 58 20 65 32 65 C44 65 75 65 75 65"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <circle cx="5" cy="5" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
