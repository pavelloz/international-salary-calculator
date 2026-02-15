import useRatesStore from "../stores/useRatesStore";
import {
  PERIODS,
  CURRENCIES,
  CURRENCY_FLAGS,
  MAX_DAYS_OFF,
} from "../lib/constants";

export default () => {
  const salary = useRatesStore((state) => state.salary);
  const setSalary = useRatesStore((state) => state.setSalary);
  const setCurrency = useRatesStore((state) => state.setCurrency);
  const period = useRatesStore((state) => state.period);
  const setPeriod = useRatesStore((state) => state.setPeriod);
  const daysOff = useRatesStore((state) => state.daysOff);
  const setDaysOff = useRatesStore((state) => state.setDaysOff);

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

      <h4 className="w-full text-gray-700 mt-4">Days off per year</h4>
      <input
        className="w-16"
        id="daysOff"
        name="daysOff"
        value={daysOff}
        onChange={({ target }) => {
          const val = target.value;
          if (val === "") return setDaysOff(0);
          setDaysOff(parseInt(val, 10));
        }}
      />
    </div>
  );
};
