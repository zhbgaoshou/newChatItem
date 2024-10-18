import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import svgLoader from "vite-svg-loader";

const svgLoaderConfig = {
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false, // 保留 viewBox 属性，确保 SVG 可以自适应大小
          },
        },
      },
    ],
  },
}



export default defineConfig({
  plugins: [vue(), svgLoader(svgLoaderConfig as any)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000/",
        changeOrigin: true,
      },
    },
  },
});
