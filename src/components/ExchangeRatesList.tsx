import { useStore } from "@nanostores/solid";
import { Show } from "solid-js";

import { $userInputStore } from "@/stores/store";
import { $ratesStore } from "@/stores/rates";

export default function ExchangeRatesList() {
  const userInput = useStore($userInputStore);
  const ratesStore = useStore($ratesStore);

  const selectedRate = () => ratesStore().rates && userInput().currency ? ratesStore().rates[userInput().currency] : null;

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
