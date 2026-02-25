import { Show } from "solid-js";
import { useHydratedStore } from "../lib/useHydratedStore";
import { convertToAllPeriods, deductDaysOff } from "../lib/calculateDaysOff";
import { calculateSalaries, formatInGold, formatSalary } from "../lib/calculateSalaries";
import { calculateFlatTax12, calculateLineartax19 } from "../lib/calculateTaxes";
import { $userInputStore, defaultUserInput } from "../stores/userInput";
import { $ratesStore, defaultRates } from "../stores/rates";
import GoldDisplay from "./GoldDisplay";
export default function SalaryOutput() {
  const userInput = useHydratedStore($userInputStore, defaultUserInput);
  const ratesStore = useHydratedStore($ratesStore, defaultRates);

  // TODO: Implement: Add contract type selector
  // TODO: Add est. gross, net

  const salaries = () =>
    calculateSalaries(userInput().salary, userInput().period, ratesStore().rates[userInput().currency]);

  // Apply days off deduction to the annual salary
  const grossReducedAnnual = () => deductDaysOff(salaries().yearly, userInput().daysOff);

  // Convert reduced annual back to all periods
  const reducedSalaries = () => convertToAllPeriods(grossReducedAnnual());

  const flatTax12 = () => calculateFlatTax12(reducedSalaries().monthly);
  const linearTax19 = () => calculateLineartax19(reducedSalaries().monthly);

  return (
    <div class="border-t border-gray-500 mt-4 pt-4">
      <h3 class="w-full">Salary in PLN</h3>

      <table class="w-full table-auto">
        <thead>
          <tr class="text-left">
            <th></th>
            <th>Hourly</th>
            <th>Daily</th>
            <th>Monthly</th>
            <th>Yearly</th>
          </tr>
        </thead>
        <tbody>
          <tr class="align-top text-gray-600">
            <td>Gross</td>
            <td>
              <div>{formatSalary(reducedSalaries().hourly)}</div>
            </td>
            <td>
              <div>{formatSalary(reducedSalaries().daily)}</div>
            </td>
            <td>
              <div>{formatSalary(reducedSalaries().monthly)}</div>
              <GoldDisplay valueInPln={reducedSalaries().monthly} />
            </td>
            <td>
              <div>{formatSalary(reducedSalaries().yearly)}</div>
              <GoldDisplay valueInPln={reducedSalaries().yearly} />
            </td>
          </tr>
          <Show when={userInput().daysOff > 0}>
            <tr class="align-top text-gray-500">
              <td>Days off cost</td>
              <td></td>
              <td></td>
              <td>
                <div>-{formatSalary(salaries().monthly - reducedSalaries().monthly)}</div>
              </td>
              <td>
                <div>-{formatSalary(salaries().yearly - reducedSalaries().yearly)}</div>
              </td>
            </tr>
          </Show>
          <tr class="align-top border-t border-gray-400">
            <td>19% Linear tax (big ZUS)</td>
            <td>
              <div>{formatSalary(linearTax19().hourly)}</div>
            </td>
            <td>
              <div>{formatSalary(linearTax19().daily)}</div>
            </td>
            <td>
              <div>{formatSalary(linearTax19().monthly)}</div>
              <GoldDisplay valueInPln={linearTax19().monthly} />
            </td>
            <td>
              <div>{formatSalary(linearTax19().yearly)}</div>
              <GoldDisplay valueInPln={linearTax19().yearly} />
            </td>
          </tr>
          <tr class="align-top">
            <td>12% Flat rate tax (big ZUS)</td>
            <td>
              <div>{formatSalary(flatTax12().hourly)}</div>
            </td>
            <td>
              <div>{formatSalary(flatTax12().daily)}</div>
            </td>
            <td>
              <div>{formatSalary(flatTax12().monthly)}</div>
              <GoldDisplay valueInPln={flatTax12().monthly} />
            </td>
            <td>
              <div>{formatSalary(flatTax12().yearly)}</div>
              <GoldDisplay valueInPln={flatTax12().yearly} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
