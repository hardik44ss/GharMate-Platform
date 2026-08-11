/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fb',
          100: '#dce8f4',
          200: '#bcd0ea',
          300: '#8fb0db',
          400: '#5e89c8',
          500: '#3c6ab5',
          600: '#2c5396',
          700: '#264379',
          800: '#223962',
          900: '#1d3052',
          950: '#0f1d33',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(15, 29, 51, 0.08), 0 1px 3px -1px rgba(15, 29, 51, 0.06)',
        'float': '0 8px 32px -8px rgba(15, 29, 51, 0.18), 0 2px 8px -4px rgba(15, 29, 51, 0.1)',
        'glass': '0 8px 32px -12px rgba(255, 255, 255, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
