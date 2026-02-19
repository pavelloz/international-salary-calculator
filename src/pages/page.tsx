import { fetchRates } from "@/lib/fxRates";
import { fetchGoldPrice } from "@/lib/goldPrice";

import ErrorBoundary from "../components/ErrorBoundary";
import HomeClient from "./home-client";

export default async function HomePage() {
  const rates = await fetchRates();
  const goldPrice = await fetchGoldPrice();

  return (
    <ErrorBoundary>
      <HomeClient rates={rates} goldPrice={goldPrice} />
    </ErrorBoundary>
  );
}
