import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { getExchangeRates } from "../lib/utils";

import ExchangeRatesList from "../components/ExchangeRatesList";
import SalaryInput from "../components/SalaryInput";
import OutputSalary from "../components/OutputSalary";

export default function Home() {
  const [rates, setRates] = useState({});
  const [fetchedAt, setFetchedAt] = useState('');
  const [salary, setSalary] = useState(10000);
  const [currency, setCurrency] = useState("usd");
  const [period, setPeriod] = useState("m");


  // TODO: Move into OutputSalary
  const monthlySalary = useMemo(() => {
    return parseInt(salary * rates[currency], 10);
  }, [salary, rates, currency]);

  const yearlySalary = useMemo(() => {
    return parseInt(monthlySalary * 12, 10);
  }, [monthlySalary]);

  const hourlySalary = useMemo(() => {
    return parseInt(monthlySalary / 160, 10);
  }, [monthlySalary]);

  const dailySalary = useMemo(() => {
    return parseInt(hourlySalary * 8, 10);
  }, [hourlySalary]);

  useEffect(() => {
    getExchangeRates().then((response) => {
      setRates(response.rates);
      setFetchedAt(response.fetched_at);
    });
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

      <OutputSalary
        hourlySalary={hourlySalary}
        dailySalary={dailySalary}
        monthlySalary={monthlySalary}
        yearlySalary={yearlySalary}
      />

        
      <ExchangeRatesList rates={rates} fetchedAt={fetchedAt} />
    </div>
  );
}
