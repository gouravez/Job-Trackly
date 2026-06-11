/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#3b5bdb',
          600: '#3451c7',
          700: '#2f4ab3',
          800: '#1e3a8a',
        },
        // Premium dark surface system
        dark: {
          bg:      '#0d0f14',   // page background
          s1:      '#13161e',   // sidebar, cards
          s2:      '#1a1e2a',   // inputs, modals
          s3:      '#1f2436',   // hover, nested panels
          s4:      '#252b3b',   // active states
          border:  '#252a3a',   // chromatic border
          border2: '#2e3448',   // brighter border for focus rings
          tx1:     '#e8eaf2',   // primary text
          tx2:     '#8b91a8',   // secondary text
          tx3:     '#4e5470',   // muted text
          accent:  '#3d66e8',   // brighter blue for dark bg
        }
      }
    },
  },
  plugins: [],
}