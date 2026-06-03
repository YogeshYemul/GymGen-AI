import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          300: "#FFE835",
          400: "#F5C518",
          500: "#E6AC00",
        },

        dark: {
          50: "#111111",
          100: "#1C1C1C",
          200: "#252525",
          300: "#0A0A0A",
        },

        surface: {
          100: "#111111",
          200: "#1C1C1C",
          300: "#252525",
        },
      },
    },
  },

  plugins: [],
};

export default config;