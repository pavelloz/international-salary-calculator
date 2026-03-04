import { calculateSalaries, convertSalaryPeriod, convertToAnnual } from "../calculateSalaries";

describe("calculateSalaries", () => {
  test("calculates salaries for hourly period", () => {
    const result = calculateSalaries(100, "hourly", 1);

    expect(result.hourly).toBe(100);
    expect(result.daily).toBeGreaterThan(0);
    expect(result.monthly).toBeGreaterThan(0);
    expect(result.yearly).toBeGreaterThan(0);
  });

  test("calculates salaries for monthly period", () => {
    const result = calculateSalaries(5000, "monthly", 1);

    expect(result.monthly).toBe(5000);
    expect(result.yearly).toBe(60000);
  });

  test("calculates salaries for daily period", () => {
    const result = calculateSalaries(200, "daily", 1);

    expect(result.daily).toBe(200);
    expect(result.monthly).toBeGreaterThan(0);
    expect(result.yearly).toBeGreaterThan(0);
  });

  test("calculates salaries for yearly period", () => {
    const result = calculateSalaries(60000, "yearly", 1);

    expect(result.yearly).toBe(60000);
    expect(result.monthly).toBe(5000);
    expect(result.daily).toBeGreaterThan(0);
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

  test("converts from hourly to daily correctly", () => {
    const result = convertSalaryPeriod(100, "hourly", "daily");
    // 100 * 8 = 800
    expect(result).toBe(800);
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
