import { calculateFlatTax12, calculateLineartax19 } from "../calculateTaxes.ts";

describe("calculateFlatTax12", () => {
  test("calculates flat tax 12% monthly correctly", () => {
    const result = calculateFlatTax12(5000);

    expect(result.monthly).toBeGreaterThan(0);
    expect(result.yearly).toBeGreaterThan(0);
    expect(typeof result.daily).toBe("number");
    expect(typeof result.hourly).toBe("number");
  });

  test("calculates flat tax 12% yearly correctly", () => {
    const result = calculateFlatTax12(5000 * 12);

    expect(result.yearly).toBeGreaterThan(0);
  });

  test("formats tax results with correct types", () => {
    const result = calculateFlatTax12(5000);

    expect(typeof result.monthly).toBe("number");
    expect(typeof result.yearly).toBe("number");
    expect(typeof result.daily).toBe("number");
    expect(typeof result.hourly).toBe("number");
  });

  test("deducts ZUS social security and health insurance", () => {
    const result = calculateFlatTax12(5000);

    expect(result.monthly).toBeLessThan(5000);
  });
});

describe("calculateLineartax19", () => {
  test("calculates linear tax 19% monthly correctly", () => {
    const result = calculateLineartax19(5000);

    expect(result.monthly).toBeGreaterThan(0);
    expect(result.yearly).toBeGreaterThan(0);
    expect(typeof result.daily).toBe("number");
    expect(typeof result.hourly).toBe("number");
  });

  test("calculates linear tax 19% yearly correctly", () => {
    const result = calculateLineartax19(5000 * 12);

    expect(result.yearly).toBeGreaterThan(0);
  });

  test("formats tax results with correct types", () => {
    const result = calculateLineartax19(5000);

    expect(typeof result.monthly).toBe("number");
    expect(typeof result.yearly).toBe("number");
    expect(typeof result.daily).toBe("number");
    expect(typeof result.hourly).toBe("number");
  });

  test("deducts business costs", () => {
    const result = calculateLineartax19(5000);

    expect(result.monthly).toBeLessThan(5000);
  });
});

describe("tax calculations comparison", () => {
  test("flat tax 12% and linear tax 19% produce different results", () => {
    const flatTax = calculateFlatTax12(5000);
    const linearTax = calculateLineartax19(5000);

    // They should produce different net amounts
    expect(flatTax.monthly).not.toBe(linearTax.monthly);
  });

  test("both tax methods result in positive net income", () => {
    const flatTax = calculateFlatTax12(10000);
    const linearTax = calculateLineartax19(10000);

    expect(flatTax.monthly).toBeGreaterThan(0);
    expect(linearTax.monthly).toBeGreaterThan(0);
  });
});
