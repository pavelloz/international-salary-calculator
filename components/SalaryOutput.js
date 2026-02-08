import useRatesStore from "../stores/useRatesStore";
import { calculateSalaries, formatSalary } from "../lib/calculateSalaries";

import {
  calculateFlatTax12,
  calculateLineartax19,
} from "../lib/calculateTaxes";

export default () => {
  // TODO: Add contract type selector
  // TODO: Add est. gross, net

  const rates = useRatesStore((state) => state.rates);
  const salary = useRatesStore((state) => state.salary);
  const currency = useRatesStore((state) => state.currency);
  const period = useRatesStore((state) => state.period);

  if (!rates) return null;

  const salaries = calculateSalaries(salary, period, rates[currency]);
  const flatTax12 = calculateFlatTax12(salaries.monthly);
  const linearTax19 = calculateLineartax19(salaries.monthly);

  return (
    <>
      <h3 className="w-full">Salary in PLN</h3>

      <h4>Gross</h4>
      <ul className="md:flex justify-between flex-wrap list-none pl-0!">
        <li className="pl-0">{formatSalary(salaries.hourly)} / hour</li>
        <li className="pl-0">{formatSalary(salaries.daily)} / day</li>
        <li className="pl-0">{formatSalary(salaries.monthly)} / month</li>
        <li className="pl-0">{formatSalary(salaries.yearly)} / year</li>
      </ul>

      <h4>B2B LumpSum tax (12% PIT, big ZUS)</h4>
      <ul className="md:flex justify-between flex-wrap list-none pl-0!">
        <li className="pl-0">{formatSalary(flatTax12.hourly)} / hour</li>
        <li className="pl-0">{formatSalary(flatTax12.daily)} / day</li>
        <li className="pl-0">{formatSalary(flatTax12.monthly)} / month</li>
        <li className="pl-0">{formatSalary(flatTax12.yearly)} / year</li>
      </ul>

      <h4>B2B Linear tax (19% PIT, big ZUS)</h4>
      <ul className="md:flex justify-between flex-wrap list-none pl-0!">
        <li className="pl-0">{formatSalary(linearTax19.hourly)} / hour</li>
        <li className="pl-0">{formatSalary(linearTax19.daily)} / day</li>
        <li className="pl-0">{formatSalary(linearTax19.monthly)} / month</li>
        <li className="pl-0">{formatSalary(linearTax19.yearly)} / year</li>
      </ul>
    </>
  );
};
