import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'e2e',
  define: {
    global: 'window', // necessary to fix Dragula error: `global is not defined`
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'e2e/index.html'),
        carbon: resolve(__dirname, 'e2e/carbon/index.html'),
      },
    },
  },
});
