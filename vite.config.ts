import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: process.env.VERCEL ? "/" : command === "build" ? "/tarot-learning-proof/" : "/",
  build: {
    sourcemap: true,
  },
}));
