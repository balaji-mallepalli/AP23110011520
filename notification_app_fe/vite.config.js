import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vite configuration for the notification frontend.
 * - Dev server runs on port 3000
 * - Proxy /api/* to the evaluation service to avoid CORS issues
 * - Alias "logging-middleware" to the local package
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy all /api requests to the evaluation service
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
