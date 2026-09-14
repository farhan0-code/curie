/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core light surfaces
        slate: {
          950: '#020617',
          900: '#0F172A',
          850: '#1E293B',
          800: '#334155',
          700: '#475569',
          600: '#64748B',
          500: '#94A3B8',
          400: '#CBD5E1',
          300: '#E2E8F0',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        oats: {
          DEFAULT: '#F8FAFC',
          hover: '#F1F5F9',
          border: 'rgba(15, 23, 42, 0.08)',
          strong: 'rgba(15, 23, 42, 0.16)',
        },
        ink: {
          DEFAULT: '#0F172A',
          primary: '#0F172A',
          secondary: '#334155',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
        curie: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0891B2',
          600: '#0E7490',
          700: '#155E75',
          800: '#164E63',
          900: '#083344',
        },
        brand: {
          teal: '#0D9488',
          cyan: '#0891B2',
          emerald: '#059669',
          rose: '#E11D48',
          slate: '#0F172A',
        },
        clinical: {
          slate: '#0F172A',
          border: 'rgba(15, 23, 42, 0.08)',
          'border-active': 'rgba(8, 145, 178, 0.35)',
          muted: '#64748B',
          subtle: '#94A3B8',
          dark: '#0F172A',
        },
        sage: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        vital: {
          cyan: '#0284C7',
          amber: '#D97706',
          rose: '#E11D48',
          purple: '#7C3AED',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        editorial: ['Outfit', 'sans-serif'],
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite',
        'wave': 'soundWave 1.2s ease-in-out infinite',
        'marquee': 'marqueeScroll 28s linear infinite',
      },
      keyframes: {
        waveBar: {
          '0%, 100%': { transform: 'scaleY(0.2)' },
          '50%': { transform: 'scaleY(1)' },
        },
        soundWave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '22px' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 0.15 },
          '50%': { opacity: 0.35 },
        },
        marqueeScroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
