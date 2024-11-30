/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9f7be2",
        primaryHover: "#8a59e6",
      },
      fontFamily: {
        Poppins: "Poppins",
        custom: ["CustomFont"],
      },
    },
  },
  plugins: [],
};
