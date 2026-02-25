import { Show } from "solid-js";
import { formatInGold } from "../lib/calculateSalaries";
import { useHydratedStore } from "../lib/useHydratedStore";
import { $ratesStore, defaultRates } from "../stores/rates";

interface GoldDisplayProps {
  valueInPln: number;
}

export default function GoldDisplay(props: GoldDisplayProps) {
  const ratesStore = useHydratedStore($ratesStore, defaultRates);

  const goldAmount = () => props.valueInPln / ratesStore().goldPrice;

  return (
    <Show when={goldAmount() > 0}>
      <div class="text-gray-400 text-sm">{formatInGold(goldAmount())} oz of gold</div>
    </Show>
  );
}
