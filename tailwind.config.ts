import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#000000",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#f3f4f6",
                    foreground: "#111827",
                },
                muted: {
                    DEFAULT: "#f3f4f6",
                    foreground: "#6b7280",
                },
                accent: {
                    DEFAULT: "#f3f4f6",
                    foreground: "#111827",
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
