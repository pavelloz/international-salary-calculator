import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { getExchangeRates } from "../lib/utils";

import ExchangeRatesList from "../components/ExchangeRatesList";
import SalaryInput from "../components/SalaryInput";
import OutputSalary from "../components/OutputSalary";

export default function Home() {
  const [rates, setRates] = useState([]);
  const [salary, setSalary] = useState(10000);
  const [currency, setCurrency] = useState("usd");
  const [period, setPeriod] = useState("h");

  const monthlySalary = useMemo(() => {
    return parseInt(salary * rates[currency], 10);
  }, [salary, rates, currency]);

  const yearlySalary = useMemo(() => {
    return parseInt(monthlySalary * 12, 10);
  }, [monthlySalary]);

  const hourlySalary = useMemo(() => {
    return parseInt(monthlySalary / 160, 10);
  }, [monthlySalary]);

  useEffect(() => {
    getExchangeRates().then(setRates);
  }, []);

  return (
    <div className="w-10/12 mx-auto my-8">
      <Head>
        <title>International Salary Calculator for Polish folks</title>
      </Head>

      <SalaryInput
        salary={salary}
        setSalary={setSalary}
        setCurrency={setCurrency}
        setPeriod={setPeriod}
      />

      <OutputSalary
        hourlySalary={hourlySalary}
        monthlySalary={monthlySalary}
        yearlySalary={yearlySalary}
      />

      <ExchangeRatesList rates={rates} />
    </div>
  );
}
