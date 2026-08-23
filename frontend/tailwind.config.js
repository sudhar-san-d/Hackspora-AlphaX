/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        civic: {
          bg: '#0B1220', surface: '#111827', secondary: '#172033', text: '#F8FAFC',
          muted: '#94A3B8', border: '#263244', accent: '#2563EB', success: '#16A34A',
          warning: '#D97706', critical: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: { panel: '0 18px 50px rgba(2, 6, 23, 0.24)' },
    },
  },
  plugins: [],
}
