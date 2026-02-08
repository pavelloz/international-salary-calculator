import useRatesStore from "../stores/useRatesStore";

const PERIODS = ["hourly", "daily", "monthly", "yearly"];
const CURRENCIES = ["usd", "eur", "gbp", "chf"];

const CURRENCY_FLAGS = {
  usd: "🇺🇸", // United States
  eur: "🇪🇺", // European Union
  gbp: "🇬🇧", // United Kingdom
  chf: "🇨🇭", // Switzerland
};

export default () => {
  const salary = useRatesStore((state) => state.salary);
  const setSalary = useRatesStore((state) => state.setSalary);
  const setCurrency = useRatesStore((state) => state.setCurrency);
  const period = useRatesStore((state) => state.period);
  const setPeriod = useRatesStore((state) => state.setPeriod);

  return (
    <div className="flex justify-between flex-wrap pb-8 gap-x-6">
      <h3 className="w-full text-gray-700 mt-0">Salary in foreign currency</h3>

      <select
        className="flex-1"
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
        className="flex-1"
        id="salary"
        name="salary"
        value={salary}
        onChange={({ target }) => {
          const val = target.value;
          if (val === "") {
            setSalary(0);
          } else {
            const parsed = parseInt(val, 10);
            if (!isNaN(parsed)) setSalary(parsed);
          }
        }}
        pattern="\d*"
      />
      <select
        className="flex-0"
        id="currency"
        onChange={({ target }) => setCurrency(target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {CURRENCY_FLAGS[c]} {c.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};
