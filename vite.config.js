import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://mahadevaaya.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/dhokotdwarproject2/dhokotdwarproject2_backend/api'),
      },
      '/media': {
        target: 'https://mahadevaaya.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
});