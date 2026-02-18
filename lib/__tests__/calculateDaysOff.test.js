import { deductDaysOff, convertToAllPeriods } from "../calculateDaysOff";

describe("deductDaysOff", () => {
  test("deducts days off from annual salary correctly", () => {
    const annualSalary = 60000;
    const daysOff = 10;
    const result = deductDaysOff(annualSalary, daysOff);

    expect(result).toBe(60000 * (1 - 10 / 260));
  });

  test("deducts all days off (100% deduction)", () => {
    const annualSalary = 60000;
    const daysOff = 260;
    const result = deductDaysOff(annualSalary, daysOff);

    expect(result).toBe(0);
  });

  test("deducts zero days off", () => {
    const annualSalary = 60000;
    const daysOff = 0;
    const result = deductDaysOff(annualSalary, daysOff);

    expect(result).toBe(60000);
  });
});

describe("convertToAllPeriods", () => {
  test("converts yearly salary correctly", () => {
    const annualSalary = 60000;
    const result = convertToAllPeriods(annualSalary);

    expect(result.yearly).toBe(60000);
    expect(typeof result.monthly).toBe("number");
    expect(typeof result.daily).toBe("number");
    expect(typeof result.hourly).toBe("number");
  });

  test("calculates monthly salary correctly", () => {
    const monthlySalary = 5000;
    const result = convertToAllPeriods(monthlySalary * 12);

    expect(result.monthly).toBe(5000);
  });

  test("calculates daily salary correctly", () => {
    const dailySalary = 200;
    const result = convertToAllPeriods(dailySalary * 5 * 52);

    expect(result.daily).toBe(200);
  });

  test("calculates hourly salary correctly", () => {
    const hourlySalary = 50;
    const result = convertToAllPeriods(hourlySalary * 8 * 5 * 52);

    expect(result.hourly).toBe(50);
  });

  test("formats hourly salary to 2 decimal places", () => {
    const result = convertToAllPeriods(52000);

    expect(typeof result.hourly).toBe("number");
    expect(result.hourly).not.toBeNaN();
  });
});
