/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(94, 234, 212, 0.25)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 10% 20%, rgba(14, 116, 144, 0.22), transparent 40%), radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.25), transparent 35%), radial-gradient(circle at 50% 80%, rgba(14, 165, 233, 0.18), transparent 45%)",
      },
    },
  },
  plugins: [],
};
