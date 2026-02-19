import { useEffect, useState } from "react";

import { useStore } from "@nanostores/react";

import { $apiStore, $userInputStore } from "../stores/store";

export default function ExchangeRatesList() {
  const { rates } = useStore($apiStore);
  const { currency } = useStore($userInputStore);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const selectedRate = rates[currency];

  return (
    <div className="border-t border-gray-500 mt-4 pt-4">
      <p className="pt-0 italic text-sm">
        1 PLN = {selectedRate} {currency.toUpperCase()}
      </p>
    </div>
  );
}
