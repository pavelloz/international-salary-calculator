import { Show, onMount } from "solid-js";
import { useHydratedStore } from "../lib/useHydratedStore";

import { $userInputStore } from "../stores/userInput";
import { $ratesStore, fetchRates } from "../stores/rates";

import { defaultUserInput } from "../stores/userInput";
import { defaultRates } from "../stores/rates";

export default function ExchangeRatesList() {
  const userInput = useHydratedStore($userInputStore, defaultUserInput);
  const ratesStore = useHydratedStore($ratesStore, defaultRates);

  onMount(() => {
    fetchRates();
  });

  const selectedRate = () =>
    ratesStore().rates && userInput().currency ? ratesStore().rates[userInput().currency] : null;

  return (
    <Show when={selectedRate()}>
      <Show when={userInput().currency !== "pln"}>
        <p class="pt-0 italic text-sm text-right">
          1 PLN = {selectedRate()} {userInput().currency.toUpperCase()}
        </p>
      </Show>
    </Show>
  );
}
