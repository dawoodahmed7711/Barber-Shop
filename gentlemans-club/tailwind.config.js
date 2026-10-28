/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: { DEFAULT: "#2457D6", dark: "#1B45B0", light: "#E8EEFC" },
        mist: "#F3F6FB",
        navy: "#172033",
        line: "#E5E7EB",
        slate: { DEFAULT: "#64748B", dark: "#475569" },
      },
      fontFamily: {
        // System stacks: no build-time font download needed. To use Google Fonts,
        // load them with next/font in app/layout.jsx and point these at the CSS variables.
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["Iowan Old Style", "Palatino Linotype", "Palatino", "Georgia", "Cambria", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,32,51,0.04), 0 8px 24px -12px rgba(23,32,51,0.12)",
        lift: "0 2px 4px rgba(23,32,51,0.06), 0 16px 36px -14px rgba(36,87,214,0.28)",
      },
    },
  },
  plugins: [],
};
