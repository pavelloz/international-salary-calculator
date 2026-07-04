import { persistentMap } from "@nanostores/persistent";
import * as v from "valibot";

import numeric from "./validations/numeric";
import userInputSchema from "./schemas/userInput";

export type IUserInput = v.InferOutput<typeof userInputSchema>;

// All numeric fields default to 0 (or a sensible default for salary)
export const defaultUserInput: IUserInput = {
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
};

export const $userInputStore = persistentMap<IUserInput>("user-input:", defaultUserInput, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const setSalary = (salary: number) => $userInputStore.setKey("salary", v.parse(numeric, salary));
export const setSalaryMax = (salaryMax: number) => $userInputStore.setKey("salaryMax", v.parse(numeric, salaryMax));
export const setCurrency = (currency: string) => $userInputStore.setKey("currency", currency);
export const setPeriod = (period: string) => $userInputStore.setKey("period", period);
export const setDaysOff = (daysOff: number) => $userInputStore.setKey("daysOff", v.parse(numeric, daysOff));
export const setPaidDaysOff = (paidDaysOff: number) =>
  $userInputStore.setKey("paidDaysOff", v.parse(numeric, paidDaysOff));
export const setYearlyBonus = (yearlyBonus: number) =>
  $userInputStore.setKey("yearlyBonus", v.parse(numeric, yearlyBonus));
export const setBenefits = (benefits: number) => $userInputStore.setKey("benefits", v.parse(numeric, benefits));
export const setContractType = (contractType: string) => $userInputStore.setKey("contractType", contractType);
export const setIsCreative = (isCreative: boolean) => $userInputStore.setKey("isCreative", isCreative);
export const setOnlyUopForPaidDaysOff = (val: boolean) => $userInputStore.setKey("onlyUopForPaidDaysOff", val);
export const setOnlyUopForYearlyBonus = (val: boolean) => $userInputStore.setKey("onlyUopForYearlyBonus", val);
