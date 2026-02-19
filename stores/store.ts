import { persistentMap } from "@nanostores/persistent";

export type TRates = Record<string, number>;
export type TGoldPrice = number;

// Define the shape of your store
export interface IUserInput {
  salary: number;
  currency: string;
  period: string;
  daysOff: number;
}

export interface IApiValue {
  rates: TRates;
  goldPrice: TGoldPrice;
}

// 1. Create the persistent store
// The second argument 'user-input' is the localStorage key.
// The third argument handles JSON serialization automatically.
export const $userInputStore = persistentMap<IUserInput>(
  "user-input:",
  {
    salary: 10000,
    currency: "usd",
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

export const $apiStore = persistentMap<IApiValue>(
  "api-value:",
  {
    rates: {},
    goldPrice: 0,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const setRates = (rates: TRates) => $apiStore.setKey("rates", rates);
export const setGoldPrice = (price: TGoldPrice) => $apiStore.setKey("goldPrice", price);
