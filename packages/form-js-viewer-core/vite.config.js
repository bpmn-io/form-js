import { resolve } from 'path';
import { createRequire } from 'module';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [
    preact({
      babel: {
        // Change cwd to load Preact Babel plugins
        cwd: createRequire(import.meta.url).resolve('@preact/preset-vite'),
      },
    }),
  ],
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
