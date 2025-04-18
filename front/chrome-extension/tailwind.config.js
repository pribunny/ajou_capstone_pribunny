/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            primary: "#42d4f5",
            mainText: "#000000"
        },
        fontFamily: {
            serif: ["ui-sans-serif"]
        },
    },
  },
  plugins: [],
}

