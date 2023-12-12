/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  plugins: [require('@tailwindcss/forms')],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        company: {
          DEFAULT: '#06396e',
          50: '#eafaff',
          100: '#d1f5ff',
          200: '#adeeff',
          300: '#75e7ff',
          400: '#34d5ff',
          500: '#05b6ff',
          600: '#0091ff',
          700: '#0078ff',
          800: '#0063d9',
          900: '#0057a9',
          950: '#06396e',
        },
        'company-black': {
          50: '#f7f7f6',
          100: '#e4e4e3',
          200: '#c9c9c6',
          300: '#a7a6a1',
          400: '#84837d',
          500: '#696963',
          600: '#53534e',
          700: '#454440',
          800: '#393936',
          900: '#32322f',
          950: '#1d1d1b',
        },
        'company-green': {
          50: '#f0fdf6',
          100: '#dbfdeb',
          200: '#b9f9d8',
          300: '#83f2b8',
          400: '#46e292',
          500: '#1ec972',
          600: '#12a75b',
          700: '#12834a',
          800: '#156d41',
          900: '#125535',
          950: '#042f1b',
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
