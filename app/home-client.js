"use client";

import "../styles/globals.css";
import { useEffect } from "react";

import useRatesStore from "../stores/useRatesStore";

import SalaryInput from "../components/SalaryInput";
import SalaryOutput from "../components/SalaryOutput";
import ExchangeRatesList from "../components/ExchangeRatesList";

export default function HomePage({ rates }) {
  const setRates = useRatesStore((state) => state.setRates);

  // Update Zustand store with fetched rates
  useEffect(() => {
    if (rates) setRates(rates);
  }, [rates, setRates]);

  return (
    <>
      <SalaryInput />
      <SalaryOutput />
      <ExchangeRatesList />
    </>
  );
}
