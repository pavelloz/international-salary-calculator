import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useRatesStore = create()(
  persist(
    (set) => ({
      rates: {},
      salary: 10000,
      currency: "usd",
      period: "monthly",
      daysOff: 0,
      setRates: (rates) => set({ rates }),
      setSalary: (salary) => set({ salary }),
      setCurrency: (currency) => set({ currency }),
      setPeriod: (period) => set({ period }),
      setDaysOff: (daysOff) => set({ daysOff }),
    }),
    {
      name: "user-input",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useRatesStore;
