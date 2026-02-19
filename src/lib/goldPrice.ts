const API_URL = "https://api.nbp.pl/api/cenyzlota/?format=json";

type TGoldPrice = { data: string; cena: number };

export async function fetchGoldPrice(): Promise<number> {
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

    const response = (await res.json()) as TGoldPrice[];

    return response[0].cena;
  } catch (error) {
    console.error("Error fetching gold price:", error);
    // Return fallback rates or throw
    throw error;
  }
}
