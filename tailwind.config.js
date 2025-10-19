/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        rainbow: {
          '0%': { color: '#ff0000' },   // red
          '25%': { color: '#ff9900' },  // orange
          '50%': { color: '#00ff00' },  // green
          '75%': { color: '#0066ff' },  // blue
          '100%': { color: '#ff00ff' }, // magenta
        },
      },
      animation: {
        'wave': 'wave 1s ease-in-out infinite',
        'rainbow': 'rainbow 3s linear infinite',
      },
    },
     fontFamily: {
        shadows: ['"Shadows Into Light"', 'cursive'],
      },
  },
  plugins: [],
}
