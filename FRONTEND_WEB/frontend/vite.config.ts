import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    host: '0.0.0.0', // Permet l'accès depuis le réseau local et Docker
    port: 5174,
    strictPort: false,
    watch: {
      usePolling: false, // Désactivé pour de meilleures performances en local
      interval: 100, // Réduit pour un hot reload plus rapide
    },
    hmr: {
      overlay: true, // Affiche les erreurs en overlay
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Désactive les sourcemaps pour des builds plus rapides
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['apexcharts', 'react-apexcharts'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    exclude: [],
  },
});
