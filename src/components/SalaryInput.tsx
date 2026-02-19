import { useStore } from "@nanostores/react";

import { CURRENCIES, CURRENCY_FLAGS, PERIODS } from "../lib/constants";
import { $userInputStore, setCurrency, setDaysOff, setPeriod, setSalary } from "../stores/store";

export default function SalaryInput() {
  const { salary, currency, period, daysOff } = useStore($userInputStore);

  return (
    <div className="flex justify-between flex-wrap pb-8 gap-x-6">
      <h3 className="w-full text-gray-700 mt-0">Salary in foreign currency</h3>

      <select className="flex-1" id="period" onChange={({ target }) => setPeriod(target.value)} value={period}>
        {PERIODS.map(p => (
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
      <select className="flex-0" id="currency" value={currency} onChange={({ target }) => setCurrency(target.value)}>
        {CURRENCIES.map(c => (
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
}
