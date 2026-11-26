/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: '#0E4D4F',
        gold: '#C9A24B',
        'gold-light': '#E3D3AE',
        ivory: '#FBF5E9',
        blush: '#E8B4B8',
        charcoal: '#2B2B2B',
        wine: '#512D38',
        'wine-light': '#6B3D4A',
        rose: '#C99191',
        'rose-light': '#D4A5A5',
        champagne: '#E9D8CC',
        'champagne-light': '#F0E4DA',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
        hindi: ['"Noto Serif Devanagari"', 'serif'],
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
