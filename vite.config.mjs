import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "renderer",
  plugins: [tailwindcss()],
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: "../dist/renderer",
    emptyOutDir: true
  },
  base: "./"
});
