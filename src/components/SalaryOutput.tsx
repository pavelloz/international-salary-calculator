import { Show } from "solid-js";
import { useHydratedStore } from "../lib/useHydratedStore";
import { convertToAllPeriods, deductDaysOff } from "../lib/calculateDaysOff";
import { calculateSalaries, formatSalary, formatCompactSalary } from "../lib/calculateSalaries";
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

  // Max calculations
  const hasMax = () =>
    (userInput().period === "monthly" || userInput().period === "yearly") && userInput().salaryMax !== undefined;

  const salariesMax = () =>
    hasMax()
      ? calculateSalaries(userInput().salaryMax!, userInput().period, ratesStore().rates[userInput().currency])
      : null;

  const grossReducedAnnualMax = () =>
    salariesMax() ? deductDaysOff(salariesMax()!.yearly, userInput().daysOff) : null;
  const reducedSalariesMax = () =>
    grossReducedAnnualMax() !== null ? convertToAllPeriods(grossReducedAnnualMax()!) : null;

  const flatTax12Max = () => (reducedSalariesMax() ? calculateFlatTax12(reducedSalariesMax()!.monthly) : null);
  const linearTax19Max = () => (reducedSalariesMax() ? calculateLineartax19(reducedSalariesMax()!.monthly) : null);

  const renderValue = (minVal: number, maxVal: number | undefined | null, compact?: boolean) => {
    const formatter = compact ? formatCompactSalary : formatSalary;
    if (minVal === undefined) return null;
    if (maxVal !== undefined && maxVal !== null) {
      return (
        <div>
          {formatter(minVal)} - {formatter(maxVal)}
        </div>
      );
    }
    return <div>{formatter(minVal)}</div>;
  };

  const renderGold = (minVal: number, maxVal: number | undefined | null) => {
    if (minVal === undefined) return null;
    return <GoldDisplay valueInPln={minVal} valueInPlnMax={maxVal} />;
  };

  return (
    <div class="p-10 rounded-lg bg-white mt-8">
      <h3 class="w-full mt-0">Salary in PLN</h3>

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
            <td>{renderValue(reducedSalaries().hourly, reducedSalariesMax()?.hourly)}</td>
            <td>{renderValue(reducedSalaries().daily, reducedSalariesMax()?.daily)}</td>
            <td>
              {renderValue(reducedSalaries().monthly, reducedSalariesMax()?.monthly, true)}
              {renderGold(reducedSalaries().monthly, reducedSalariesMax()?.monthly)}
            </td>
            <td>
              {renderValue(reducedSalaries().yearly, reducedSalariesMax()?.yearly, true)}
              {renderGold(reducedSalaries().yearly, reducedSalariesMax()?.yearly)}
            </td>
          </tr>
          <Show when={userInput().daysOff > 0}>
            <tr class="align-top text-gray-500">
              <td>Days off cost</td>
              <td></td>
              <td></td>
              <td>
                <Show
                  when={hasMax()}
                  fallback={<div>-{formatCompactSalary(salaries().monthly - reducedSalaries().monthly)}</div>}
                >
                  <div>
                    -{formatCompactSalary(salaries().monthly - reducedSalaries().monthly)} -
                    {formatCompactSalary(salariesMax()!.monthly - reducedSalariesMax()!.monthly)}
                  </div>
                </Show>
              </td>
              <td>
                <Show
                  when={hasMax()}
                  fallback={<div>-{formatCompactSalary(salaries().yearly - reducedSalaries().yearly)}</div>}
                >
                  <div>
                    -{formatCompactSalary(salaries().yearly - reducedSalaries().yearly)} -
                    {formatCompactSalary(salariesMax()!.yearly - reducedSalariesMax()!.yearly)}
                  </div>
                </Show>
              </td>
            </tr>
          </Show>
          <tr class="align-top border-t border-gray-400">
            <td>
              Linear 19%
              <br />
              <span class="text-sm text-gray-400">(big ZUS)</span>
            </td>
            <td>{renderValue(linearTax19().hourly, linearTax19Max()?.hourly)}</td>
            <td>{renderValue(linearTax19().daily, linearTax19Max()?.daily)}</td>
            <td>
              {renderValue(linearTax19().monthly, linearTax19Max()?.monthly, true)}
              {renderGold(linearTax19().monthly, linearTax19Max()?.monthly)}
            </td>
            <td>
              {renderValue(linearTax19().yearly, linearTax19Max()?.yearly, true)}
              {renderGold(linearTax19().yearly, linearTax19Max()?.yearly)}
            </td>
          </tr>
          <tr class="align-top">
            <td>
              Flat 12%
              <br />
              <span class="text-sm text-gray-400">(big ZUS)</span>
            </td>
            <td>{renderValue(flatTax12().hourly, flatTax12Max()?.hourly)}</td>
            <td>{renderValue(flatTax12().daily, flatTax12Max()?.daily)}</td>
            <td>
              {renderValue(flatTax12().monthly, flatTax12Max()?.monthly, true)}
              {renderGold(flatTax12().monthly, flatTax12Max()?.monthly)}
            </td>
            <td>
              {renderValue(flatTax12().yearly, flatTax12Max()?.yearly, true)}
              {renderGold(flatTax12().yearly, flatTax12Max()?.yearly)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
