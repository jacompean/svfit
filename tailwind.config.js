/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        svfit: {
          bg: "#0B0B0F",
          panel: "#11131A",
          panel2: "#0F1117",
          border: "#1F2430",
          text: "#E6E6E6",
          muted: "#9AA4B2",
          neon: "#39FF14"
        }
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(57,255,20,0.25), 0 10px 30px rgba(0,0,0,0.45)",
      }
    },
  },
  plugins: [],
};
