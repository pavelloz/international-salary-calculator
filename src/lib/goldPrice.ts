const API_URL = "https://api.nbp.pl/api/cenyzlota/?format=json";

type TGoldPrice = { data: string; cena: number };

export default async (): Promise<number> => {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Gold price API request failed");
    }

    const response = (await res.json()) as TGoldPrice[];

    return response[0].cena;
  } catch (error) {
    console.error("Error fetching gold price:", error);
    throw error;
  }
};
