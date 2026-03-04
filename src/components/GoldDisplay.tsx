import { Show } from "solid-js";
import { formatInGold } from "../lib/calculateSalaries";
import { useHydratedStore } from "../lib/useHydratedStore";
import { $ratesStore, defaultRates } from "../stores/rates";

interface GoldDisplayProps {
  valueInPln: number;
  valueInPlnMax?: number | null;
}

export default function GoldDisplay(props: GoldDisplayProps) {
  const ratesStore = useHydratedStore($ratesStore, defaultRates);

  const goldAmount = () => props.valueInPln / ratesStore().goldPrice;
  const goldAmountMax = () => (props.valueInPlnMax != null ? props.valueInPlnMax / ratesStore().goldPrice : null);

  return (
    <Show when={goldAmount() > 0}>
      <div class="text-gray-400 text-sm">
        {formatInGold(goldAmount())}
        {goldAmountMax() != null && ` - ${formatInGold(goldAmountMax()!)}`} oz of gold
      </div>
    </Show>
  );
}
