/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        sv: {
          neon: "var(--sv-accent)",
          bg: "var(--sv-bg)",
          panel: "var(--sv-panel)",
          text: "var(--sv-text)",
          muted: "var(--sv-muted)",
          border: "var(--sv-border)"
        }
      },
      boxShadow: {
        neon: "0 0 18px var(--sv-accent)"
      }
    },
  },
  plugins: [],
}
