import { persistentMap } from "@nanostores/persistent";
import * as v from "valibot";

import numeric from "./validations/numeric";
import userInputSchema from "./schemas/userInput";

export type IUserInput = v.InferOutput<typeof userInputSchema>;

export const defaultUserInput: IUserInput = {
  salary: 30000,
  salaryMax: undefined,
  currency: "pln",
  period: "monthly",
  daysOff: 0,
  paidDaysOff: 0,
  yearlyBonus: 0,
  showGold: false,
  contractType: "all",
};

export const $userInputStore = persistentMap<IUserInput>(
  "user-input:",
  defaultUserInput,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const setSalary = (salary: number | string) => $userInputStore.setKey("salary", v.parse(numeric, salary));
export const setSalaryMax = (salaryMax: number | string | undefined) =>
  $userInputStore.setKey("salaryMax", salaryMax === undefined ? undefined : v.parse(numeric, salaryMax));
export const setCurrency = (currency: string) => $userInputStore.setKey("currency", currency);
export const setPeriod = (period: string) => $userInputStore.setKey("period", period);
export const setDaysOff = (daysOff: number | string) => $userInputStore.setKey("daysOff", v.parse(numeric, daysOff));
export const setPaidDaysOff = (paidDaysOff: number | string) => $userInputStore.setKey("paidDaysOff", v.parse(numeric, paidDaysOff));
export const setYearlyBonus = (yearlyBonus: number | string) => $userInputStore.setKey("yearlyBonus", v.parse(numeric, yearlyBonus));
export const setShowGold = (showGold: boolean) => $userInputStore.setKey("showGold", showGold);
export const setContractType = (contractType: string) => $userInputStore.setKey("contractType", contractType);
