const { nextui } = require("@nextui-org/react");
const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      screens: {
        short: { raw: "(max-height: 420px)" },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            content1: "#242524",
            primary: "#00ADB5",
            background: "#333333",
            secondary: "#f91880",
          },
        },
        light: {
          colors: {
            primary: "#ff8c00",
            background: "#EFEFEF",
            secondary: "#f91880",
          },
        },
      },
    }),
  ],
};
