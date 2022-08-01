export const config = {
  runtime: "experimental-edge",
};

const CURRENCIES = ["usd", "gbp", "eur", "chf"];

export default async function handler(_req, res) {
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

  res.setHeader("Cache-Control", "max-age=0, s-maxage=3600");
  res.setHeader("Content-Type", "application/json");

  return res.status(200).json(data);
}
