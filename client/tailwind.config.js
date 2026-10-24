/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#EBDDCB',
          300: '#DFC8AC',
          400: '#CEAF89',
          500: '#BC9669',
        },
        library: {
          espresso: '#120E0C',
          dark: '#1C1512',
          walnut: '#2B2019',
          leather: '#3F2F24',
          wood: '#5A4434',
          taupe: '#8C7765',
          cream: '#F7F3EB',
          warmWhite: '#FCFAF7',
        },
        gold: {
          light: '#F8E7B4',
          DEFAULT: '#D4AF37',
          dark: '#AA8825',
          glow: 'rgba(212, 175, 55, 0.25)',
        },
        booktok: {
          rose: '#D27D7D',
          wine: '#6D2B3C',
          plum: '#4A1D2B',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.28)',
        'library-elevated': '0 20px 40px -15px rgba(18, 14, 12, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
