import { calculateSalaries } from "../calculateSalaries";

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
