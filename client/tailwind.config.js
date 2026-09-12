/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#08090B",
        surface: "#101216",
        "surface-2": "#15171C",
        border: "#23262D",
        text: "#E7E9EC",
        muted: "#9AA1AC",
        accent: "#8C56D4",
        "accent-light": "#B58AE8",
        cyan: "#7DD3FC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
