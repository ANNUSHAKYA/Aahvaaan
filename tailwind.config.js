/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aahvaaan Core Luxury Palette
        ivory: '#FAF7F2',             // Warm Ivory: primary background
        'warm-ivory': '#FAF7F2',
        wine: '#512D38',              // Deep Wine: headings, logo, primary buttons
        'deep-wine': '#512D38',
        'wine-light': '#6B3D4A',
        rose: '#C99191',              // Dusty Rose: decorative highlights and accents
        'dusty-rose': '#C99191',
        'rose-light': '#DDB0B0',
        champagne: '#E9D8CC',         // Champagne Beige: cards and alternate sections
        'champagne-beige': '#E9D8CC',
        'champagne-light': '#F5ECE5',
        gold: '#B69A70',              // Antique Gold: fine borders, icons and decorative details
        'antique-gold': '#B69A70',
        'gold-light': '#C8B28F',
        charcoal: '#65575A',          // Warm Charcoal: body text
        'warm-charcoal': '#65575A',
        blush: '#E8B4B8',
        teal: '#0E4D4F',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
        hindi: ['"Noto Serif Devanagari"', 'serif'],
        punjabi: ['"Noto Serif Gurmukhi"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
