/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0A1628',
          800: '#0D2040',
          700: '#0F2D5A',
          600: '#1A3F7A',
          500: '#2155A3',
          400: '#3A70C2',
          100: '#D6E4F7',
          '050': '#EEF4FD',
        },
        neutral: {
          900: '#111827',
          700: '#374151',
          500: '#6B7280',
          300: '#D1D5DB',
          100: '#F3F4F6',
          '050': '#F9FAFB',
        },
        critical: {
          DEFAULT: '#DC2626',
          bg: '#FEF2F2',
        },
        high: {
          DEFAULT: '#EA580C',
          bg: '#FFF7ED',
        },
        medium: {
          DEFAULT: '#CA8A04',
          bg: '#FEFCE8',
        },
        low: {
          DEFAULT: '#16A34A',
          bg: '#F0FDF4',
        },
        verified: {
          DEFAULT: '#B45309',
          bg: '#FFFBEB',
          glow: '#F59E0B',
        }
      },
      fontFamily: {
        display: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '24px',
      },
      boxShadow: {
        'gold-glow': '0 0 0 3px rgba(245, 158, 11, 0.25), 0 8px 32px rgba(245, 158, 11, 0.15)',
        'red-pulse': '0 0 0 3px rgba(220, 38, 38, 0.2)',
      }
    },
  },
  plugins: [],
}
