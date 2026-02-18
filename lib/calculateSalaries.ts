import {
  HOURS_PER_WEEK,
  WEEKS_PER_YEAR,
  HOURS_PER_DAY,
  MONTHS_PER_YEAR,
  WORKING_DAYS_PER_WEEK,
  GRAMS_IN_OUNCE,
} from "./constants";

interface SalaryValues {
  yearly: number;
  monthly: number;
  daily: number;
  hourly: number;
}

const calculateSalaries = (
  inputSalary: number,
  period: string,
  rate: number,
): SalaryValues => {
  const salary = inputSalary * rate;
  let annual: number;

  // 1. Convert any input to a standard Annual Salary first
  switch (period) {
    case "hourly":
      annual = salary * HOURS_PER_WEEK * WEEKS_PER_YEAR;
      break;
    case "daily":
      annual = (salary / HOURS_PER_DAY) * HOURS_PER_WEEK * WEEKS_PER_YEAR;
      break;
    case "monthly":
      annual = salary * MONTHS_PER_YEAR;
      break;
    case "yearly":
      annual = salary;
      break;
    default:
      annual = salary;
  }

  // 2. Derive other values from the Annual baseline
  const yearly = Math.round(annual);
  const monthly = Math.round(annual / MONTHS_PER_YEAR);
  const daily = Math.round(annual / WEEKS_PER_YEAR / WORKING_DAYS_PER_WEEK);
  const hourly = Number((annual / WEEKS_PER_YEAR / HOURS_PER_WEEK).toFixed(2));

  return { yearly, monthly, daily, hourly };
};

const formatSalary = (value: number | null): string | null => {
  if (value === null || isNaN(value)) return null;

  return Math.round(value).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumSignificantDigits: 7,
  });
};

const formatInGold = (value: number | null): string | null => {
  if (value === null || isNaN(value)) return null;

  return (value / GRAMS_IN_OUNCE).toFixed(2);
};

export { calculateSalaries, formatSalary, formatInGold };
