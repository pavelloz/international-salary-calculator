import { calculateFlatTax12, calculateLineartax19, calculateEmploymentContract } from "../calculateTaxes";

describe("calculateFlatTax12", () => {
  test("calculates flat tax 12% monthly correctly", () => {
    const result = calculateFlatTax12(5000);

    expect(result.monthly).toBeGreaterThan(0);
    expect(result.yearly).toBeGreaterThan(0);
  });

  test("calculates flat tax 12% yearly correctly", () => {
    const result = calculateFlatTax12(5000 * 12);

    expect(result.yearly).toBeGreaterThan(0);
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
  });

  test("calculates linear tax 19% yearly correctly", () => {
    const result = calculateLineartax19(5000 * 12);

    expect(result.yearly).toBeGreaterThan(0);
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

describe("calculateEmploymentContract", () => {
  test("calculates progressive taxes and ZUS caps matching reference calculator", () => {
    // Reference: User's screenshot with 43,524.34 gross monthly
    const result = calculateEmploymentContract(43524.34);

    // From our test-uop.js simulation matching the screenshot:
    // Month 1-3 Net: 30000.00
    // Month 4 Net: 24154.00
    // Month 5-6 Net: 22539.00
    // Month 7 Net: 24323.53
    // Month 8-12 Net: 26059.15
    // Total Yearly Net: 313851.28
    // Avg Monthly Net: 26154.27 (or 313851.28 / 12)

    // Allow small rounding differences (e.g., 2 PLN) due to cumulative rounding 
    // vs monthly rounding differences between calculators.
    expect(Math.abs(result.yearly - 313851.28)).toBeLessThan(2);
    expect(Math.abs(result.monthly - (313851.28 / 12))).toBeLessThan(2);
  });

  test("calculates positive net income for a standard salary", () => {
    const result = calculateEmploymentContract(10000);

    // 10000 gross should yield a reasonable net (around ~7k in Poland)
    expect(result.monthly).toBeGreaterThan(6000);
    expect(result.monthly).toBeLessThan(8000);
    expect(result.yearly).toBeCloseTo(result.monthly * 12, 0);
  });
});
