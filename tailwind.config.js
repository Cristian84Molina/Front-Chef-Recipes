/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        chefRed: "#8B0000",
        chefCream: "#FFF8F0",
        chefBrown: "#5C3A21"
      }
    },
  },
  plugins: [],
}