import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: "#0c1017",
          panel: "#121824",
          card: "#182232",
          cardHover: "#1f2c41",
          border: "#27374d",
          borderSubtle: "#1c283a",
          gold: "#eab308",
          goldMuted: "#b45309",
          arcane: "#a855f7",
          arcaneDark: "#7e22ce",
          cyan: "#06b6d4",
          emerald: "#10b981",
          crimson: "#ef4444",
          parchment: "#f8f5eb",
          ink: "#1c1917"
        }
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "Cambria", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        'glow-gold': '0 0 15px -3px rgba(234, 179, 8, 0.25)',
        'glow-arcane': '0 0 20px -3px rgba(168, 85, 247, 0.3)',
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
