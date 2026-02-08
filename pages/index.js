import { useEffect, lazy, Suspense } from "react";
import Head from "next/head";
import { getExchangeRates } from "../lib/utils";

import useRatesStore from "../stores/useRatesStore";

import SalaryInput from "../components/SalaryInput";
import OutputSalary from "../components/OutputSalary";

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
      <OutputSalary />
      <Suspense fallback="Loading exchange rates...">
        <ExchangeRatesList />
      </Suspense>
    </div>
  );
};
