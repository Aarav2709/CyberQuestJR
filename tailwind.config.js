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
        night: {
          DEFAULT: '#000000',
          900: '#000000',
          800: '#050505'
        },
        glow: {
          lime: '#A7FF4C',
          amber: '#FFC857',
          orange: '#FF8A3C'
        },
        surface: {
          100: '#050505',
          200: '#0A0A0A',
          300: '#101010'
        }
      },
      fontFamily: {
        sans: ['"Chakra Petch"', '"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif']
      },
      boxShadow: {
        'neon-sm': '0 8px 30px rgba(255, 200, 87, 0.15)',
        'neon-md': '0 24px 80px rgba(255, 138, 60, 0.2)'
      }
    }
  },
  plugins: [],
}
