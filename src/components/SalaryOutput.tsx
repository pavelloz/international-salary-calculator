import { Show } from "solid-js";
import { useHydratedStore } from "../lib/useHydratedStore";
import { deductDaysOff } from "../lib/calculateDaysOff";
import { calculateSalaries, formatSalary, formatCompactSalary } from "../lib/calculateSalaries";
import { MONTHS_PER_YEAR, WORKING_DAYS_PER_YEAR } from "../lib/constants";
import { calculateFlatTax12, calculateLineartax19, calculateEmploymentContract } from "../lib/calculateTaxes";
import { $userInputStore, defaultUserInput } from "../stores/userInput";
import { $ratesStore, defaultRates } from "../stores/rates";

export default function SalaryOutput() {
  const userInput = useHydratedStore($userInputStore, defaultUserInput);
  const ratesStore = useHydratedStore($ratesStore, defaultRates);

  // TODO: Implement: Add contract type selector
  // TODO: Add est. gross, net

  const salaries = () =>
    calculateSalaries(userInput().salary, userInput().period, ratesStore().rates[userInput().currency]);

  const yearlyBonusPLN = () => (salaries().yearly * (userInput().yearlyBonus || 0)) / 100;
  const yearlyBonusPLNMax = () => (hasMax() ? (salariesMax()!.yearly * (userInput().yearlyBonus || 0)) / 100 : null);

  const flatTax12 = () => calculateFlatTax12(salaries().monthly);
  const linearTax19 = () => calculateLineartax19(salaries().monthly);

  // Max calculations
  const hasMax = () =>
    (userInput().period === "monthly" || userInput().period === "yearly") && userInput().salaryMax !== undefined;

  const salariesMax = () =>
    hasMax()
      ? calculateSalaries(userInput().salaryMax!, userInput().period, ratesStore().rates[userInput().currency])
      : null;

  const daysOffCostAnnual = () => salaries().yearly - deductDaysOff(salaries().yearly, userInput().daysOff);
  const daysOffCostAnnualMax = () =>
    hasMax() ? salariesMax()!.yearly - deductDaysOff(salariesMax()!.yearly, userInput().daysOff) : null;

  const flatTax12Max = () => (salariesMax() ? calculateFlatTax12(salariesMax()!.monthly) : null);
  const linearTax19Max = () => (salariesMax() ? calculateLineartax19(salariesMax()!.monthly) : null);
  const employmentContract = () => calculateEmploymentContract(salaries().monthly, userInput().isCreative || false);
  const employmentContractMax = () =>
    salariesMax() ? calculateEmploymentContract(salariesMax()!.monthly, userInput().isCreative || false) : null;

  const paidDaysOffValueAnnual = () => (salaries().yearly / WORKING_DAYS_PER_YEAR) * (userInput().paidDaysOff || 0);
  const paidDaysOffValueAnnualMax = () =>
    hasMax() ? (salariesMax()!.yearly / WORKING_DAYS_PER_YEAR) * (userInput().paidDaysOff || 0) : null;

  interface PeriodValues {
    monthly: number;
    yearly: number;
  }

  const calculateTotal = (net: PeriodValues, isMax: boolean) => {
    const dCost = isMax ? daysOffCostAnnualMax()! : daysOffCostAnnual();
    const pdVal = isMax ? paidDaysOffValueAnnualMax()! : paidDaysOffValueAnnual();
    const bVal = isMax ? yearlyBonusPLNMax()! : yearlyBonusPLN();
    const benVal = userInput().benefits || 0;

    return {
      monthly:
        net.monthly -
        dCost / MONTHS_PER_YEAR +
        pdVal / MONTHS_PER_YEAR +
        bVal / MONTHS_PER_YEAR +
        benVal / MONTHS_PER_YEAR,
      yearly: net.yearly - dCost + pdVal + bVal + benVal,
    };
  };

  const totalFlat12 = () => calculateTotal(flatTax12(), false);
  const totalLinear19 = () => calculateTotal(linearTax19(), false);
  const totalUop = () => calculateTotal(employmentContract(), false);

  const totalFlat12Max = () => (hasMax() ? calculateTotal(flatTax12Max()!, true) : null);
  const totalLinear19Max = () => (hasMax() ? calculateTotal(linearTax19Max()!, true) : null);
  const totalUopMax = () => (hasMax() ? calculateTotal(employmentContractMax()!, true) : null);

  const renderTotalGrey = (minVal: number, maxVal: number | undefined | null) => {
    if (minVal === undefined) return null;
    return (
      <div class="text-xs text-gray-500 mt-1">
        Total: {formatCompactSalary(minVal)}
        {maxVal !== null && maxVal !== undefined ? ` - ${formatCompactSalary(maxVal)}` : ""}
      </div>
    );
  };

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
            <td>{renderValue(salaries().hourly, salariesMax()?.hourly)}</td>
            <td>{renderValue(salaries().monthly, salariesMax()?.monthly, true)}</td>
            <td>{renderValue(salaries().yearly, salariesMax()?.yearly, true)}</td>
          </tr>
          <Show when={userInput().daysOff > 0}>
            <tr class="align-top text-sm text-gray-500 [&>td]:pb-0 [&>td]:pt-1">
              <td>Days off cost</td>
              <td></td>
              <td class="text-red-700">
                <Show
                  when={hasMax()}
                  fallback={<div>-{formatCompactSalary(daysOffCostAnnual() / MONTHS_PER_YEAR)}</div>}
                >
                  <div>
                    -{formatCompactSalary(daysOffCostAnnual() / MONTHS_PER_YEAR)} - -
                    {formatCompactSalary(daysOffCostAnnualMax()! / MONTHS_PER_YEAR)}
                  </div>
                </Show>
              </td>
              <td class="text-red-700">
                <Show when={hasMax()} fallback={<div>-{formatCompactSalary(daysOffCostAnnual())}</div>}>
                  <div>
                    -{formatCompactSalary(daysOffCostAnnual())} - -{formatCompactSalary(daysOffCostAnnualMax()!)}
                  </div>
                </Show>
              </td>
            </tr>
          </Show>
          <Show when={(userInput().paidDaysOff || 0) > 0}>
            <tr class="align-top text-sm text-gray-500 [&>td]:pb-0 [&>td]:pt-1">
              <td>Paid days off value</td>
              <td></td>
              <td class="text-green-700">
                <Show
                  when={hasMax()}
                  fallback={<div>+{formatCompactSalary(paidDaysOffValueAnnual() / MONTHS_PER_YEAR)}</div>}
                >
                  <div>
                    +{formatCompactSalary(paidDaysOffValueAnnual() / MONTHS_PER_YEAR)} - +
                    {formatCompactSalary(paidDaysOffValueAnnualMax()! / MONTHS_PER_YEAR)}
                  </div>
                </Show>
              </td>
              <td class="text-green-700">
                <Show when={hasMax()} fallback={<div>+{formatCompactSalary(paidDaysOffValueAnnual())}</div>}>
                  <div>
                    +{formatCompactSalary(paidDaysOffValueAnnual())} - +
                    {formatCompactSalary(paidDaysOffValueAnnualMax()!)}
                  </div>
                </Show>
              </td>
            </tr>
          </Show>
          <Show when={(userInput().yearlyBonus || 0) > 0}>
            <tr class="align-top text-sm text-gray-500 [&>td]:pb-1 [&>td]:pt-1">
              <td>Yearly bonus</td>
              <td></td>
              <td class="text-green-700">
                <Show when={hasMax()} fallback={<div>+{formatCompactSalary(yearlyBonusPLN() / MONTHS_PER_YEAR)}</div>}>
                  <div>
                    +{formatCompactSalary(yearlyBonusPLN() / MONTHS_PER_YEAR)} - +
                    {formatCompactSalary(yearlyBonusPLNMax()! / MONTHS_PER_YEAR)}
                  </div>
                </Show>
              </td>
              <td class="text-green-700">
                <Show when={hasMax()} fallback={<div>+{formatCompactSalary(yearlyBonusPLN())}</div>}>
                  <div>
                    +{formatCompactSalary(yearlyBonusPLN())} - +{formatCompactSalary(yearlyBonusPLNMax()!)}
                  </div>
                </Show>
              </td>
            </tr>
          </Show>
          <Show when={(userInput().benefits || 0) > 0}>
            <tr class="align-top text-sm text-gray-500 [&>td]:pb-1 [&>td]:pt-1">
              <td>Benefits</td>
              <td></td>
              <td class="text-green-700">
                <Show
                  when={hasMax()}
                  fallback={<div>+{formatCompactSalary((userInput().benefits || 0) / MONTHS_PER_YEAR)}</div>}
                >
                  <div>
                    +{formatCompactSalary((userInput().benefits || 0) / MONTHS_PER_YEAR)} - +
                    {formatCompactSalary((userInput().benefits || 0) / MONTHS_PER_YEAR)}
                  </div>
                </Show>
              </td>
              <td class="text-green-700">
                <Show when={hasMax()} fallback={<div>+{formatCompactSalary(userInput().benefits || 0)}</div>}>
                  <div>
                    +{formatCompactSalary(userInput().benefits || 0)} - +
                    {formatCompactSalary(userInput().benefits || 0)}
                  </div>
                </Show>
              </td>
            </tr>
          </Show>
          <Show
            when={
              !userInput().contractType || userInput().contractType === "all" || userInput().contractType === "flat"
            }
          >
            <tr class="align-top">
              <td>Flat 12%</td>
              <td>{renderValue(flatTax12().hourly, flatTax12Max()?.hourly)}</td>
              <td>
                {renderValue(flatTax12().monthly, flatTax12Max()?.monthly, true)}
                {renderTotalGrey(totalFlat12().monthly, totalFlat12Max()?.monthly)}
              </td>
              <td>
                {renderValue(flatTax12().yearly, flatTax12Max()?.yearly, true)}
                {renderTotalGrey(totalFlat12().yearly, totalFlat12Max()?.yearly)}
              </td>
            </tr>
          </Show>
          <Show
            when={
              !userInput().contractType || userInput().contractType === "all" || userInput().contractType === "linear"
            }
          >
            <tr class="align-top">
              <td>Linear 19%</td>
              <td>{renderValue(linearTax19().hourly, linearTax19Max()?.hourly)}</td>
              <td>
                {renderValue(linearTax19().monthly, linearTax19Max()?.monthly, true)}
                {renderTotalGrey(totalLinear19().monthly, totalLinear19Max()?.monthly)}
              </td>
              <td>
                {renderValue(linearTax19().yearly, linearTax19Max()?.yearly, true)}
                {renderTotalGrey(totalLinear19().yearly, totalLinear19Max()?.yearly)}
              </td>
            </tr>
          </Show>
          <Show
            when={!userInput().contractType || userInput().contractType === "all" || userInput().contractType === "uop"}
          >
            <tr class="align-top">
              <td>
                Employment (UoP)
                <br />
              </td>
              <td>{renderValue(employmentContract().hourly, employmentContractMax()?.hourly)}</td>
              <td>
                {renderValue(employmentContract().monthly, employmentContractMax()?.monthly, true)}
                {renderTotalGrey(totalUop().monthly, totalUopMax()?.monthly)}
              </td>
              <td>
                {renderValue(employmentContract().yearly, employmentContractMax()?.yearly, true)}
                {renderTotalGrey(totalUop().yearly, totalUopMax()?.yearly)}
              </td>
            </tr>
          </Show>
        </tbody>
      </table>
    </div>
  );
}
