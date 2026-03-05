/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: { xs: '480px' },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['"Syne"', 'sans-serif'],
      },
      colors: {
        accent:        '#E8521A',
        'accent-dark': '#bf3e0e',
        warm:          '#FAFAF8',
        card:          '#F2EDE8',
        muted:         '#8a8a8a',
        border:        '#E0D9D2',
        dark:          '#141414',
      },
      boxShadow: {
        card:    '0 2px 24px rgba(0,0,0,0.08)',
        'card-lg': '0 12px 48px rgba(0,0,0,0.14)',
        'card-xl': '0 24px 64px rgba(0,0,0,0.18)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
      },
      animation: {
        fadeUp:  'fadeUp 0.6s ease both',
        shimmer: 'shimmer 1.4s infinite',
        marquee: 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
}
