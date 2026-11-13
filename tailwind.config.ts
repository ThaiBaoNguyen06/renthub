import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Design tokens (UI/UX Pro Max — Real Estate palette)
        brand: {
          DEFAULT: "#0F766E", // primary: trust teal
          hover: "#115E59",
          soft: "#F0FDFA",
          accent: "#14B8A6",
        },
        ink: {
          DEFAULT: "#0F172A", // main text
          muted: "#475569", // secondary text (4.5:1 on white)
        },
        line: "#E2E8F0",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        pill: "0 3px 12px rgba(15, 23, 42, 0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
