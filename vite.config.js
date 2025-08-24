import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /* 👇 이 부분을 잠시 주석 처리
  server: {
    proxy: {
      "/api": {
        target: "https://festival-everyday/duckdns.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  */
});

