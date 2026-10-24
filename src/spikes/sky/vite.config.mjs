import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Dedicated build: the spike is deliberately absent from the production entry.
export default defineConfig({
  root: fileURLToPath(new URL('../../..', import.meta.url)),
  base: './',
  publicDir: false,
  plugins: [react()],
  build: { rollupOptions: { input: fileURLToPath(new URL('../../../sky-spike.html', import.meta.url)) } },
});
