import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                pastel: {
                    black: '#2C2E33',    // Dark Charcoal
                    cream: '#F5F2EA',    // Soft Off-White/Cream
                    beige: '#D4CDC3',    // Muted Taupe/Beige
                    yellow: '#E3C565',   // Muted Mustard
                    blue: '#7E9CA6',     // Muted Blue-Gray/Teal
                    taupe: '#A69F96',    // Darker Neutral Taupe
                    olive: '#8A8C7D',    // Muted Olive (Derived)
                },
                // Overriding/Aliasing standard semantic colors to map to our palette
                primary: {
                    DEFAULT: '#27273f', // Updated Main Brand Color
                    foreground: '#F5F2EA',
                },
                secondary: {
                    DEFAULT: '#E3C565', // pastel-yellow
                    foreground: '#2C2E33',
                },
                accent: {
                    DEFAULT: '#7E9CA6', // pastel-blue
                    foreground: '#F5F2EA',
                },
                background: '#F5F2EA', // pastel-cream
                surface: '#FFFFFF',
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
