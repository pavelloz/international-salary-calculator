import { create } from "zustand";

const useRatesStore = create()((set) => ({
  rates: {},
  fetchedAt: +new Date(),
  salary: 10000,
  currency: "usd",
  period: "monthly",
  setRates: (rates) => set({ rates }),
  setFetchedAt: (fetchedAt) => set({ fetchedAt }),
  setSalary: (salary) => set({ salary }),
  setCurrency: (currency) => set({ currency }),
  setPeriod: (period) => set({ period }),
}));

export default useRatesStore;
