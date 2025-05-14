/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#CCEAFF",
          200: "#66BFFF",
          300: "#0095FF",
          400: "#003FE2",
          500: "#0000C9",
        },
      },
    },
  },
  plugins: [],
  important: true,
};
