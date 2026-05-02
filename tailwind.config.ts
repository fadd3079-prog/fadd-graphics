import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        lineStrong: "rgb(var(--color-line-strong) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        accentStrong: "rgb(var(--color-accent-strong) / <alpha-value>)",
        accentSoft: "rgb(var(--color-accent-soft) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "sans-serif"],
        display: ["Inter Variable", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 36px rgba(15, 15, 15, 0.06)",
        lift: "0 26px 70px rgba(15, 15, 15, 0.16)",
        edge: "0 0 0 1px rgba(130, 120, 104, 0.12), 0 20px 58px rgba(15, 15, 15, 0.11)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
