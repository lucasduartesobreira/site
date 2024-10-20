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
        jetbrains: ["JetBrains Mono", "monospace"],
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
  plugins: [
    function ({ addBase, config }) {
      addBase({
        "@font-face": [
          {
            fontFamily: "Titillium Web",
            fontStyle: "normal",
            fontWeight: "300 700",
            src: "url(https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,300;0,400;0,600;0,700&display=swap)",
            fontDisplay: "swap",
          },
          {
            fontFamily: "Montserrat",
            fontStyle: "normal",
            fontWeight: "300 700",
            src: "url(https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300..700;1,300..700&display=swap)",
            fontDisplay: "swap",
          },
          {
            fontFamily: "JetBrains Mono",
            fontStyle: "normal",
            fontWeight: "300",
            src: "url(https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;1,300&display=swap)",
            fontDisplay: "swap",
          },
        ],
      });
    },
  ],
};
