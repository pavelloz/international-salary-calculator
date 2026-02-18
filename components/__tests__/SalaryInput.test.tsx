import { render, screen, fireEvent } from "@testing-library/react";
import SalaryInput from "../SalaryInput";

describe("SalaryInput Component", () => {
  test("renders input fields correctly", () => {
    render(<SalaryInput />);

    expect(screen.getByText(/salary in foreign currency/i)).toBeInTheDocument();
    expect(screen.getByText(/days off per year/i)).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[1]).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[0]).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[1]).toBeInTheDocument();
  });

  test("has correct initial values", () => {
    render(<SalaryInput />);

    const salaryInput = screen.getAllByRole("textbox")[0];
    const daysOffInput = screen.getAllByRole("textbox")[1];

    expect(salaryInput).toHaveValue("10000");
    expect(daysOffInput).toHaveValue("0");
  });

  test("renders all period options", () => {
    render(<SalaryInput />);

    const periodSelect = screen.getAllByRole("combobox")[0];
    expect(periodSelect).toBeInTheDocument();

    expect(screen.getByText(/hourly/i)).toBeInTheDocument();
    expect(screen.getByText(/daily/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
    expect(screen.getByText(/yearly/i)).toBeInTheDocument();
  });

  test("renders all currency options", () => {
    render(<SalaryInput />);

    const currencySelect = screen.getAllByRole("combobox")[1];
    expect(currencySelect).toBeInTheDocument();

    expect(screen.getByText(/usd/i)).toBeInTheDocument();
    expect(screen.getByText(/eur/i)).toBeInTheDocument();
    expect(screen.getByText(/gbp/i)).toBeInTheDocument();
    expect(screen.getByText(/chf/i)).toBeInTheDocument();
  });

  test("updates salary value on input change", () => {
    render(<SalaryInput />);

    const salaryInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(salaryInput, { target: { value: "10000" } });

    expect(salaryInput).toHaveValue("10000");
  });

  test("updates days off value on input change", () => {
    render(<SalaryInput />);

    const daysOffInput = screen.getAllByRole("textbox")[1];
    fireEvent.change(daysOffInput, { target: { value: "20" } });

    expect(daysOffInput).toHaveValue("20");
  });
});
