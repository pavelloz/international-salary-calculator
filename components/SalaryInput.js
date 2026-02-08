import useRatesStore from "../stores/useRatesStore";

const PERIODS = ["hourly", "daily", "monthly", "yearly"];
const CURRENCIES = ["usd", "eur", "gbp", "chf"];

export default () => {
  const { salary, setSalary, setCurrency, period, setPeriod } = useRatesStore();

  return (
    <div className="flex justify-between flex-wrap pb-8">
      <h3 className="w-full">Salary in foreign currency</h3>
      <select
        className="space-x-4"
        id="period"
        onChange={({ target }) => setPeriod(target.value)}
        value={period}
      >
        {PERIODS.map((p) => (
          <option key={p} value={p}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>
      <input
        className="space-x-4"
        id="salary"
        name="salary"
        defaultValue={salary || 0}
        onChange={({ target }) =>
          target.value === ""
            ? setSalary(0)
            : setSalary(parseInt(target.value, 10))
        }
        pattern="/\d*/"
      />
      <select
        className="space-x-4"
        id="currency"
        onChange={({ target }) => setCurrency(target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};
