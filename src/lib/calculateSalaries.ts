import {
  GRAMS_IN_OUNCE,
  HOURS_PER_WEEK,
  MONTHS_PER_YEAR,
  WEEKS_PER_YEAR,
} from "./constants";

interface SalaryValues {
  yearly: number;
  monthly: number;
  hourly: number;
}

const convertToAnnual = (salary: number, period: string): number => {
  switch (period) {
    case "hourly":
      return salary * HOURS_PER_WEEK * WEEKS_PER_YEAR;
    case "monthly":
      return salary * MONTHS_PER_YEAR;
    case "yearly":
      return salary;
    default:
      return salary;
  }
};

const convertSalaryPeriod = (salary: number, fromPeriod: string, toPeriod: string): number => {
  const annual = convertToAnnual(salary, fromPeriod);

  switch (toPeriod) {
    case "hourly":
      return Number((annual / WEEKS_PER_YEAR / HOURS_PER_WEEK).toFixed(2));
    case "monthly":
      return Math.round(annual / MONTHS_PER_YEAR);
    case "yearly":
      return Math.round(annual);
    default:
      return Math.round(annual);
  }
};

const convertSalaryCurrency = (salary: number, oldRate: number, newRate: number): number => {
  if (oldRate === 0 || newRate === 0) return salary;
  // salary * oldRate = value in PLN
  // value in PLN / newRate = salary in new currency
  return Math.round((salary * oldRate) / newRate);
};

const calculateSalaries = (inputSalary: number, period: string, rate: number): SalaryValues => {
  const salary = inputSalary * rate;
  const annual = convertToAnnual(salary, period);

  // 2. Derive other values from the Annual baseline
  const yearly = Math.round(annual);
  const monthly = Math.round(annual / MONTHS_PER_YEAR);
  const hourly = Number((annual / WEEKS_PER_YEAR / HOURS_PER_WEEK).toFixed(2));

  return { yearly, monthly, hourly };
};

const formatSalary = (value: number | null): string | null => {
  if (value === null || isNaN(value)) return null;

  return Math.round(value).toLocaleString("pl-PL", {
    // style: "currency",
    // currency: "PLN",
    maximumSignificantDigits: 7,
  });
};

const formatInGold = (value: number | null): string | null => {
  if (value === null || isNaN(value)) return null;

  return (value / GRAMS_IN_OUNCE).toFixed(2);
};

const formatCompactSalary = (value: number | null): string | null => {
  if (value === null || isNaN(value)) return null;

  const formatted = Math.round(value).toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return formatted
};

export { calculateSalaries, formatInGold, formatSalary, formatCompactSalary, convertToAnnual, convertSalaryPeriod, convertSalaryCurrency };
