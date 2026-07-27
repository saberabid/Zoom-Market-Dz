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
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          800: '#0F172A',
          900: '#0A192F',
          950: '#070F1E',
        },
        brand: {
          orange: '#FF5500',
          'orange-hover': '#E04B00',
          'orange-light': '#FFF0E6',
          navy: '#0A192F',
          'navy-light': '#1E293B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(255, 85, 0, 0.4)',
        'card': '0 10px 30px -5px rgba(10, 25, 47, 0.08)',
        'card-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
