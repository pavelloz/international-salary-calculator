import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useRatesStore = create()(
  persist(
    (set) => ({
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
    }),
    {
      name: "user-input",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useRatesStore;
