const CURRENCIES = ["usd", "gbp", "eur", "chf"];
const API_URL =
  "https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json";

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

export async function fetchRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: 3600, // 1 hour
        tags: ["fx-rates"],
      },
    });

    if (!res.ok) {
      throw new Error("FX API request failed");
    }

    const [{ rates }] = (await res.json()) as TApiResponse[]; // Destructuring assuming data[0] exists

    const filteredRates = rates.reduce(
      (acc: Record<string, number>, { code, mid }: TSingleRateResponse) => {
        const lowerCode = code.toLowerCase();
        if (CURRENCIES.includes(lowerCode)) {
          acc[lowerCode] = mid;
        }

        return acc;
      },
      {},
    );

    return filteredRates;
  } catch (error) {
    console.error("Error fetching FX rates:", error);
    // Return fallback rates or throw
    throw error;
  }
}
