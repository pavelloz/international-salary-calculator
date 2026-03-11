import { defineAction } from "astro:actions";
import fetchRates from "../lib/api/fxRates";

export const server = {
    getRates: defineAction({
        handler: async () => {
            const rates = await fetchRates();
            return { rates };
        }
    })
};
