/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#E6F4FF",
          200: "#CCEAFF",
          300: "#66BFFF",
          400: "#0095FF",
        },
      },
    },
  },
  plugins: [],
  important: true,
};
