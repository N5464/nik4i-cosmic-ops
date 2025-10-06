/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'cormorant-garamond': ['Cormorant Garamond', 'serif'],
        'aldrich': ['Aldrich', 'monospace'],
        'black-ops': ['Black Ops One', 'cursive'],
        'audiowide': ['Audiowide', 'cursive'],
        'teko': ['Teko', 'sans-serif'],
        'nosifer': ['Nosifer', 'cursive'],
        'metal-mania': ['Metal Mania', 'cursive'],
      },
    },
  },
  plugins: [],
};
