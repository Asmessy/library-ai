/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: '#6366f1',
          600: '#4F46E5', // Primary specific from user
          700: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}
