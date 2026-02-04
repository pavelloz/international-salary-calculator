export const runtime = 'edge'; 
export const preferredRegion = ['fra1', 'arn1', 'dub1'];

const CURRENCIES = ["usd", "gbp", "eur", "chf"];
const API_URL =
  "https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json";

const round = (num) => parseFloat(num.toFixed(2));

const fetchRates = async () => {
    try {
      const response = await fetch(API_URL);
      const [{ rates }] = await response.json(); // Destructuring assuming data[0] exists

      const filteredRates = rates.reduce((acc, { code, mid }) => {
        const lowerCode = code.toLowerCase();
        if (CURRENCIES.includes(lowerCode)) {
          acc[lowerCode] = round(mid);
        }
        return acc;
      }, {});

      return JSON.stringify(filteredRates);
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      return JSON.stringify({});
    }
}

export default async function handler(_req) {
  return new Response(await fetchRates(), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=0, s-maxage=3600, stale-while-revalidate",
    },
  });
}
