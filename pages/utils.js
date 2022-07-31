import axios from "axios";

const getAPIUrl = (symbol) =>
  `https://api.nbp.pl/api/exchangerates/rates/c/${symbol}/last/1/?format=json`;

const CURRENCIES = ["usd", "gbp", "eur", "chf"];

export async function getExchangeRates() {
  console.clear();
  const url =
    "http://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json";

  const JSONdata = await axios.get(url).then((res) => res.data?.[0]?.rates);
  const mainRates = JSONdata.reduce((prev, cur) => {
    if (!CURRENCIES.includes(cur.code.toLowerCase())) return { ...prev };
    let { code, mid } = cur;
    return { ...prev, [code.toLowerCase()]: parseFloat(mid.toFixed(3)) };
  }, {});
  return mainRates;
}

export function getExchangeRate(symbol) {
  const url = getAPIUrl(symbol);

  return fetch(url).then((data) => data.json());
}
