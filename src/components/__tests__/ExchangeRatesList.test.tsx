import { render, screen } from "@solidjs/testing-library";
import { $userInputStore } from "../../stores/userInput";
import { $ratesStore } from "../../stores/rates";
import ExchangeRatesList from "../ExchangeRatesList";

describe("ExchangeRatesList Component", () => {
  beforeEach(() => {
    // Reset stores to default state before each test
    $userInputStore.set({
      salary: 30000,
      currency: "usd",
      period: "monthly",
      daysOff: 0,
    });

    $ratesStore.set({
      rates: { pln: 1, usd: 4.0 }, // 1 USD = 4 PLN mock
      goldPrice: 10000,
      loading: false,
    });
  });

  test("renders exchange rate when currency is not PLN", () => {
    render(() => <ExchangeRatesList />);
    // Testing the exact output format: "1 PLN = X CURRENCY"
    // Since our mock ratesStore dictates 1 USD = 4 PLN for calculating *into* PLN
    // The component actually renders `rateStore().rates[usd]` directly
    expect(screen.getByText("1 PLN = 4 USD")).toBeInTheDocument();
  });

  test("does not render component when currency is PLN", () => {
    $userInputStore.setKey("currency", "pln");
    const { container } = render(() => <ExchangeRatesList />);

    // The `<Show when={userInput().currency !== "pln"}>` should evaluate to false
    // ensuring the container only holds the wrapping div but nothing inside.
    expect(screen.queryByText(/1 PLN/i)).not.toBeInTheDocument();
  });

  test("does not render if rates are undefined or loading", () => {
    $ratesStore.set({
      rates: {},
      goldPrice: 10000,
      loading: true,
    });

    render(() => <ExchangeRatesList />);
    expect(screen.queryByText(/1 PLN/i)).not.toBeInTheDocument();
  });
});
