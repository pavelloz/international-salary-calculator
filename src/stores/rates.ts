import { persistentMap } from "@nanostores/persistent";
import * as v from "valibot";

export type TRate = Record<string, number>;

interface IRatesStore {
  rates: TRate;
  goldPrice: number;
  loading: boolean;
}

export const $ratesStore = persistentMap<IRatesStore>(
  "rates-cache:",
  {
    rates: {},
    goldPrice: 0,
    loading: false,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

const PLN = { pln: 1 };

export async function fetchRates() {
  if ($ratesStore.get().loading) return;

  $ratesStore.setKey("loading", true);

  try {
    const res = await fetch("/api/rates.json");
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    const rawData = await res.json();

    // Validate the API response
    const data = v.parse(
      v.object({
        rates: v.record(v.string(), v.number()),
        goldPrice: v.number(),
      }),
      rawData
    );

    $ratesStore.set({
      rates: { ...data.rates, ...PLN },
      goldPrice: data.goldPrice,
      loading: false,
    });
  } catch (e) {
    $ratesStore.setKey("loading", false);
    console.warn("Rates fetch or validation failed, using cached fallback data if available.", e);
  }
}
