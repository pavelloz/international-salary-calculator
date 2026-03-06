import { For, Show, createEffect, on, createMemo, untrack } from "solid-js";
import { useHydratedStore } from "../lib/useHydratedStore";
import { convertSalaryPeriod, convertSalaryCurrency } from "../lib/calculateSalaries";
import { $ratesStore, defaultRates } from "../stores/rates";

import { CURRENCIES, CURRENCY_FLAGS, PERIODS } from "../lib/constants";
import {
  $userInputStore,
  defaultUserInput,
  setCurrency,
  setDaysOff,
  setPeriod,
  setSalary,
  setSalaryMax,
  setPaidDaysOff,
} from "../stores/userInput";

export const cleanNumericInput = (val: string) => val.replace(/\D/g, "");

export default function SalaryInput() {
  const store = useHydratedStore($userInputStore, defaultUserInput);
  const ratesStore = useHydratedStore($ratesStore, defaultRates);

  // Use memos to isolate property changes.
  // This prevents setting salaryMax from re-triggering effects that watch the whole store object.
  const salary = createMemo<number>(() => store().salary);
  const period = createMemo<string>(() => store().period);
  const salaryMax = createMemo<number | undefined>(() => store().salaryMax);

  // Set default max salary when period changes to monthly/yearly and max is not set.
  createEffect(
    on(period, p => {
      if (p === "monthly" || p === "yearly") {
        if (!untrack(salaryMax) && untrack(salary) > 0) {
          setSalaryMax(Math.round(untrack(salary) * 1.2));
        }
      } else {
        if (untrack(salaryMax) !== undefined) {
          setSalaryMax(undefined);
        }
      }
    })
  );

  // Also default max when base salary changes, if applicable and max not set.
  createEffect(
    on(salary, s => {
      const p = untrack(period);
      if ((p === "monthly" || p === "yearly") && !untrack(salaryMax) && s > 0) {
        setSalaryMax(Math.round(s * 1.2));
      }
    })
  );

  return (
    <div class="flex justify-between flex-wrap p-4 md:p-10 gap-x-6 rounded-lg bg-white items-end">
      <h3 class="w-full text-gray-700 mt-0 text-xl md:text-2xl">Salary in {store().currency.toUpperCase()}</h3>

      <div class="flex-1 flex flex-col mt-4">
        <label class="text-xs text-gray-500 mb-1" for="period">
          Period
        </label>
        <select
          id="period"
          onChange={e => {
            const newPeriod = e.currentTarget.value;
            const oldPeriod = store().period;

            if (oldPeriod !== newPeriod) {
              const newSalary = convertSalaryPeriod(store().salary, oldPeriod, newPeriod);
              setSalary(newSalary);

              if (store().salaryMax !== undefined) {
                if (newPeriod === "monthly" || newPeriod === "yearly") {
                  let newMax = convertSalaryPeriod(store().salaryMax as number, oldPeriod, newPeriod);
                  if (newMax < newSalary) {
                    newMax = newSalary;
                  }
                  setSalaryMax(newMax);
                } else {
                  setSalaryMax(undefined);
                }
              } else if (newPeriod === "monthly" || newPeriod === "yearly") {
                // Auto-guess if it was undefined but we are entering a range-enabled period
                if (newSalary > 0) {
                  setSalaryMax(Math.round(newSalary * 1.2));
                }
              }

              setPeriod(newPeriod);
            }
          }}
          value={store().period}
        >
          <For each={PERIODS}>{(p: string) => <option value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>}</For>
        </select>
      </div>

      <div class="flex-1 flex flex-col mt-4">
        <label class="text-xs text-gray-500 mb-1" for="salary">
          <Show when={store().period === "monthly" || store().period === "yearly"} fallback={<>Amount</>}>
            Min Amount
          </Show>
        </label>
        <input
          id="salary"
          name="salary"
          value={store().salary}
          onInput={e => {
            const cleanValue = cleanNumericInput(e.currentTarget.value);
            e.currentTarget.value = cleanValue;
            setSalary(cleanValue);
          }}
          onBlur={() => {
            const currentMax = store().salaryMax;
            if (currentMax !== undefined && currentMax < store().salary) {
              setSalaryMax(store().salary);
            }
          }}
          pattern="\d*"
        />
      </div>

      <Show when={store().period === "monthly" || store().period === "yearly"}>
        <div class="flex-1 flex flex-col mt-4">
          <label class="text-xs text-gray-500 mb-1" for="salaryMax">
            Max Amount
          </label>
          <input
            id="salaryMax"
            name="salaryMax"
            value={store().salaryMax || ""}
            onInput={e => {
              const cleanValue = cleanNumericInput(e.currentTarget.value);
              e.currentTarget.value = cleanValue;
              setSalaryMax(cleanValue === "" ? undefined : cleanValue);
            }}
            onBlur={() => {
              const currentMax = store().salaryMax;
              // Only snap back to min salary if max is explicitly defined and less than min salary
              if (currentMax !== undefined && currentMax < store().salary) {
                setSalaryMax(store().salary);
              }
            }}
            pattern="\d*"
          />
        </div>
      </Show>

      <div class="flex-0 flex flex-col mt-4">
        <label class="text-xs text-gray-500 mb-1" for="currency">
          Currency
        </label>
        <select
          id="currency"
          value={store().currency}
          onChange={e => {
            const newCurrency = e.currentTarget.value;
            const oldCurrency = store().currency;

            if (oldCurrency !== newCurrency) {
              const rates = ratesStore().rates;
              const oldRate = rates[oldCurrency] || 1;
              const newRate = rates[newCurrency] || 1;

              const newSalary = convertSalaryCurrency(store().salary, oldRate, newRate);
              setSalary(newSalary);

              if (store().salaryMax !== undefined) {
                // we know store().salaryMax is not undefined here
                let newMax = convertSalaryCurrency(store().salaryMax as number, oldRate, newRate);
                if (newMax < newSalary) {
                  newMax = newSalary;
                }
                setSalaryMax(newMax);
              }

              setCurrency(newCurrency);
            }
          }}
        >
          <For each={CURRENCIES}>
            {(c: string) => (
              <option value={c}>
                {CURRENCY_FLAGS[c as keyof typeof CURRENCY_FLAGS]} {c.toUpperCase()}
              </option>
            )}
          </For>
        </select>
      </div>

      <div class="w-full flex gap-x-12 mt-4">
        <div class="flex flex-col">
          <label class="text-xs text-gray-500 mb-1" for="daysOff">
            Unpaid days off per year
          </label>
          <input
            class="w-24"
            id="daysOff"
            name="daysOff"
            value={store().daysOff}
            onInput={e => {
              const cleanValue = cleanNumericInput(e.currentTarget.value);
              e.currentTarget.value = cleanValue;
              setDaysOff(cleanValue);
            }}
          />
        </div>

        <div class="flex flex-col">
          <label class="text-xs text-gray-500 mb-1" for="paidDaysOff">
            Paid days off per year
          </label>
          <input
            class="w-24"
            id="paidDaysOff"
            name="paidDaysOff"
            value={store().paidDaysOff ?? 0}
            onInput={e => {
              const cleanValue = cleanNumericInput(e.currentTarget.value);
              e.currentTarget.value = cleanValue;
              setPaidDaysOff(cleanValue);
            }}
          />
        </div>
      </div>
    </div>
  );
}
