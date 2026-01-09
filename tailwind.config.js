/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: {
          900: "#121212" // Spotify Dark Background
        },
        light: {
          100: "#ffffff",
          200: "#282828" // Dark Gray for cards
        },
        spotify: {
          green: "#1db954",
          black: "#191414"
        }
      }
    },
  },
  plugins: [],
}