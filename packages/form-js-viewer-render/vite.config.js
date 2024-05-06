import { resolve } from 'path';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    files: ['test/**/*.spec.js'],
  },
});
