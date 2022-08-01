export const config = {
  runtime: "experimental-edge",
};

const CURRENCIES = ["usd", "gbp", "eur", "chf"];
const API_URL =
  "https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json";

const round = (num) => parseFloat(num.toFixed(2));

export default async function handler(_req) {
  const data = await fetch(API_URL)
    .then((data) => data.json())
    .then((data) => data[0]?.rates)
    .then((rates) => {
      return rates.reduce((prev, cur) => {
        let { code, mid } = cur;
        code = code.toLowerCase();

        if (!CURRENCIES.includes(code)) return { ...prev };

        return { ...prev, [code]: round(mid) };
      }, {});
    })
    .then((data) => JSON.stringify(data));

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=0, s-maxage=3600, stale-while-revalidate",
    },
  });
}
