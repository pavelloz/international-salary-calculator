import { useEffect, lazy, Suspense } from "react";
import Head from "next/head";
import { getExchangeRates } from "../lib/getExchangeRates";

import useRatesStore from "../stores/useRatesStore";

import SalaryInput from "../components/SalaryInput";

const SalaryOutput = lazy(() => import("../components/SalaryOutput"));
const ExchangeRatesList = lazy(() => import("../components/ExchangeRatesList"));

export default () => {
  const { setRates, setFetchedAt } = useRatesStore();

  const fetchRates = async () => {
    const { rates, fetched_at } = await getExchangeRates();

    setRates(rates);
    setFetchedAt(fetched_at);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div className="w-full mx-auto m-8 prose lg:prose-xl">
      <Head>
        <title>International Salary Calculator for Polish folks</title>
      </Head>

      {/* Add header */}

      <SalaryInput />
      <SalaryOutput />
      <Suspense fallback="Loading exchange rates...">
        <ExchangeRatesList />
      </Suspense>
    </div>
  );
};
