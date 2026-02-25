import { persistentMap } from "@nanostores/persistent";
import * as v from "valibot";
import { PLN } from "../lib/constants";

export const rateSchema = v.record(v.string(), v.number());
export type TRate = v.InferOutput<typeof rateSchema>;

export const ratesStoreSchema = v.object({
  rates: rateSchema,
  goldPrice: v.number(),
  loading: v.boolean(),
});
export type IRatesStore = v.InferOutput<typeof ratesStoreSchema>;

export const defaultRates: IRatesStore = {
  rates: {
    ...PLN,
    usd: 3.5,
    eur: 4.2,
    chf: 4.1,
    gbp: 4.5
  },
  goldPrice: 590, // reasonable default to avoid layout shifts
  loading: false,
};

export const $ratesStore = persistentMap<IRatesStore>(
  "rates-cache:",
  defaultRates,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);


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
        rates: rateSchema,
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
