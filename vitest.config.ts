import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      "astro:actions": path.resolve(__dirname, "./src/actions/mock.ts"),
    },
  },
  test: {
    globals: true, // Allows using 'describe', 'it', 'expect' without imports
    // environment: "jsdom", // Simulates a browser for Solid components
    environment: 'happy-dom', // Just change 'jsdom' to 'happy-dom'
    setupFiles: ["./vitest.setup.ts"],
    css: true, // Optional: processes CSS (helpful if you test styles)
    deps: {
      optimizer: {
        web: {
          include: ["nanostores", "@nanostores/solid", "@nanostores/persistent"],
        },
      },
    },
  },
});
