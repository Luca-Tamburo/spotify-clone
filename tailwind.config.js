/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{html,js,ts,jsx,tsx}",
    "./components/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-light-gray': '#b3b3b3',
        'spotify-gray': '#535353',
        'spotify-dark': '#121212',
        'spotify-light-dark': '#212121',
        'spotify-green': '#1db954'
      }
    },
  },
  plugins: [],
}
