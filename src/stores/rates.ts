import { persistentMap } from "@nanostores/persistent";
import * as v from "valibot";
import { actions } from "astro:actions";
import { PLN } from "../lib/constants";

export const rateSchema = v.record(v.string(), v.number());
export type TRate = v.InferOutput<typeof rateSchema>;

export const ratesStoreSchema = v.object({
  rates: rateSchema,
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
    const { data: actionData, error } = await actions.getRates();
    if (error) {
      throw new Error(`Action returned error: ${error.message}`);
    }

    // Validate the API response
    const data = v.parse(
      v.object({
        rates: rateSchema,
      }),
      actionData
    );

    $ratesStore.set({
      rates: { ...data.rates, ...PLN },
      loading: false,
    });
  } catch (e) {
    $ratesStore.setKey("loading", false);
    console.warn("Rates fetch or validation failed, using cached fallback data if available.", e);
  }
}
