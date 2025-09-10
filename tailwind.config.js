/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        clouds: "cloudScroll 90s linear infinite",
      },
      keyframes: {
        cloudScroll: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "-1000px 0" },
        },
      },
    },
  },
  plugins: [],
};