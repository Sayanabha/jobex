import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./ai/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        }
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)"],
        body: ["var(--font-source-sans-3)"]
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0px)" }
        }
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out both"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(24, 253, 176, 0.12)"
      },
      backgroundImage: {
        noise:
          "radial-gradient(circle at top, rgba(0,255,194,0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(255,145,77,0.14), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
      }
    }
  },
  plugins: []
};

export default config;
