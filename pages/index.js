import { useEffect } from "react";
import dynamic from "next/dynamic";
import Layout from "./layout";

import { getExchangeRates } from "../lib/getExchangeRates";

import useRatesStore from "../stores/useRatesStore";

import SalaryInput from "../components/SalaryInput";

const SalaryOutput = dynamic(() => import("../components/SalaryOutput"), {
  ssr: false,
});
const ExchangeRatesList = dynamic(
  () => import("../components/ExchangeRatesList"),
  { ssr: false },
);

export default function HomePage() {
  const setRates = useRatesStore((state) => state.setRates);
  const setFetchedAt = useRatesStore((state) => state.setFetchedAt);

  useEffect(() => {
    const fetchRates = async () => {
      const { rates, fetched_at } = await getExchangeRates();
      setRates(rates);
      setFetchedAt(fetched_at);
    };

    fetchRates();
  }, [setRates, setFetchedAt]);

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
