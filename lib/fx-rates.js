const CURRENCIES = ["usd", "gbp", "eur", "chf"];
const API_URL =
  "https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json";

export async function fetchRates() {
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

    const [{ rates }] = await res.json(); // Destructuring assuming data[0] exists

    const filteredRates = rates.reduce((acc, { code, mid }) => {
      const lowerCode = code.toLowerCase();
      if (CURRENCIES.includes(lowerCode)) {
        acc[lowerCode] = parseFloat(mid.toFixed(2));
      }

      return acc;
    }, {});

    return filteredRates;
  } catch (error) {
    console.error("Error fetching FX rates:", error);
    // Return fallback rates or throw
    throw error;
  }
}
