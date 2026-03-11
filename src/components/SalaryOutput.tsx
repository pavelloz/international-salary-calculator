import { Show } from "solid-js";
import { useHydratedStore } from "../lib/useHydratedStore";
import { convertToAllPeriods, deductDaysOff } from "../lib/calculateDaysOff";
import { calculateSalaries, formatSalary, formatCompactSalary } from "../lib/calculateSalaries";
import { MONTHS_PER_YEAR, WORKING_DAYS_PER_YEAR } from "../lib/constants";
import { calculateFlatTax12, calculateLineartax19, calculateEmploymentContract } from "../lib/calculateTaxes";
import { $userInputStore, defaultUserInput, setShowGold } from "../stores/userInput";
import { $ratesStore, defaultRates } from "../stores/rates";
import GoldDisplay from "./GoldDisplay";

export default function SalaryOutput() {
  const userInput = useHydratedStore($userInputStore, defaultUserInput);
  const ratesStore = useHydratedStore($ratesStore, defaultRates);

  // TODO: Implement: Add contract type selector
  // TODO: Add est. gross, net

  const salaries = () =>
    calculateSalaries(userInput().salary, userInput().period, ratesStore().rates[userInput().currency]);

  const yearlyBonusPLN = () => (salaries().yearly * (userInput().yearlyBonus || 0)) / 100;
  const yearlyBonusPLNMax = () => (hasMax() ? (salariesMax()!.yearly * (userInput().yearlyBonus || 0)) / 100 : null);

  // Apply days off deduction to the annual salary
  const grossReducedAnnual = () => deductDaysOff(salaries().yearly, userInput().daysOff) + yearlyBonusPLN();

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
    salariesMax() ? deductDaysOff(salariesMax()!.yearly, userInput().daysOff) + yearlyBonusPLNMax()! : null;
  const reducedSalariesMax = () =>
    grossReducedAnnualMax() !== null ? convertToAllPeriods(grossReducedAnnualMax()!) : null;

  const daysOffCostAnnual = () => salaries().yearly - deductDaysOff(salaries().yearly, userInput().daysOff);
  const daysOffCostAnnualMax = () =>
    hasMax() ? salariesMax()!.yearly - deductDaysOff(salariesMax()!.yearly, userInput().daysOff) : null;

  const flatTax12Max = () => (reducedSalariesMax() ? calculateFlatTax12(reducedSalariesMax()!.monthly) : null);
  const linearTax19Max = () => (reducedSalariesMax() ? calculateLineartax19(reducedSalariesMax()!.monthly) : null);
  const employmentContract = () => calculateEmploymentContract(salaries().monthly);
  const employmentContractMax = () => (salariesMax() ? calculateEmploymentContract(salariesMax()!.monthly) : null);

  const paidDaysOffValueAnnual = () => (salaries().yearly / WORKING_DAYS_PER_YEAR) * (userInput().paidDaysOff || 0);
  const paidDaysOffValueAnnualMax = () =>
    hasMax() ? (salariesMax()!.yearly / WORKING_DAYS_PER_YEAR) * (userInput().paidDaysOff || 0) : null;

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
    return (
      <Show when={userInput().showGold}>
        <GoldDisplay valueInPln={minVal} valueInPlnMax={maxVal} />
      </Show>
    );
  };

  return (
    <div class="mt-8 p-4 md:p-10 rounded-lg bg-white">
      <h3 class="w-full mt-0 text-xl md:text-2xl">Salary in PLN</h3>

      <table class="w-full table-auto">
        <thead>
          <tr class="text-left">
            <th></th>
            <th>Hourly</th>
            <th>Monthly</th>
            <th>Yearly</th>
          </tr>
        </thead>
        <tbody>
          <tr class="align-top text-gray-600">
            <td>Gross</td>
            <td>{renderValue(reducedSalaries().hourly, reducedSalariesMax()?.hourly)}</td>
            <td>
              {renderValue(reducedSalaries().monthly, reducedSalariesMax()?.monthly, true)}
              <span class="hidden md:inline">
                {renderGold(reducedSalaries().monthly, reducedSalariesMax()?.monthly)}
              </span>
            </td>
            <td>
              {renderValue(reducedSalaries().yearly, reducedSalariesMax()?.yearly, true)}
              <span class="hidden md:inline">{renderGold(reducedSalaries().yearly, reducedSalariesMax()?.yearly)}</span>
            </td>
          </tr>
          <Show when={userInput().daysOff > 0}>
            <tr class="align-top text-gray-500">
              <td>Days off cost</td>
              <td></td>
              <td>
                <Show
                  when={hasMax()}
                  fallback={<div>-{formatCompactSalary(daysOffCostAnnual() / MONTHS_PER_YEAR)}</div>}
                >
                  <div>
                    -{formatCompactSalary(daysOffCostAnnual() / MONTHS_PER_YEAR)} -{" "}
                    {formatCompactSalary(daysOffCostAnnualMax()! / MONTHS_PER_YEAR)}
                  </div>
                </Show>
              </td>
              <td>
                <Show when={hasMax()} fallback={<div>-{formatCompactSalary(daysOffCostAnnual())}</div>}>
                  <div>
                    -{formatCompactSalary(daysOffCostAnnual())} - {formatCompactSalary(daysOffCostAnnualMax()!)}
                  </div>
                </Show>
              </td>
            </tr>
          </Show>
          <Show when={(userInput().paidDaysOff || 0) > 0}>
            <tr class="align-top text-gray-500">
              <td>Paid days off value</td>
              <td></td>
              <td>
                <Show
                  when={hasMax()}
                  fallback={<div>+{formatCompactSalary(paidDaysOffValueAnnual() / MONTHS_PER_YEAR)}</div>}
                >
                  <div>
                    {formatCompactSalary(paidDaysOffValueAnnual() / MONTHS_PER_YEAR)} -{" "}
                    {formatCompactSalary(paidDaysOffValueAnnualMax()! / MONTHS_PER_YEAR)}
                  </div>
                </Show>
              </td>
              <td>
                <Show when={hasMax()} fallback={<div>+{formatCompactSalary(paidDaysOffValueAnnual())}</div>}>
                  <div>
                    {formatCompactSalary(paidDaysOffValueAnnual())} -{" "}
                    {formatCompactSalary(paidDaysOffValueAnnualMax()!)}
                  </div>
                </Show>
              </td>
            </tr>
          </Show>
          <Show when={(userInput().yearlyBonus || 0) > 0}>
            <tr class="align-top text-gray-500">
              <td>Yearly bonus</td>
              <td></td>
              <td>
                <Show when={hasMax()} fallback={<div>+{formatCompactSalary(yearlyBonusPLN() / MONTHS_PER_YEAR)}</div>}>
                  <div>
                    +{formatCompactSalary(yearlyBonusPLN() / MONTHS_PER_YEAR)} -{" "}
                    {formatCompactSalary(yearlyBonusPLNMax()! / MONTHS_PER_YEAR)}
                  </div>
                </Show>
              </td>
              <td>
                <Show when={hasMax()} fallback={<div>+{formatCompactSalary(yearlyBonusPLN())}</div>}>
                  <div>
                    +{formatCompactSalary(yearlyBonusPLN())} - {formatCompactSalary(yearlyBonusPLNMax()!)}
                  </div>
                </Show>
              </td>
            </tr>
          </Show>
          <tr class="align-top border-t border-gray-400">
            <td>Flat 12%</td>
            <td>{renderValue(flatTax12().hourly, flatTax12Max()?.hourly)}</td>
            <td>
              {renderValue(flatTax12().monthly, flatTax12Max()?.monthly, true)}
              <span class="hidden md:inline">{renderGold(flatTax12().monthly, flatTax12Max()?.monthly)}</span>
            </td>
            <td>
              {renderValue(flatTax12().yearly, flatTax12Max()?.yearly, true)}
              <span class="hidden md:inline">{renderGold(flatTax12().yearly, flatTax12Max()?.yearly)}</span>
            </td>
          </tr>
          <tr class="align-top">
            <td>Linear 19%</td>
            <td>{renderValue(linearTax19().hourly, linearTax19Max()?.hourly)}</td>
            <td>
              {renderValue(linearTax19().monthly, linearTax19Max()?.monthly, true)}
              <span class="hidden md:inline">{renderGold(linearTax19().monthly, linearTax19Max()?.monthly)}</span>
            </td>
            <td>
              {renderValue(linearTax19().yearly, linearTax19Max()?.yearly, true)}
              <span class="hidden md:inline">{renderGold(linearTax19().yearly, linearTax19Max()?.yearly)}</span>
            </td>
          </tr>
          <tr class="align-top">
            <td>
              Employment (UoP)
              <br />
            </td>
            <td>{renderValue(employmentContract().hourly, employmentContractMax()?.hourly)}</td>
            <td>
              {renderValue(employmentContract().monthly, employmentContractMax()?.monthly, true)}
              <span class="hidden md:inline">
                {renderGold(employmentContract().monthly, employmentContractMax()?.monthly)}
              </span>
            </td>
            <td>
              {renderValue(employmentContract().yearly, employmentContractMax()?.yearly, true)}
              <span class="hidden md:inline">
                {renderGold(employmentContract().yearly, employmentContractMax()?.yearly)}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <label for="showGoldCheckbox" class="mt-8 hidden md:flex items-center  gap-2 cursor-pointer">
        <input
          type="checkbox"
          id="showGoldCheckbox"
          checked={userInput().showGold || false}
          onChange={e => setShowGold(e.currentTarget.checked)}
          class="rounded cursor-pointer"
        />
        <span class="text-sm text-gray-600">Show gold equivalent</span>
      </label>
    </div>
  );
}
