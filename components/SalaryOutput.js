import useRatesStore from "../stores/useRatesStore";
import { calculateSalaries, formatSalary } from "../lib/calculateSalaries";

export default () => {
  // TODO: Add contract type selector
  // TODO: Add est. gross, net

  const rates = useRatesStore((state) => state.rates);
  const salary = useRatesStore((state) => state.salary);
  const currency = useRatesStore((state) => state.currency);
  const period = useRatesStore((state) => state.period);

  if (!rates) return null;

  const salaries = calculateSalaries(salary, period, rates[currency]);

  return (
    <>
      <h3 className="w-full">Salary in PLN</h3>

      <ul className="md:flex justify-between flex-wrap list-none pl-0!">
        <li className="pl-0">{formatSalary(salaries.hourly)} / hour</li>
        <li className="pl-0">{formatSalary(salaries.daily)} / day</li>
        <li className="pl-0">{formatSalary(salaries.monthly)} / month</li>
        <li className="pl-0">{formatSalary(salaries.yearly)} / year</li>
      </ul>
    </>
  );
};
