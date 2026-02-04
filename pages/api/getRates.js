const isDev = false //process.env.NODE_ENV === 'development';

export const runtime = 'edge'; 
export const preferredRegion = ['fra1', 'arn1', 'dub1'];

const CURRENCIES = ["usd", "gbp", "eur", "chf"];
const API_URL =
  "https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json";

const fetchRates = async () => {
  let fetched_at = +new Date(); 
    try {
      const response = await fetch(API_URL)

      const [{ rates }] = await response.json(); // Destructuring assuming data[0] exists

      const filteredRates = rates.reduce((acc, { code, mid }) => {
        const lowerCode = code.toLowerCase();
        if (CURRENCIES.includes(lowerCode)) {
          acc[lowerCode] = parseFloat(mid.toFixed(2));
        }
        return acc;
      }, {});

      return JSON.stringify({
        rates: filteredRates,
        fetched_at,
      });
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      return JSON.stringify({
        rates: {},
        fetched_at,
      });
    }
}

export default async function handler(_req) {
  const cachingHeader = isDev ? {} : { "Cache-Control": "max-age=3600, s-maxage=86400, stale-while-revalidate" } // cache response to not hammer the API
  return new Response(await fetchRates(), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...cachingHeader
    },
  });
}
