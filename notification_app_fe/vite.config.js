import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://20.207.122.201",
        changeOrigin: true,
        rewrite: (reqPath) => reqPath.replace(/^\/api/, "/evaluation-service"),
      },
    },
  },
  resolve: {
    alias: {
      "logging-middleware": path.resolve(__dirname, "../logging_middleware/index.js"),
    },
  },
});
