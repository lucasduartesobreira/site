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
        quaternary: "#561D25",
        /*
         *background: "#FFD7C4",
         *foreground: "#374151",
         */
        background: "hsl(var(--background))",
        ["background-50"]: "#ffede0",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        titillium: ["Titillium Web", "sans-serif"],
        jetbrains: ["JetBrains Mono", "sans-serif"],
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(60%)" },
          "100%": { opacity: 100, transform: "translateX(0)" },
        },
        appearme: {
          "0%": { opacity: 0 },
          "100%": { opacity: 100 },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-in-out forwards",
        appear: "appearme 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
