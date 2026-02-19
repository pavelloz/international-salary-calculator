import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Allows using 'describe', 'it', 'expect' without imports
    environment: "jsdom", // Simulates a browser for React components
    setupFiles: ["./vitest.setup.ts"],
    css: true, // Optional: processes CSS (helpful if you test styles)
    deps: {
      optimizer: {
        web: {
          include: ["nanostores", "@nanostores/react", "@nanostores/persistent"],
        },
      },
    },
  },
});
