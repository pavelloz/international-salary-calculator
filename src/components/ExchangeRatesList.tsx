import { Show } from "solid-js";
import { useHydratedStore } from "../lib/useHydratedStore";

import { $userInputStore } from "../stores/userInput";
import { $ratesStore } from "../stores/rates";

import { defaultUserInput } from "../stores/userInput";
import { defaultRates } from "../stores/rates";

export default function ExchangeRatesList() {
  const userInput = useHydratedStore($userInputStore, defaultUserInput);
  const ratesStore = useHydratedStore($ratesStore, defaultRates);

  const selectedRate = () =>
    ratesStore().rates && userInput().currency ? ratesStore().rates[userInput().currency] : null;

  return (
    <Show when={selectedRate()}>
      <div class="border-t border-gray-500 mt-4 pt-4">
        <Show when={userInput().currency !== "pln"}>
          <p class="pt-0 italic text-sm">
            1 PLN = {selectedRate()} {userInput().currency.toUpperCase()}
          </p>
        </Show>
      </div>
    </Show>
  );
}
