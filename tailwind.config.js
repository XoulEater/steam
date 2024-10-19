/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        main: "#F2F2F2",
        dim: "#757F8A",
        bgMain: "#0E141B",
        bgHighlight: "#1E2329",
        bgHover: "#313843",
        bgSecondary: "#14344B",
        bgTertiary: "#212B45",
        primary: "#66C0F4",
        secondary: "#4B619B",
        success: "#A1CD44",
        danger: "#CD5444",
        warning: "#C1B15F",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"), // add this line
  ],
};
