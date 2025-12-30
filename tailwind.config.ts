import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
  fontFamily: {
    body: ["var(--font-body)", "system-ui", "sans-serif"],
    title: ["var(--font-title)", "system-ui", "sans-serif"],
  },
},
  },
  plugins: [],
} satisfies Config;