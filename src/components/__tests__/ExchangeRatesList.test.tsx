import { render, screen } from "@solidjs/testing-library";
import { $userInputStore } from "../../stores/userInput";
import { $ratesStore } from "../../stores/rates";
import ExchangeRatesList from "../ExchangeRatesList";
import { actions } from "astro:actions";

describe("ExchangeRatesList Component", () => {
  beforeEach(() => {
    // Mock the astro action to prevent "cannot destructure 'data' of undefined" error
    vi.mocked(actions.getRates).mockResolvedValue({
      data: { rates: { pln: 1, usd: 4.0, eur: 4.3, chf: 4.5, gbp: 5.1 } },
      error: undefined,
    });

    // Reset stores to default state before each test
    $userInputStore.set({
      salary: 30000,
      salaryMax: 0,
      currency: "usd",
      period: "monthly",
      daysOff: 0,
      paidDaysOff: 0,
      yearlyBonus: 0,
      benefits: 0,
      contractType: "all",
      isCreative: false,
      onlyUopForPaidDaysOff: false,
      onlyUopForYearlyBonus: false,
    });
    $ratesStore.set({
      rates: { pln: 1, usd: 4.0 },
      loading: false,
    });
  });

  test("renders exchange rate when currency is not PLN", () => {
    render(() => <ExchangeRatesList />);
    expect(screen.getByText("1 PLN = 4 USD")).toBeInTheDocument();
  });

  test("does not render component when currency is PLN", () => {
    $userInputStore.setKey("currency", "pln");
    expect(screen.queryByText(/1 PLN/i)).not.toBeInTheDocument();
  });

  test("does not render if rates are undefined or loading", () => {
    $ratesStore.set({
      rates: {},
      loading: true,
    });

    render(() => <ExchangeRatesList />);
    expect(screen.queryByText(/1 PLN/i)).not.toBeInTheDocument();
  });
});
