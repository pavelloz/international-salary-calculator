import useRatesStore from "../stores/useRatesStore";
import {
  calculateSalaries,
  formatSalary,
} from "../lib/calculateSalaries";
import {
  deductDaysOff,
  convertToAllPeriods,
} from "../lib/calculateDaysOff";

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
  const daysOff = useRatesStore((state) => state.daysOff);

  if (!rates) return null;

  const salaries = calculateSalaries(salary, period, rates[currency]);

  // Apply days off deduction to the annual salary
  const grossReducedAnnual = deductDaysOff(salaries.yearly, daysOff);

  // Convert reduced annual back to all periods
  const reducedSalaries = convertToAllPeriods(grossReducedAnnual);

  const flatTax12 = calculateFlatTax12(reducedSalaries.monthly);
  const linearTax19 = calculateLineartax19(reducedSalaries.monthly);

  return (
    <div className="border-t border-gray-500 mt-4 pt-4">
      <h3 className="w-full">Salary in PLN</h3>

      <table className="w-full table-auto">
        <thead>
          <tr className="text-left">
            <th></th>
            <th>Hourly</th>
            <th>Daily</th>
            <th>Monthly</th>
            <th>Yearly</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-gray-600">
            <td>Gross</td>
            <td>{formatSalary(reducedSalaries.hourly)}</td>
            <td>{formatSalary(reducedSalaries.daily)}</td>
            <td>{formatSalary(reducedSalaries.monthly)}</td>
            <td>{formatSalary(reducedSalaries.yearly)}</td>
          </tr>
          <tr className="border-t border-gray-400">
            <td>19% Linear tax (big ZUS)</td>
            <td>{formatSalary(linearTax19.hourly)}</td>
            <td>{formatSalary(linearTax19.daily)}</td>
            <td>{formatSalary(linearTax19.monthly)}</td>
            <td>{formatSalary(linearTax19.yearly)}</td>
          </tr>
          <tr className="">
            <td>12% Flat rate tax (big ZUS)</td>
            <td>{formatSalary(flatTax12.hourly)}</td>
            <td>{formatSalary(flatTax12.daily)}</td>
            <td>{formatSalary(flatTax12.monthly)}</td>
            <td>{formatSalary(flatTax12.yearly)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
