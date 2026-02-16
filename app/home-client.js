"use client";

import "../styles/globals.css";
import { useEffect } from "react";

import useRatesStore from "../stores/useRatesStore";

import SalaryInput from "../components/SalaryInput";
import SalaryOutput from "../components/SalaryOutput";
import ExchangeRatesList from "../components/ExchangeRatesList";

export default function HomePage({ rates, goldPrice }) {
  const setRates = useRatesStore((state) => state.setRates);
  const setGoldPrice = useRatesStore((state) => state.setGoldPrice);

  useEffect(() => {
    rates && setRates(rates);
  }, [rates]);

  useEffect(() => {
    goldPrice && setGoldPrice(goldPrice);
  }, [goldPrice]);

  return (
    <>
      <SalaryInput />
      <SalaryOutput />
      <ExchangeRatesList />
    </>
  );
}
