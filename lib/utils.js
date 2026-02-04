import axios from "axios";

import { cache } from 'react'
 
export const revalidate = 3600 // revalidate the data at most every hour

export const getExchangeRates = cache(async () => {
  return await axios("/api/getRates", {
    method: "get",
    headers: {
      Accept: "application/json",
    },
  }).then((res) => res.data);
})
