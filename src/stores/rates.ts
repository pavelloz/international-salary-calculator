import { map } from "nanostores";

export type TRate = Record<string, number>;

interface IRatesStore {
  rates: TRate;
  goldPrice: number;
  loading: boolean;
}

export const $ratesStore = map<IRatesStore>({
  rates: {},
  goldPrice: 0,
  loading: false,
});

const PLN = { pln: 1 };

export async function fetchRates() {
  if ($ratesStore.get().loading) return;

  $ratesStore.setKey("loading", true);

  try {
    const res = await fetch("/api/rates", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await res.json();

    $ratesStore.set({
      rates: { ...data.rates, ...PLN },
      goldPrice: data.goldPrice,
      loading: false,
    });
  } catch (e) {
    $ratesStore.setKey("loading", false);
    console.error("Rates fetch failed", e);
  }
}
