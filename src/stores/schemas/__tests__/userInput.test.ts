import { describe, it, expect } from "vitest";
import * as v from "valibot";
import userInputSchema from "../userInput";

describe("userInputSchema Valibot schema", () => {
  it("should successfully parse a valid object with all fields", () => {
    const validData = {
      salary: 30000,
      salaryMax: 50000,
      currency: "pln",
      period: "monthly",
      daysOff: 26,
      paidDaysOff: 10,
      yearlyBonus: 5,
      benefits: 2000,
      contractType: "uop",
      isCreative: true,
      onlyUopForPaidDaysOff: true,
      onlyUopForYearlyBonus: false,
    };
    const result = v.parse(userInputSchema, validData);
    expect(result).toEqual(validData);
  });

  it("should fill in fallback defaults for missing fields", () => {
    const result = v.parse(userInputSchema, {
      salary: 30000,
      currency: "pln",
      period: "monthly",
      daysOff: 26,
    });
    expect(result).toEqual({
      salary: 30000,
      salaryMax: 0,
      currency: "pln",
      period: "monthly",
      daysOff: 26,
      paidDaysOff: 0,
      yearlyBonus: 0,
      benefits: 0,
      contractType: "all",
      isCreative: false,
      onlyUopForPaidDaysOff: false,
      onlyUopForYearlyBonus: false,
    });
  });

  it("should fail if required fields are missing", () => {
    const invalidData = {
      salary: 30000,
      currency: "pln",
      // missing period and daysOff
    };

    expect(() => v.parse(userInputSchema, invalidData)).toThrow(v.ValiError);
  });

  it("should fail if types are incorrect", () => {
    const invalidData = {
      salary: "30000", // should be a number, but userInputSchema is strict (no fallback inside it)
      currency: 123, // should be a string
      period: "monthly",
      daysOff: 26,
    };

    expect(() => v.parse(userInputSchema, invalidData)).toThrow(v.ValiError);
  });
});
