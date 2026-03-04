import { fireEvent, render, screen } from "@solidjs/testing-library";

import SalaryInput from "../SalaryInput";
import { $userInputStore, defaultUserInput } from "../../stores/userInput";

describe("SalaryInput Component", () => {
  beforeEach(() => {
    $userInputStore.set(defaultUserInput);
  });

  test("renders input fields correctly", () => {
    render(() => <SalaryInput />);

    expect(screen.getByText(/salary in pln/i)).toBeInTheDocument();
    expect(screen.getByText(/days off per year/i)).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument(); // Period
    expect(screen.getAllByRole("combobox")[1]).toBeInTheDocument(); // Currency

    // Period is "monthly" by default so we should have 3 text inputs:
    // min salary, max salary, daysOff
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
  });

  test("has correct initial values", () => {
    render(() => <SalaryInput />);

    // Since it's monthly, we get min salary, max salary (auto-computed), daysOff
    const salaryInput = screen.getAllByRole("textbox")[0];
    const maxSalaryInput = screen.getAllByRole("textbox")[1];
    const daysOffInput = screen.getAllByRole("textbox")[2];

    expect(salaryInput).toHaveValue("30000");
    // store max starts undefined, but effect computes 1.2 * 30000 = 36000
    expect(maxSalaryInput).toHaveValue("36000");
    expect(daysOffInput).toHaveValue("0");
  });

  test("renders all period options", () => {
    render(() => <SalaryInput />);

    const periodSelect = screen.getAllByRole("combobox")[0];
    expect(periodSelect).toBeInTheDocument();

    expect(screen.getByText(/hourly/i)).toBeInTheDocument();
    expect(screen.getByText(/daily/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
    expect(screen.getByText(/yearly/i)).toBeInTheDocument();
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

    const daysOffInput = screen.getAllByRole("textbox")[2];
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

    const daysOffInput = screen.getAllByRole("textbox")[2];
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
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(2); // salary, daysoff
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
});
