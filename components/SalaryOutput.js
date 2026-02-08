import useRatesStore from "../stores/useRatesStore";
import { calculateSalaries, formatSalary } from "../lib/calculateSalaries";

const formatCurrency = (value) => {
  if (isNaN(value)) return null;
  return value.toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumSignificantDigits: 3,
  });
};

export default () => {
  // TODO: Add contract type selector
  // TODO: Add est. gross, net

  const { rates, salary, currency, period } = useRatesStore();

  if (!rates) return null;

  const salaries = calculateSalaries(salary, period, rates[currency]);

  return (
    <div className="border-t border-gray-600">
      <h3 className="w-full">Salary in PLN</h3>

      <ul className="flex justify-between flex-wrap list-none pl-0!">
        <li>{formatSalary(salaries.hourly)} / hour</li>
        <li>{formatSalary(salaries.daily)} / day</li>
        <li>{formatSalary(salaries.monthly)} / month</li>
        <li>{formatSalary(salaries.yearly)} / year</li>
      </ul>
    </div>
  );
};
