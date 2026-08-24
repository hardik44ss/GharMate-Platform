/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Ink / charcoal scale — primary text & surfaces */
        brand: {
          50: '#faf9f7',
          100: '#f1efea',
          200: '#e2ded6',
          300: '#c8c2b5',
          400: '#a49b89',
          500: '#7d7464',
          600: '#615948',
          700: '#4d4739',
          800: '#3c3830',
          900: '#292620',
          950: '#17150f',
        },
        /* Muted brass — the single accent */
        accent: {
          50: '#fbf8f1',
          100: '#f4ecdb',
          200: '#e7d5b4',
          300: '#d6ba87',
          400: '#c5a05c',
          500: '#ab8844',
          600: '#907036',
          700: '#74592e',
          800: '#5c4628',
          900: '#44351f',
          950: '#281f12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
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
