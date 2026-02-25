import { For } from "solid-js";
import { useHydratedStore } from "../lib/useHydratedStore";

import { CURRENCIES, CURRENCY_FLAGS, PERIODS } from "../lib/constants";
import { $userInputStore, defaultUserInput, setCurrency, setDaysOff, setPeriod, setSalary } from "../stores/userInput";

export const cleanNumericInput = (val: string) => val.replace(/\D/g, "");

export default function SalaryInput() {
  const store = useHydratedStore($userInputStore, defaultUserInput);

  return (
    <div class="flex justify-between flex-wrap pb-8 gap-x-6">
      <h3 class="w-full text-gray-700 mt-0">Salary in foreign currency</h3>

      <select class="flex-1" id="period" onChange={e => setPeriod(e.currentTarget.value)} value={store().period}>
        <For each={PERIODS}>{(p: string) => <option value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>}</For>
      </select>
      <input
        class="flex-1"
        id="salary"
        name="salary"
        value={store().salary}
        onInput={e => {
          const cleanValue = cleanNumericInput(e.currentTarget.value);
          e.currentTarget.value = cleanValue;
          setSalary(cleanValue);
        }}
        pattern="\d*"
      />
      <select class="flex-0" id="currency" value={store().currency} onChange={e => setCurrency(e.currentTarget.value)}>
        <For each={CURRENCIES}>
          {(c: string) => (
            <option value={c}>
              {CURRENCY_FLAGS[c as keyof typeof CURRENCY_FLAGS]} {c.toUpperCase()}
            </option>
          )}
        </For>
      </select>

      <h4 class="w-full text-gray-700 mt-4">Days off per year</h4>
      <input
        class="w-16"
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
  );
}
