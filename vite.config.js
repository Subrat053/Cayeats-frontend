import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // ← must be this, NOT postcss

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ← must be here
  ],
});
