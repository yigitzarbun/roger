import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all interfaces (equivalent to 0.0.0.0)
    port: 8080,
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  build: {
    outDir: "dist",
  },
  base: "./", // Ensures relative paths are used for assets in production
});
