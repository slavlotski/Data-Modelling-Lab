import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        notion: {
          text: "#37352f",
          "text-secondary": "#787774",
          bg: "#ffffff",
          "bg-hover": "#f1f1ef",
          "bg-gray": "#f7f6f3",
          border: "#e9e9e7",
          "border-dark": "#d3d3d0",
          accent: "#2eaadc",
          brown: "#9f6b53",
          orange: "#d9730d",
          yellow: "#cb912f",
          green: "#448361",
          blue: "#337ea9",
          purple: "#9065b0",
          pink: "#c14c8a",
          red: "#d44c47",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
