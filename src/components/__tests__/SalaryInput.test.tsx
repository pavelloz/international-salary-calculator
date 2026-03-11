import { fireEvent, render, screen } from "@solidjs/testing-library";

import SalaryInput from "../SalaryInput";
import { $userInputStore, defaultUserInput } from "../../stores/userInput";
import { $ratesStore } from "../../stores/rates";

describe("SalaryInput Component", () => {
  beforeEach(() => {
    $userInputStore.set(defaultUserInput);
    $ratesStore.set({
      rates: { pln: 1, usd: 4, eur: 4.3, gbp: 5, chf: 4.5 },
      loading: false,
    });
  });
  test("renders input fields correctly", () => {
    render(() => <SalaryInput />);

    expect(screen.getByText(/salary in pln/i)).toBeInTheDocument();
    expect(screen.getByText("Unpaid days off / year")).toBeInTheDocument();
    expect(screen.getByText("Paid days off / year")).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument(); // Period
    expect(screen.getAllByRole("combobox")[1]).toBeInTheDocument(); // Currency

    expect(screen.getAllByRole("textbox")).toHaveLength(6); // salary, salaryMax, daysOff, paidDaysOff, yearlyBonus, benefits
    expect(screen.getAllByRole("checkbox")).toHaveLength(3); // isCreative (KUP), 2x Only UoP
  });

  test("has correct initial values", () => {
    render(() => <SalaryInput />);

    // Since it's monthly, we get min salary, max salary (auto-computed), daysOff, paidDaysOff
    const salaryInput = screen.getAllByRole("textbox")[0];
    const maxSalaryInput = screen.getAllByRole("textbox")[1];
    const daysOffInput = screen.getByLabelText("Unpaid days off / year");
    const paidDaysOffInput = screen.getByLabelText("Paid days off / year");
    const yearlyBonusInput = screen.getByLabelText("Yearly bonus (%)");

    expect(salaryInput).toHaveValue("30000");
    // store max starts undefined, but effect computes 1.2 * 30000 = 36000
    expect(maxSalaryInput).toHaveValue("36000");
    expect(daysOffInput).toHaveValue("0");
    expect(paidDaysOffInput).toHaveValue("0");
    expect(yearlyBonusInput).toHaveValue("0");
  });

  test("renders all period options", () => {
    render(() => <SalaryInput />);

    const periodSelect = screen.getAllByRole("combobox")[0];
    expect(periodSelect).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "Hourly" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Monthly" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Yearly" })).toBeInTheDocument();
  });

  test("renders all currency options", () => {
    render(() => <SalaryInput />);

    const currencySelect = screen.getAllByRole("combobox")[1];
    expect(currencySelect).toBeInTheDocument();

    expect(screen.getByText(/usd/i)).toBeInTheDocument();
    expect(screen.getByText(/eur/i)).toBeInTheDocument();
    expect(screen.getByText(/gbp/i)).toBeInTheDocument();
    expect(screen.getByText(/chf/i)).toBeInTheDocument();
  });

  test("updates salary value on input change", () => {
    render(() => <SalaryInput />);

    const salaryInput = screen.getAllByRole("textbox")[0];
    fireEvent.input(salaryInput, { target: { value: "10000" } });

    expect(salaryInput).toHaveValue("10000");
  });

  test("updates days off value on input change", () => {
    render(() => <SalaryInput />);

    const daysOffInput = screen.getByLabelText("Unpaid days off / year");
    fireEvent.input(daysOffInput, { target: { value: "20" } });

    expect(daysOffInput).toHaveValue("20");
  });

  test("strips non-numeric characters from salary input", () => {
    render(() => <SalaryInput />);

    const salaryInput = screen.getAllByRole("textbox")[0];
    fireEvent.input(salaryInput, { target: { value: "100abc00" } });

    expect(salaryInput).toHaveValue("10000");
  });

  test("strips non-numeric characters from days off input", () => {
    render(() => <SalaryInput />);

    const daysOffInput = screen.getByLabelText("Unpaid days off / year");
    fireEvent.input(daysOffInput, { target: { value: "20days" } });

    expect(daysOffInput).toHaveValue("20");
  });

  test("hides max amount when period is hourly", () => {
    $userInputStore.set({
      salary: 100,
      salaryMax: undefined,
      currency: "pln",
      period: "hourly",
      daysOff: 0,
    });
    render(() => <SalaryInput />);
    // hourly => no max salary
    expect(screen.getAllByRole("textbox")).toHaveLength(5); // salary, daysOff, paidDaysOff, yearlyBonus, benefits
    expect(screen.getAllByRole("checkbox")).toHaveLength(3); // isCreative KUP, 2x Only UoP
  });

  test("max amount resets to min amount if user inputs a smaller number and blurs", () => {
    $userInputStore.set({
      salary: 10000,
      salaryMax: 12000,
      currency: "pln",
      period: "monthly",
      daysOff: 0,
    });
    render(() => <SalaryInput />);

    const maxSalaryInput = screen.getAllByRole("textbox")[1];

    // User types 5000
    fireEvent.input(maxSalaryInput, { target: { value: "5000" } });
    expect(maxSalaryInput).toHaveValue("5000");

    // User blurs the input
    fireEvent.blur(maxSalaryInput);

    // It should snap back to 10000 (the min salary)
    expect(maxSalaryInput).toHaveValue("10000");
  });

  test("scales base and max proportionally when period changes", () => {
    $userInputStore.set({
      ...defaultUserInput,
      salary: 10000,
      salaryMax: 12000,
      currency: "pln",
      period: "monthly",
    });

    render(() => <SalaryInput />);

    const periodSelect = screen.getAllByRole("combobox")[0];

    // Switch from monthly to yearly
    fireEvent.change(periodSelect, { target: { value: "yearly" } });

    const inputs = screen.getAllByRole("textbox");
    // 10000 * 12 = 120000
    // 12000 * 12 = 144000
    expect(inputs[0]).toHaveValue("120000");
    expect(inputs[1]).toHaveValue("144000");
  });

  test("clamps max to min if scaling down loses precision heavily", () => {
    $userInputStore.set({
      ...defaultUserInput,
      salary: 10000,
      salaryMax: 10000, // exact same
      currency: "pln",
      period: "yearly",
    });

    render(() => <SalaryInput />);

    const periodSelect = screen.getAllByRole("combobox")[0];

    // Switch from yearly to monthly
    // 10000 / 12 = 833.33... -> 833
    fireEvent.change(periodSelect, { target: { value: "monthly" } });

    const inputs = screen.getAllByRole("textbox");

    // Both should be 833, max shouldn't somehow drop below 833 because of rounding logic
    expect(inputs[0]).toHaveValue("833");
    expect(inputs[1]).toHaveValue("833");
  });

  test("scales base and max proportionally when currency changes", () => {
    $userInputStore.set({
      ...defaultUserInput,
      salary: 10000, // USD
      salaryMax: 12000, // USD
      currency: "usd",
      period: "monthly",
    });

    render(() => <SalaryInput />);

    const currencySelect = screen.getAllByRole("combobox")[1]; // Currency is 2nd select

    // Switch from USD (rate 4) to PLN (rate 1)
    // 10000 USD is 40000 PLN
    fireEvent.change(currencySelect, { target: { value: "pln" } });

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("40000");
    expect(inputs[1]).toHaveValue("48000");
  });

  test("clamps max to min if finding currency rate loses precision heavily", () => {
    $userInputStore.set({
      ...defaultUserInput,
      salary: 10000, // USD
      salaryMax: 10000, // USD
      currency: "usd",
      period: "monthly",
    });

    render(() => <SalaryInput />);

    const currencySelect = screen.getAllByRole("combobox")[1];

    // Switch from USD (rate 4) to GBP (rate 5)
    // 10000 * 4 = 40000 PLN -> / 5 = 8000 GBP
    fireEvent.change(currencySelect, { target: { value: "gbp" } });

    const inputs = screen.getAllByRole("textbox");

    // Both should be 8000
    expect(inputs[0]).toHaveValue("8000");
    expect(inputs[1]).toHaveValue("8000");
  });

  test("clears max amount when input is emptied", () => {
    $userInputStore.set({
      ...defaultUserInput,
      salary: 10000,
      salaryMax: 12000,
      currency: "pln",
      period: "monthly",
    });

    render(() => <SalaryInput />);

    const maxSalaryInput = screen.getAllByRole("textbox")[1];
    fireEvent.input(maxSalaryInput, { target: { value: "" } });

    expect($userInputStore.get().salaryMax).toBeUndefined();
  });
});
