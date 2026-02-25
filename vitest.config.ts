import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    globals: true, // Allows using 'describe', 'it', 'expect' without imports
    environment: "jsdom", // Simulates a browser for Solid components
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
