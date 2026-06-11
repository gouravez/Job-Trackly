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
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
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

        light: {
          bg:      '#f5f6fa',
          grid:    '#f0f0f0',
          'auth-1': '#e8ecf5',
          'auth-2': '#dde3f0',
          'auth-3': '#c8d0e8',
          'auth-4': '#d8e0ef',
          'auth-5': '#c4cfea',
        },

        dark: {
          bg:           '#0d0f14',
          s1:           '#13161e',
          s2:           '#1a1e2a',
          s3:           '#1f2436',
          s4:           '#1a2344',
          border:       '#252a3a',
          border2:      '#2e3448',
          tx1:          '#e8eaf2',
          tx2:          '#8b91a8',
          tx3:          '#4e5470',
          accent:       '#2f54c8',
          accent2:      '#3d66e8',
          accent3:      '#6b8ef5',
          'accent-bg':  '#1f2c54',
          'accent-dim': '#2645b0',

          'blue-tint':   '#0f1a35',
          'green-tint':  '#0f2318',
          'green-tint2': '#0a2015',
          'amber-tint':  '#271e0a',
          'red-tint':    '#2a0f11',
          'teal-tint':   '#0a2020',
          'purple-tint': '#1a1030',
          'pink-tint':   '#2a0f20',
          'orange-tint': '#2a1508',
          'navy-tint':   '#10153a',
          'auth-mid':    '#0f1219',
          'sky-tint':    '#0a1f2a',
        },

        status: {
          blue:    '#3b82f6',
          teal:    '#14b8a6',
          amber:   '#f59e0b',
          green:   '#22c55e',
          emerald: '#10b981',
          red:     '#ef4444',
          gray:    '#9ca3af',
          gray2:   '#6b7280',
        },
      },
    },
  },
  plugins: [],
}

