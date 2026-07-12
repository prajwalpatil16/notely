/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E85D30",
        secondary: "#B0907A",
        background: "#FAF7F2",
        surface: "#E8D5C4",
        dark: "#2C1810",
      }
    },
  },
  plugins: [],
}
