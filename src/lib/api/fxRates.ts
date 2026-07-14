interface CacheEntry {
  data: Record<string, number>;
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 3 minutes — NBP updates rates once per business day, but cache brief for freshness

const CURRENCIES = ["usd", "gbp", "eur", "chf"];
const API_URL = "https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json";

interface TSingleRateResponse {
  currency: string;
  code: string;
  mid: number;
}

interface TApiResponse {
  table: string;
  no: string;
  effectiveDate: string;
  rates: TSingleRateResponse[];
}

export default async (forceFresh = false): Promise<Record<string, number>> => {
  const now = Date.now();

  // Serve from cache if fresh enough and not forced
  if (!forceFresh && cache && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("FX API request failed");
    }

    const [{ rates }] = (await res.json()) as TApiResponse[];

    const filteredRates = rates.reduce((acc: Record<string, number>, { code, mid }: TSingleRateResponse) => {
      const lowerCode = code.toLowerCase();
      if (CURRENCIES.includes(lowerCode)) {
        acc[lowerCode] = mid;
      }

      return acc;
    }, {});

    // Update cache on every successful fetch
    cache = { data: filteredRates, timestamp: now };

    return filteredRates;
  } catch (error) {
    // Stale-while-revalidate: serve cached data on failure
    if (cache) {
      console.warn(
        "FX API fetch failed, serving cached data (stale age: " + Math.round((now - cache.timestamp) / 60000) + "m)"
      );
      return cache.data;
    }

    console.error("Error fetching FX rates (no cache available):", error);
    throw error;
  }
};

/** Reset the in-memory cache — useful for testing */
export function clearRatesCache() {
  cache = null;
}
