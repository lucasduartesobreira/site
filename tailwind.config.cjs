/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        //primary: "#33658a",
        primary: "hsl(var(--primary))",
        //secondary: "#126782",
        secondary: "hsl(var(--secondary))",
        tertiary: "hsl(var(--tertiary))",
        //tertiary: "#FF9874",
        tertiary50: "#FFB89C",
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
