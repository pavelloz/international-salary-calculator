// @ts-check
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import solidJs from '@astrojs/solid-js';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

let adapter = vercel();

if (process.argv[3] === "--node" || process.argv[4] === "--node") {
  adapter = node({ mode: "standalone" });
}

export default defineConfig({
  integrations: [solidJs()],
  adapter,
  vite: {
    // @ts-expect-error - Tailwind v4 plugin has type mismatch with Astro's bundled Vite
    plugins: [tailwindcss()]
  },
  security: {
    checkOrigin: false
  }
});
