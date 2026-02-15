import { fetchRates } from "@/lib/fx-rates";
import HomeClient from "./home-client";

export default async function HomePage() {
  const rates = await fetchRates();

  return <HomeClient rates={rates} />;
}
