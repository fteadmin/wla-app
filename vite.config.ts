import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // This helps split your code so the browser loads pages faster
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Put Lucide icons in their own chunk (they are usually the biggest part of your build)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Put Stripe and Supabase in their own chunk
            if (id.includes('@stripe') || id.includes('@supabase')) {
              return 'vendor-auth-pay';
            }
            // Everything else from node_modules goes into a general vendor chunk
            return 'vendor';
          }
        },
      },
    },
    // Optional: Raise the warning limit slightly if you still see the warning
    chunkSizeWarningLimit: 800,
  },
}));