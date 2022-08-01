export const config = {
  runtime: "experimental-edge",
};

const CURRENCIES = ["usd", "gbp", "eur", "chf"];

export default async function handler(_req) {
  const url =
    "https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json";

  const data = await fetch(url)
    .then((data) => data.json())
    .then((data) => data[0]?.rates)
    .then((rates) => {
      const output = rates.reduce((prev, cur) => {
        if (!CURRENCIES.includes(cur.code.toLowerCase())) return { ...prev };
        let { code, mid } = cur;
        return { ...prev, [code.toLowerCase()]: parseFloat(mid.toFixed(3)) };
      }, {});
      return output;
    });

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=0, s-maxage=3600, stale-while-revalidate",
    },
  });
}
