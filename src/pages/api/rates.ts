import type { APIRoute } from "astro";

import fetchRates from "../../lib/fxRates";
import fetchGoldPrice from "../../lib/goldPrice";

export const GET: APIRoute = async () => {
  try {
    const rates = await fetchRates();
    const goldPrice = await fetchGoldPrice();

    return new Response(JSON.stringify({ rates, goldPrice }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching FX rates:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
  }
};
