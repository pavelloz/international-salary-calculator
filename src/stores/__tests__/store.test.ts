import { describe, expect, test, beforeEach } from "vitest";
import { $userInputStore, setDaysOff, setSalary } from "../store";

describe("UserInput Store Zod Validation", () => {
    // Reset the store to default values before each test
    beforeEach(() => {
        $userInputStore.set({
            salary: 30000,
            currency: "pln",
            period: "monthly",
            daysOff: 0,
        });
    });

    test("setSalary cleanly parses valid strings into numbers", () => {
        setSalary("45000");
        expect($userInputStore.get().salary).toBe(45000);
    });

    test("setSalary falls back to 0 when parsing an invalid string", () => {
        setSalary("invalid_salary");
        expect($userInputStore.get().salary).toBe(0);
    });

    test("setSalary handles native numbers normally", () => {
        setSalary(50000);
        expect($userInputStore.get().salary).toBe(50000);
    });

    test("setDaysOff cleanly parses valid strings into numbers", () => {
        setDaysOff("26");
        expect($userInputStore.get().daysOff).toBe(26);
    });

    test("setDaysOff falls back to 0 when parsing an invalid string", () => {
        setDaysOff("not_a_number");
        expect($userInputStore.get().daysOff).toBe(0);
    });

    test("setDaysOff handles native numbers normally", () => {
        setDaysOff(20);
        expect($userInputStore.get().daysOff).toBe(20);
    });
});
