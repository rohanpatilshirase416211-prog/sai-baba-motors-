/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F2F6FA',
          100: '#E2ECF5',
          200: '#C2D7EB',
          300: '#94BBDC',
          400: '#5C98C8',
          500: '#3577B0',
          600: '#235D92',
          700: '#1A4974',
          800: '#153C5E',
          900: '#0B192C', // Deep Signature Navy
          950: '#060D17',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FFFBE8',
          200: '#FEF5C6',
          300: '#FDEAA4',
          400: '#FBD762',
          500: '#F59E0B',
          600: '#D97706', // Primary Warm Accent
          700: '#B45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        marathi: ['"Noto Sans Devanagari"', '"Tiro Devanagari Marathi"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 25, 44, 0.08)',
        'card-hover': '0 12px 30px -4px rgba(11, 25, 44, 0.15)',
        'glow': '0 0 25px rgba(217, 119, 6, 0.25)',
      },
    },
  },
  plugins: [],
};
