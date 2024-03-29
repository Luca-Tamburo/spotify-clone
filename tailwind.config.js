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
        'spotify-semi-light-dark': '#181818',
        'spotify-light-dark': '#212121',
        'spotify-green': '#1db954'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
