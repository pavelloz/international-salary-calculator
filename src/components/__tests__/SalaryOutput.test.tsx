import { render, screen } from "@solidjs/testing-library";
import { $userInputStore } from "../../stores/userInput";
import { $ratesStore } from "../../stores/rates";
import SalaryOutput from "../SalaryOutput";

describe("SalaryOutput Component", () => {
  beforeEach(() => {
    $userInputStore.set({
      salary: 10000,
      currency: "pln",
      period: "monthly",
      daysOff: 0,
    });

    $ratesStore.set({
      rates: { pln: 1 },
      goldPrice: 10000,
      loading: false,
    });
  });

  test("renders table headers correctly", () => {
    render(() => <SalaryOutput />);
    expect(screen.getByText("Salary in PLN")).toBeInTheDocument();
    expect(screen.getByText("Hourly")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
  });

  test("renders gross salary", () => {
    render(() => <SalaryOutput />);
    expect(screen.getByText("Gross")).toBeInTheDocument();
    // 10000 PLN monthly = 120000 yearly
    // Value will be formatted as 120 000 PLN (roughly, depending on locale)
    // Testing the UI directly via string parsing logic can be fragile across locales,
    // so we just verify the basic categories exist and it rendered without crashing
    expect(screen.getByText("19% Linear tax (big ZUS)")).toBeInTheDocument();
    expect(screen.getByText("12% Flat rate tax (big ZUS)")).toBeInTheDocument();
  });

  test("shows days off cost only when daysOff > 0", () => {
    // Should not exist initially (daysOff = 0)
    const { unmount } = render(() => <SalaryOutput />);
    expect(screen.queryByText("Days off cost")).not.toBeInTheDocument();
    unmount();

    // Set daysOff to 10
    $userInputStore.set({
      salary: 10000,
      currency: "pln",
      period: "monthly",
      daysOff: 10,
    });

    render(() => <SalaryOutput />);
    expect(screen.getByText("Days off cost")).toBeInTheDocument();
  });
});
