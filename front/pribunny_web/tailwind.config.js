/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors : {
            'yellow-01' : '#FFFDEB',
            'yellow-02' : '#FFF799'
        },
    },
  },
  plugins: [],
}

