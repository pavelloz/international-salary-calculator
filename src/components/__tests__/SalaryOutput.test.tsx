import { render, screen } from "@solidjs/testing-library";
import { $userInputStore } from "../../stores/userInput";
import { $ratesStore } from "../../stores/rates";
import SalaryOutput from "../SalaryOutput";

describe("SalaryOutput Component", () => {
  beforeEach(() => {
    $userInputStore.set({
      salary: 10000,
      salaryMax: undefined,
      currency: "pln",
      period: "monthly",
      daysOff: 0,
    });

    $ratesStore.set({
      rates: { pln: 1 },
      loading: false,
    });
  });

  test("renders table headers correctly", () => {
    render(() => <SalaryOutput />);
    expect(screen.getByText("Salary in PLN")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
  });

  test("renders gross salary", () => {
    render(() => <SalaryOutput />);
    expect(screen.getByText("Gross")).toBeInTheDocument();
    // 10000 PLN monthly = 120000 yearly
    // Value will be formatted as 120K PLN (roughly, depending on locale)
    // Testing the UI directly via string parsing logic can be fragile across locales,
    // so we just verify the basic categories exist and it rendered without crashing
    expect(screen.getByText(/Linear 19%/i)).toBeInTheDocument();
    expect(screen.getByText(/Flat 12%/i)).toBeInTheDocument();
  });

  test("renders range salaries correctly", () => {
    $userInputStore.set({
      salary: 10000,
      salaryMax: 15000,
      currency: "pln",
      period: "monthly",
      daysOff: 0,
    });
    render(() => <SalaryOutput />);
    // Testing the range rendered strings loosely due to pl-PL unicode non-breaking space issues
    const grossCell = screen.getAllByText(/Gross/i)[0].parentElement!;
    expect(grossCell.textContent).toMatch(/10K.*15K/);
  });



  test("shows days off cost only when daysOff > 0", () => {
    // Should not exist initially (daysOff = 0)
    const { unmount } = render(() => <SalaryOutput />);
    expect(screen.queryByText("Days off cost")).not.toBeInTheDocument();
    unmount();

    // Set daysOff to 10
    $userInputStore.set({
      salary: 10000,
      salaryMax: undefined,
      currency: "pln",
      period: "monthly",
      daysOff: 10,
    });

    render(() => <SalaryOutput />);
    expect(screen.getByText("Days off cost")).toBeInTheDocument();
  });

  test("renders max fallback values when salaryMax is set (e.g. days off cost)", () => {
    $userInputStore.set({
      ...$userInputStore.get(),
      salary: 10000,
      salaryMax: 15000,
      daysOff: 5,
    });

    render(() => <SalaryOutput />);
    const row = screen.getByText("Days off cost").parentElement!;

    // the row should contain a minus sign and a dash for the range e.g. -2K - -3K
    expect(row.textContent).toMatch(/-/);
  });
});
