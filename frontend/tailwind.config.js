/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        civic: {
          bg: '#F2F1F0', surface: '#FFFFFF', secondary: '#E8E7E5', text: '#2B3033',
          muted: '#6B6F72', border: '#DCDAD7', accent: '#15BCDF', success: '#10B981',
          warning: '#F59E0B', critical: '#EF4444', dark: '#1A1C1E',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        quantico: ['Quantico', 'Arial Narrow', 'sans-serif'],
      },
      boxShadow: { panel: '0 10px 30px rgba(0, 0, 0, 0.06)' },
    },
  },
  plugins: [],
}
