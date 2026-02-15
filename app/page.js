import { fetchRates } from "@/lib/fxRates";
import { fetchGoldPrice } from "@/lib/goldPrice";
import HomeClient from "./home-client";

export default async function HomePage() {
  const rates = await fetchRates();
  const goldPrice = await fetchGoldPrice();

  return <HomeClient rates={rates} goldPrice={goldPrice} />;
}
