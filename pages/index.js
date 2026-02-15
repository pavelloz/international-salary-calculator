"use client";

import { useEffect } from "react";

import Layout from "./layout";

import { fetchRates } from "@/lib/fx-rates";

import useRatesStore from "../stores/useRatesStore";

import SalaryInput from "../components/SalaryInput";
import SalaryOutput from "../components/SalaryOutput";
import ExchangeRatesList from "../components/ExchangeRatesList";

export async function getServerSideProps() {
  const rates = await fetchRates(); // Runs on SERVER

  return {
    props: { rates }, // Only the data is sent to client
  };
}

export default function HomePage({ rates }) {
  const setRates = useRatesStore((state) => state.setRates);

  // Update Zustand store with fetched rates and timestamp
  useEffect(() => {
    if (rates) {
      setRates(rates);
    }
  }, [rates, setRates]);

  return (
    <>
      <SalaryInput />

      <hr className="border-t border-gray-500" />

      <SalaryOutput />

      <hr className="border-t border-gray-500" />

      <ExchangeRatesList />
    </>
  );
}

HomePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
