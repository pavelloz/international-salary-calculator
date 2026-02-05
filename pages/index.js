import { useState, useEffect } from "react";
import Head from "next/head";
import { getExchangeRates } from "../lib/utils";

import ExchangeRatesList from "../components/ExchangeRatesList";
import SalaryInput from "../components/SalaryInput";
import OutputSalary from "../components/OutputSalary";

export default function Home() {
  const [rates, setRates] = useState({});
  const [fetchedAt, setFetchedAt] = useState("");
  const [salary, setSalary] = useState(10000);
  const [currency, setCurrency] = useState("usd");
  const [period, setPeriod] = useState("m");

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

      <SalaryInput
        salary={salary}
        setSalary={setSalary}
        setCurrency={setCurrency}
        period={period}
        setPeriod={setPeriod}
      />

      <OutputSalary salary={salary} rates={rates} currency={currency} />

      <ExchangeRatesList rates={rates} fetchedAt={fetchedAt} />
    </div>
  );
}
