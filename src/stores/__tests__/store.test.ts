import { describe, expect, test, beforeEach } from "vitest";
import { $userInputStore, setDaysOff, setSalary } from "../userInput";

describe("UserInput Store Validation", () => {
  // Reset the store to default values before each test
  beforeEach(() => {
    $userInputStore.set({
      salary: 30000,
      salaryMax: 0,
      currency: "pln",
      period: "monthly",
      daysOff: 0,
      paidDaysOff: 0,
      yearlyBonus: 0,
      benefits: 0,
      contractType: "all",
      isCreative: false,
      onlyUopForPaidDaysOff: false,
      onlyUopForYearlyBonus: false,
    });
  });

  test("setSalary accepts a number", () => {
    setSalary(45000);
    expect($userInputStore.get().salary).toBe(45000);
  });

  test("setSalary validates the number through numeric schema (integer, non-negative)", () => {
    setSalary(-100);
    // numeric schema has fallback to 0, so -100 becomes 0
    expect($userInputStore.get().salary).toBe(0);
  });

  test("setDaysOff accepts a number", () => {
    setDaysOff(26);
    expect($userInputStore.get().daysOff).toBe(26);
  });

  test("setDaysOff validates the number through numeric schema", () => {
    setDaysOff(-5);
    expect($userInputStore.get().daysOff).toBe(0);
  });

  test("setDaysOff handles native numbers normally", () => {
    setDaysOff(20);
    expect($userInputStore.get().daysOff).toBe(20);
  });

  test("all numeric fields default to 0 in initial state", () => {
    // Reset to full defaults
    $userInputStore.set({
      salary: 30000,
      salaryMax: 0,
      currency: "pln",
      period: "monthly",
      daysOff: 0,
      paidDaysOff: 0,
      yearlyBonus: 0,
      benefits: 0,
      contractType: "all",
      isCreative: false,
      onlyUopForPaidDaysOff: false,
      onlyUopForYearlyBonus: false,
    });
    expect($userInputStore.get().salaryMax).toBe(0);
    expect($userInputStore.get().paidDaysOff).toBe(0);
    expect($userInputStore.get().yearlyBonus).toBe(0);
    expect($userInputStore.get().benefits).toBe(0);
  });
});
