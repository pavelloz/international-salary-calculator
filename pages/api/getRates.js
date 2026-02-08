export const runtime = "edge";

const CURRENCIES = ["usd", "gbp", "eur", "chf"];
const API_URL = process.env.FX_RATES_URL;

const fetchRates = async () => {
  let fetched_at = +new Date();
  const response = await fetch(API_URL);

  const [{ rates }] = await response.json(); // Destructuring assuming data[0] exists

  const filteredRates = rates.reduce((acc, { code, mid }) => {
    const lowerCode = code.toLowerCase();
    if (CURRENCIES.includes(lowerCode)) {
      acc[lowerCode] = parseFloat(mid.toFixed(2));
    }
    return acc;
  }, {});

  return JSON.stringify({ rates: filteredRates, fetched_at });
};

export default async function handler(_req) {
  try {
    const data = await fetchRates();
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=3600, s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        rates: {},
        fetched_at: +new Date(),
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
