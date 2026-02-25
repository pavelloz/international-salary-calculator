import type { APIRoute } from "astro";

export const prerender = false;

import fetchRates from "../../lib/api/fxRates";
import fetchGoldPrice from "../../lib/api/goldPrice";

export const GET: APIRoute = async () => {
  try {
    const rates = await fetchRates();
    const goldPrice = await fetchGoldPrice();

    return new Response(JSON.stringify({ rates, goldPrice }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching FX rates:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
  }
};
