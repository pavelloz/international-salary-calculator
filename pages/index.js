import { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";
import { getExchangeRates } from "./utils";

export default function Home() {
  const [rates, setRates] = useState([]);
  const [salary, setSalary] = useState(5000);
  const [currency, setCurrency] = useState("usd");

  const monthlySalary = useMemo(() => {
    return parseInt(salary * rates[currency], 10);
  }, [salary, rates, currency]);

  const yearlySalary = useMemo(() => {
    return parseInt(monthlySalary * 12, 10);
  }, [monthlySalary]);

  useEffect(() => {
    getExchangeRates().then(setRates);
  }, []);

  return (
    <>
      <Head>
        <title>International Salary Calculator</title>
      </Head>

      <main className="container px-4 md:px-0 max-w-6xl mx-auto">
        <p>
          <label htmlFor="monthly-salary">Monthly</label>
          <input
            id="monthly-salary"
            name="monthly-salary"
            type="number"
            value={salary}
            onChange={({ target: { value } }) =>
              setSalary(() => parseInt(value, 10))
            }
            placeholder="Salary"
            pattern="/\d*/"
          />
        </p>

        <p>
          <label htmlFor="currency">
            Currency
            <select
              id="surrency"
              onChange={({ target: { value } }) => setCurrency(value)}
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
              <option value="chf">CHF</option>
            </select>
          </label>
        </p>
        <p>Monthly: {monthlySalary} PLN</p>
        <p>Yearly: {yearlySalary} PLN</p>
        {/* TODO: Add contract type selector */}
        {/* TODO: Add est. gross, net */}
      </main>
    </>
  );
}
