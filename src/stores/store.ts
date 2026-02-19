import { persistentMap } from "@nanostores/persistent";

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

export const setSalary = (salary: number) => $userInputStore.setKey("salary", salary);
export const setCurrency = (currency: string) => $userInputStore.setKey("currency", currency);
export const setPeriod = (period: string) => $userInputStore.setKey("period", period);
export const setDaysOff = (daysOff: number) => $userInputStore.setKey("daysOff", daysOff);
