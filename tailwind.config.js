/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrialNavy: '#0A192F',
        industrialBlue: '#0f61ab',
        brand: {
          50: '#eff6fc', 100: '#dcecf8', 200: '#bfdaf0', 300: '#91bee3',
          400: '#5f9ed1', 500: '#0f61ab', 600: '#0d5b9f', 700: '#0b4f8b',
          800: '#0a3f70', 900: '#082f53', 950: '#041c33',
        },
      },
    },
  },
  plugins: [],
}
