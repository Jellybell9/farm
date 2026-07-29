import { defineConfig } from "vite";

// Relative asset paths let the app work when published beneath a GitHub Pages
// repository URL as well as from a custom domain.
export default defineConfig({
  base: "./",
});
