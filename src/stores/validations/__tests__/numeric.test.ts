import { describe, it, expect } from "vitest";
import * as v from "valibot";
import numeric from "../numeric";

describe("numeric Valibot schema", () => {
  it("should accept valid non-negative integers", () => {
    expect(v.parse(numeric, 45000)).toBe(45000);
    expect(v.parse(numeric, 0)).toBe(0);
    expect(v.parse(numeric, 1)).toBe(1);
  });

  it("should fall back to 0 for negative numbers", () => {
    expect(v.parse(numeric, -100)).toBe(0);
    expect(v.parse(numeric, -1)).toBe(0);
  });

  it("should fall back to 0 for non-number types", () => {
    expect(v.parse(numeric, null)).toBe(0);
    expect(v.parse(numeric, undefined)).toBe(0);
    expect(v.parse(numeric, {})).toBe(0);
  });

  it("should fall back to 0 for strings", () => {
    expect(v.parse(numeric, "45000")).toBe(0);
    expect(v.parse(numeric, "invalid")).toBe(0);
    expect(v.parse(numeric, "")).toBe(0);
  });

  it("should fall back to 0 for floats (not integers)", () => {
    expect(v.parse(numeric, 45.5)).toBe(0);
    expect(v.parse(numeric, 0.1)).toBe(0);
  });
});
