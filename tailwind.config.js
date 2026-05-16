/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          950: '#0F172A',
          DEFAULT: '#0F172A',
        },
        accent: {
          500: '#F59E0B',
          DEFAULT: '#F59E0B',
        },
        neutral: {
          50: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

