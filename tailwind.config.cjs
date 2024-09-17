/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        //primary: "#7695FF",
        primary: "hsl(var(--primary))",
        //secondary: "#9DBDFF",
        secondary: "hsl(var(--secondary))",
        tertiary: "#FF9874",
        /*
         *background: "#FFD7C4",
         *foreground: "#374151",
         */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        titillium: ["Titillium Web", "sans-serif"],
        jetbrains: ["JetBrains Mono", "sans-serif"],
      },
    },
  },
  plugins: [],
};
