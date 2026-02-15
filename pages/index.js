"use client";

import { useEffect } from "react";

import dynamic from "next/dynamic";
import Layout from "./layout";

import { fetchRates } from "@/lib/fx-rates";

import useRatesStore from "../stores/useRatesStore";

import SalaryInput from "../components/SalaryInput";

const SalaryOutput = dynamic(() => import("../components/SalaryOutput"), {
  ssr: false,
});
const ExchangeRatesList = dynamic(
  () => import("../components/ExchangeRatesList"),
  { ssr: false },
);

export async function getServerSideProps() {
  const rates = await fetchRates(); // Runs on SERVER

  return {
    props: { rates }, // Only the data is sent to client
  };
}

export default function HomePage({ rates }) {
  const setRates = useRatesStore((state) => state.setRates);
  const setFetchedAt = useRatesStore((state) => state.setFetchedAt);

  // Update Zustand store with fetched rates and timestamp
  useEffect(() => {
    if (rates) {
      setRates(rates);
      setFetchedAt(new Date().toISOString());
    }
  }, [rates, setRates, setFetchedAt]);

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
