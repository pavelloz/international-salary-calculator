import { useStore } from "@nanostores/react";

import { $userInputStore } from "@/stores/store";
import { $ratesStore } from "@/stores/rates";

export default function ExchangeRatesList() {
  const { currency } = useStore($userInputStore);
  const { rates } = useStore($ratesStore);

  const selectedRate = rates && currency ? rates[currency] : null;

  if (!selectedRate) return null;

  return (
    <div className="border-t border-gray-500 mt-4 pt-4">
      {currency !== "pln" && (
        <p className="pt-0 italic text-sm">
          1 PLN = {selectedRate} {currency.toUpperCase()}
        </p>
      )}
    </div>
  );
}
