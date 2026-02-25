import { persistentMap } from "@nanostores/persistent";
import { z } from "zod";

export interface IUserInput {
  salary: number;
  currency: string;
  period: string;
  daysOff: number;
}

export const $userInputStore = persistentMap<IUserInput>(
  "user-input:",
  {
    salary: 30000,
    currency: "pln",
    period: "monthly",
    daysOff: 0,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

const numericSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return val;
}, z.number().catch(0));

export const setSalary = (salary: number | string) => $userInputStore.setKey("salary", numericSchema.parse(salary));
export const setCurrency = (currency: string) => $userInputStore.setKey("currency", currency);
export const setPeriod = (period: string) => $userInputStore.setKey("period", period);
export const setDaysOff = (daysOff: number | string) => $userInputStore.setKey("daysOff", numericSchema.parse(daysOff));
