import type { Config } from "tailwindcss";
import daisyui from "daisyui"; // Import daisyui

const config: Config = {
  content: [
    // Keep existing content paths
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { // Add fontFamily extension
        sans: ['var(--font-geist-sans)'], // Keep existing sans
        mono: ['var(--font-geist-mono)'], // Keep existing mono
        pixel: ['var(--font-pixel)', 'monospace'], // Add pixel font utility
      },
      screens: {
        'xs': '480px', // 添加xs断点，适用于小屏幕设备
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    daisyui
  ],
  // daisyUI config moved inside the plugin call if needed,
  // but often default themes are sufficient initially or configured elsewhere.
  // For explicit theme config *within* tailwind.config.ts (less common now):
  // plugins: [
  //   require("daisyui")({
  //     themes: ["light", "dark"],
  //   }),
  // ],
  // Let's stick to the simpler plugin registration for now.
  // We can add specific theme config later if needed.
  daisyui: {
    themes: [
      {
        "blue-white": { // Light theme: Blue/White
          "primary": "#3b82f6", // blue-500
          "secondary": "#60a5fa", // blue-400
          "accent": "#2563eb", // blue-600
          "neutral": "#d1d5db", // gray-300
          "base-100": "#ffffff", // white
          "info": "#0ea5e9", // sky-500
          "success": "#22c55e", // green-500
          "warning": "#f59e0b", // amber-500
          "error": "#ef4444", // red-500
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
        },
      },
      {
        "black-purple": { // Dark theme: Black/Purple
          "primary": "#a855f7", // purple-500 (from existing cyberpunk)
          "secondary": "#7e22ce", // purple-700
          "accent": "#c026d3", // fuchsia-600
          "neutral": "#1f2937", // gray-800
          "base-100": "#111827", // gray-900 (darker than default cyberpunk base)
          "base-200": "#1f2937", // gray-800
          "base-300": "#374151", // gray-700
          "info": "#0ea5e9", // sky-500
          "success": "#22c55e", // green-500
          "warning": "#f59e0b", // amber-500
          "error": "#ef4444", // red-500
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
        },
      },
    ],
    darkTheme: "black-purple", // Set black-purple as the default dark theme
    base: true,
    styled: true,
    utils: true,
    logs: true,
  },
};
export default config;
