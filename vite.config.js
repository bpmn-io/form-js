import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'e2e',
  define: {
    global: 'window', // necessary to fix Dragula error: `global is not defined`
  },
});
