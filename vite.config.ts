import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  root: ".",
  server: {
    port: 8011,
  },
  plugins: [
    react(),
    legacy({
      targets: ["last 2 versions and not dead, > 0.3%, Firefox ESR"],
    }),
  ],
});
