import { fetchRates } from "@/lib/fx-rates";
import { fetchGoldPrice } from "@/lib/gold-price";
import HomeClient from "./home-client";

export default async function HomePage() {
  const rates = await fetchRates();
  const goldPrice = await fetchGoldPrice();

  return <HomeClient rates={rates} goldPrice={goldPrice} />;
}
