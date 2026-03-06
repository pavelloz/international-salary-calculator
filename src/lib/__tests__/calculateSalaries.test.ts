import { calculateSalaries, convertSalaryPeriod, convertToAnnual, convertSalaryCurrency } from "../calculateSalaries";

describe("calculateSalaries", () => {
  test("calculates salaries for hourly period", () => {
    const result = calculateSalaries(100, "hourly", 1);

    expect(result.hourly).toBe(100);
    expect(result.monthly).toBeGreaterThan(0);
    expect(result.yearly).toBeGreaterThan(0);
  });

  describe("handle fallback periods", () => {
    test("returns same salary for unknown period in calculateSalaries", () => {
      const result = calculateSalaries(5000, "unknown", 1);
      expect(result.yearly).toBe(5000);
      expect(result.monthly).toBe(417);
    });

    test("returns same salary for unknown period in convertToAnnual directly", () => {
      expect(convertToAnnual(5000, "unknown")).toBe(5000);
    });
  });

  test("calculates salaries for monthly period", () => {
    const result = calculateSalaries(5000, "monthly", 1);

    expect(result.monthly).toBe(5000);
    expect(result.yearly).toBe(60000);
  });


  test("calculates salaries for yearly period", () => {
    const result = calculateSalaries(60000, "yearly", 1);

    expect(result.yearly).toBe(60000);
    expect(result.monthly).toBe(5000);
  });

  test("formats salary correctly", () => {
    const formatted = calculateSalaries(50000, "yearly", 1);

    expect(formatted.yearly).toBe(50000);
  });
});

describe("convertSalaryPeriod", () => {
  test("converts from monthly to yearly correctly", () => {
    const result = convertSalaryPeriod(10000, "monthly", "yearly");
    expect(result).toBe(120000);
  });

  test("converts from yearly to monthly correctly", () => {
    const result = convertSalaryPeriod(120000, "yearly", "monthly");
    expect(result).toBe(10000);
  });


  test("converts from simple amounts back to themselves", () => {
    expect(convertSalaryPeriod(5000, "monthly", "monthly")).toBe(5000);
    expect(convertSalaryPeriod(150000, "yearly", "yearly")).toBe(150000);
  });

  test("rounds gracefully", () => {
    // 10000 yearly -> monthly = 10000 / 12 = 833.333... -> 833
    const result = convertSalaryPeriod(10000, "yearly", "monthly");
    expect(result).toBe(833);
  });
});

describe("convertSalaryCurrency", () => {
  test("returns original salary if oldRate is 0", () => {
    expect(convertSalaryCurrency(5000, 0, 4)).toBe(5000);
  });

  test("returns original salary if newRate is 0", () => {
    expect(convertSalaryCurrency(5000, 4, 0)).toBe(5000);
  });

  test("converts salary correctly between currencies", () => {
    expect(convertSalaryCurrency(5000, 4, 1)).toBe(20000);
    expect(convertSalaryCurrency(20000, 1, 4.3)).toBe(4651);
    expect(convertSalaryCurrency(5000, 5, 4.3)).toBe(5814);
  });
});
