const API_URL = "https://api.nbp.pl/api/cenyzlota/?format=json";

export async function fetchGoldPrice() {
  try {
    const res = await fetch(API_URL, {
      next: {
        revalidate: 3600, // 1 hour
        tags: ["gold-price"],
      },
    });

    if (!res.ok) {
      throw new Error("Gold price API request failed");
    }

    const response = await res.json();

    return parseInt(response[0].cena, 10);
  } catch (error) {
    console.error("Error fetching gold price:", error);
    // Return fallback rates or throw
    throw error;
  }
}
