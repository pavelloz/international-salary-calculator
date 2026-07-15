import { render, screen } from "@solidjs/testing-library";
import { $userInputStore } from "../../stores/userInput";
import { $ratesStore } from "../../stores/rates";
import SalaryOutput from "../SalaryOutput";

describe("SalaryOutput Component", () => {
  beforeEach(() => {
    $userInputStore.set({
      salary: 10000,
      salaryMax: 0,
      currency: "pln",
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
      rates: { pln: 1 },
      loading: false,
    });
  });

  test("renders table headers correctly", () => {
    render(() => <SalaryOutput />);
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();
  });

  test("renders gross salary", () => {
    render(() => <SalaryOutput />);
    expect(screen.getByText("Gross")).toBeInTheDocument();
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
      paidDaysOff: 0,
      yearlyBonus: 0,
      benefits: 0,
      contractType: "all",
      isCreative: false,
      onlyUopForPaidDaysOff: false,
      onlyUopForYearlyBonus: false,
    });
    render(() => <SalaryOutput />);
    const grossCell = screen.getAllByText(/Gross/i)[0].parentElement!;
    expect(grossCell.textContent).toMatch(/10K.*15K/);
  });

  test("shows days off cost only when daysOff > 0", () => {
    const { unmount } = render(() => <SalaryOutput />);
    expect(screen.queryByText("Days off cost")).not.toBeInTheDocument();
    unmount();

    $userInputStore.set({
      salary: 10000,
      salaryMax: 0,
      currency: "pln",
      period: "monthly",
      daysOff: 10,
      paidDaysOff: 0,
      yearlyBonus: 0,
      benefits: 0,
      contractType: "all",
      isCreative: false,
      onlyUopForPaidDaysOff: false,
      onlyUopForYearlyBonus: false,
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

    expect(row.textContent).toMatch(/-/);
  });
});
