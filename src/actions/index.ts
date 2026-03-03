import { defineAction } from "astro:actions";
import fetchRates from "../lib/api/fxRates";
import fetchGoldPrice from "../lib/api/goldPrice";

export const server = {
    getRates: defineAction({
        handler: async () => {
            const [rates, goldPrice] = await Promise.all([
                fetchRates(),
                fetchGoldPrice()
            ]);
            return { rates, goldPrice };
        }
    })
};
