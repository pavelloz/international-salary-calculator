// @ts-check
import { defineConfig } from 'astro/config';

import solidJs from '@astrojs/solid-js';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  adapter: vercel(),
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].js',
          assetFileNames: '[ext]/[name].[hash].[ext]',
          experimentalMinChunkSize: 10000, // Merges chunks under 10kB
          manualChunks(id) {
            // Group solid-js, nanostores, and valibot together
            if (id.includes('node_modules')) {
              return 'vendor';
            }

            if (id.includes('/src/')) {
              return 'app';
            }
          }
        }
      }
    }
  }
});