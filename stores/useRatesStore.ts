import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TRates = Record<string, number>;
export type TGoldPrice = number;

interface RatesStore {
  rates: TRates;
  salary: number;
  currency: string;
  period: string;
  daysOff: number;
  goldPrice: TGoldPrice;
  setRates: (rates: TRates) => void;
  setSalary: (salary: number) => void;
  setCurrency: (currency: string) => void;
  setPeriod: (period: string) => void;
  setDaysOff: (daysOff: number) => void;
  setGoldPrice: (goldPrice: TGoldPrice) => void;
}

const useRatesStore = create<RatesStore>()(
  persist(
    (set) => ({
      rates: {},
      salary: 10000,
      currency: "usd",
      period: "monthly",
      daysOff: 0,
      goldPrice: 0,
      setRates: (rates) => set({ rates }),
      setSalary: (salary) => set({ salary }),
      setCurrency: (currency) => set({ currency }),
      setPeriod: (period) => set({ period }),
      setDaysOff: (daysOff) => set({ daysOff }),
      setGoldPrice: (goldPrice) => set({ goldPrice }),
    }),
    {
      name: "user-input",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useRatesStore;
