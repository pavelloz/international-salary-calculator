import { create } from "zustand";

const useRatesStore = create()((set) => ({
  rates: {},
  fetchedAt: "",
  salary: 10000,
  currency: "usd",
  period: "monthly",
  setRates: (rates) => set({ rates }),
  setFetchedAt: (fetchedAt) => set({ fetchedAt }),
  setSalary: (salary) => set({ salary }),
  setCurrency: (currency) => set({ currency }),
  setPeriod: (period) => set({ period }),
}));

const useRatesStoreSelectors = () => {
  const rates = useRatesStore((s) => s.rates);
  const fetchedAt = useRatesStore((s) => s.fetchedAt);
  const salary = useRatesStore((s) => s.salary);
  const currency = useRatesStore((s) => s.currency);
  const period = useRatesStore((s) => s.period);
  const setRates = useRatesStore((s) => s.setRates);
  const setFetchedAt = useRatesStore((s) => s.setFetchedAt);
  const setSalary = useRatesStore((s) => s.setSalary);
  const setCurrency = useRatesStore((s) => s.setCurrency);
  const setPeriod = useRatesStore((s) => s.setPeriod);

  return {
    rates,
    fetchedAt,
    salary,
    currency,
    period,
    setRates,
    setFetchedAt,
    setSalary,
    setCurrency,
    setPeriod,
  };
};

export default useRatesStoreSelectors;
