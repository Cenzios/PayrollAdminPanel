import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],

    server: {
      // Dev server port from .env (fallback to 5173)
      port: Number(env.VITE_DEV_PORT) || 6091,
    },

    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
