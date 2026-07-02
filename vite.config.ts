import { defineConfig } from "vite";

export default defineConfig({
  base: "/mi-vida/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          motion: ["gsap"]
        }
      }
    }
  }
});
