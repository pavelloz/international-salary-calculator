import useRatesStore from "../stores/useRatesStore";
import {
  calculateSalaries,
  formatSalary,
  formatInGold,
} from "../lib/calculateSalaries";
import { deductDaysOff, convertToAllPeriods } from "../lib/calculateDaysOff";

import {
  calculateFlatTax12,
  calculateLineartax19,
} from "../lib/calculateTaxes";

export default function SalaryOutput() {
  // TODO: Implement: Add contract type selector
  // TODO: Add est. gross, net

  const rates = useRatesStore((state) => state.rates);
  const salary = useRatesStore((state) => state.salary);
  const currency = useRatesStore((state) => state.currency);
  const period = useRatesStore((state) => state.period);
  const daysOff = useRatesStore((state) => state.daysOff);
  const goldPrice = useRatesStore((state) => state.goldPrice);

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
          <tr className="align-top text-gray-600">
            <td>Gross</td>
            <td>
              <div>{formatSalary(reducedSalaries.hourly)}</div>
            </td>
            <td>
              <div>{formatSalary(reducedSalaries.daily)}</div>
            </td>
            <td>
              <div>{formatSalary(reducedSalaries.monthly)}</div>
              <div className="text-gray-400 text-sm">
                {formatInGold(reducedSalaries.monthly / goldPrice)} oz of gold
              </div>
            </td>
            <td>
              <div>{formatSalary(reducedSalaries.yearly)}</div>
              <div className="text-gray-400 text-sm">
                {formatInGold(reducedSalaries.yearly / goldPrice)} oz of gold
              </div>
            </td>
          </tr>
          <tr className="align-top border-t border-gray-400">
            <td>19% Linear tax (big ZUS)</td>
            <td>
              <div>{formatSalary(linearTax19.hourly)}</div>
            </td>
            <td>
              <div>{formatSalary(linearTax19.daily)}</div>
            </td>
            <td>
              <div>{formatSalary(linearTax19.monthly)}</div>
              <div className="text-gray-400 text-sm">
                {formatInGold(linearTax19.monthly / goldPrice)} oz of gold
              </div>
            </td>
            <td>
              <div>{formatSalary(linearTax19.yearly)}</div>
              <div className="text-gray-400 text-sm">
                {formatInGold(linearTax19.yearly / goldPrice)} oz of gold
              </div>
            </td>
          </tr>
          <tr className="align-top">
            <td>12% Flat rate tax (big ZUS)</td>
            <td>
              <div>{formatSalary(flatTax12.hourly)}</div>
            </td>
            <td>
              <div>{formatSalary(flatTax12.daily)}</div>
            </td>
            <td>
              <div>{formatSalary(flatTax12.monthly)}</div>
              <div className="text-gray-400 text-sm">
                {formatInGold(flatTax12.monthly / goldPrice)} oz of gold
              </div>
            </td>
            <td>
              <div>{formatSalary(flatTax12.yearly)}</div>
              <div className="text-gray-400 text-sm">
                {formatInGold(flatTax12.yearly / goldPrice)} oz of gold
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
