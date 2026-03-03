import "@testing-library/jest-dom/vitest";
import { cleanup } from "@solidjs/testing-library";
import { afterEach, vi } from "vitest";

// Mock localStorage so Nano Stores doesn't crash in the test environment
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

vi.mock("astro:actions", () => ({
  actions: {
    getRates: vi.fn(),
  },
}));

// Cleanup DOM after each test
afterEach(() => {
  cleanup();
});
