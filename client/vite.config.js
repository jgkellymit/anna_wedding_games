import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // If you are deploying to a subdirectory, uncomment and set the base
    // base: mode === 'production' ? '/your-subdirectory/' : '/',
    server: {
      port: 5173,
      strictPort: true,
      host: true, // Listen on all addresses
    },
    define: {
      'process.env': {
        ...env,
        // Ensure API_URL is available in the client
        VITE_API_URL: env.VITE_API_URL || 'http://localhost:10000',
      },
    },
  };
});
