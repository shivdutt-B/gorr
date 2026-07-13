/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--bg) / <alpha-value>)",
        elevated: "hsl(var(--bg-elevated) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--bg-surface) / <alpha-value>)",
          strong: "hsl(var(--bg-surface-strong) / <alpha-value>)",
        },
        border: {
          DEFAULT: "hsl(var(--border-subtle) / <alpha-value>)",
          strong: "hsl(var(--border-strong) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "hsl(var(--text-primary) / <alpha-value>)",
          muted: "hsl(var(--text-muted) / <alpha-value>)",
          subtle: "hsl(var(--text-secondary) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          strong: "hsl(var(--accent-strong) / <alpha-value>)",
        },
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        "panel-strong": "var(--shadow-panel-strong)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      animation: {
        rainbow: "rainbow var(--speed, 2s) infinite linear",
      },
      keyframes: {
        rainbow: {
          "0%": {
            backgroundPosition: "0%",
          },
          "100%": {
            backgroundPosition: "200%",
          },
        },
      },
      screens: {
        xmob: "350px",
        mob: "390px",
      },
    },
  },
  plugins: [],
};