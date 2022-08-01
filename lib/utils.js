import axios from "axios";

export async function getExchangeRates() {
  return await axios("/api/getRates", {
    method: "get",
    headers: {
      Accept: "application/json",
    },
  }).then((res) => res.data);
}
