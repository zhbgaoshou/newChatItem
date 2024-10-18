import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        wenkai: ["WenKai Mono"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), daisyui],
  daisyui: {
    themes: ["wireframe", "black"],
  },
};
