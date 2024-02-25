import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: true,
  // corePlugins: {
  //   preflight: false,
  // },
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-linear": "linear-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        secondary: {
          50: "#fbfcff",
          100: "#f0f4fd",
          200: "#dee6fb",
          300: "#c5d2f7",
          400: "#a4b9f3",
          500: "#7c9aed",
          600: "#4c75e7",
          700: "#1d4fd7",
          800: "#102c79",
          900: "#091740",
          950: "#06102d",
          core: "#1d4fd7",
        },
        primary: {
          50: "#fefcff",
          100: "#fcf5ff",
          200: "#f9e8ff",
          300: "#f4d6ff",
          400: "#eebfff",
          500: "#e7a3ff",
          600: "#de82ff",
          700: "#d35cff",
          800: "#8600b6",
          900: "#3e0054",
          950: "#250033",
          core: "#d35cff",
        },
        background: "hsl(var(--background))",
        text: "hsl(var(--text))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
  important: true,
}
export default config
