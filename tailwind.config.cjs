/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7695FF",
        secondary: "#9DBDFF",
        tertiary: "#FF9874",
        /*
         *background: "#FFD7C4",
         *foreground: "#374151",
         */
        background: "var(hsl(--background))",
        foreground: "var(hsl(--foreground))",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        titillium: ["Titillium Web", "sans-serif"],
      },
    },
  },
  plugins: [],
};
