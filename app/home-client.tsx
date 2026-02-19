"use client";

import "../styles/globals.css";

import { useEffect } from "react";

import ExchangeRatesList from "../components/ExchangeRatesList";
import SalaryInput from "../components/SalaryInput";
import SalaryOutput from "../components/SalaryOutput";
import type { TGoldPrice, TRates } from "../stores/store";
import { setGoldPrice, setRates } from "../stores/store";

interface HomeClientProps {
  rates: TRates;
  goldPrice: TGoldPrice;
}

export default function HomeClient({ rates, goldPrice }: HomeClientProps) {
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
