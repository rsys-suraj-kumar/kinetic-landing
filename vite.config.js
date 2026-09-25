import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves the site from /kinetic-landing/, so CI builds need
// the sub-path base. Local dev keeps the default "/".
export default defineConfig({
  base: process.env.CI ? "/kinetic-landing/" : "/",
  plugins: [react(), tailwindcss()],
});
