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

  // Update Zustand store with fetched rates
  useEffect(() => {
    if (rates) setRates(rates);
  }, [rates, setRates]);

  // Update Zustand store with fetched gold price
  useEffect(() => {
    if (goldPrice) setGoldPrice(goldPrice);
  }, [goldPrice, setGoldPrice]);

  return (
    <>
      {/* <h4>Gold price: {goldPrice}</h4> */}

      <SalaryInput />
      <SalaryOutput />
      <ExchangeRatesList />
    </>
  );
}
