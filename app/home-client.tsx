"use client";

import "../styles/globals.css";

import ExchangeRatesList from "../components/ExchangeRatesList";
import SalaryInput from "../components/SalaryInput";
import SalaryOutput from "../components/SalaryOutput";
import { useEffect } from "react";
import { setGoldPrice, setRates, TGoldPrice, TRates } from "@/stores/store";

interface HomeClientProps {
  rates: TRates;
  goldPrice: TGoldPrice;
}

export default function HomeClient({ rates, goldPrice }: HomeClientProps) {
  useEffect(() => {
    setRates(rates);
    setGoldPrice(goldPrice);
  }, [rates, goldPrice]);

  return (
    <>
      <SalaryInput />
      <SalaryOutput />
      <ExchangeRatesList />
    </>
  );
}
