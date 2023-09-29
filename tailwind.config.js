/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        200: "200px",
        250: "250px",
        300: "300px",
        350: "350px",
        400: "400px",
        450: "450px",
        500: "500px",
        600: "600px",
        640: "640px",
        650: "650px",
      },
      height: {
        200: "200px",
        250: "250px",
        300: "300px",
        350: "350px",
        400: "400px",
        450: "450px",
        480: "480px",
        500: "500px",
        600: "600px",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
  plugins: [],
};
