import {
  HOURS_PER_WEEK,
  WEEKS_PER_YEAR,
  HOURS_PER_DAY,
  MONTHS_PER_YEAR,
  WORKING_DAYS_PER_WEEK,
  GRAMS_IN_OUNCE,
} from "./constants";

const calculateSalaries = (inputSalary, period, rate) => {
  const salary = inputSalary * rate;
  let annual;

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
  }

  // 2. Derive other values from the Annual baseline
  return {
    yearly: Math.round(annual),
    monthly: Math.round(annual / MONTHS_PER_YEAR),
    daily: Math.round(annual / WEEKS_PER_YEAR / WORKING_DAYS_PER_WEEK),
    hourly: Number((annual / WEEKS_PER_YEAR / HOURS_PER_WEEK).toFixed(2)), // Keep decimals for hourly
  };
};

const formatSalary = (value) => {
  if (isNaN(value)) return null;

  return Math.round(value).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumSignificantDigits: 7,
  });
};

const formatInGold = (value) => {
  if (isNaN(value)) return null;

  return (value / GRAMS_IN_OUNCE).toFixed(2);
};

export { calculateSalaries, formatSalary, formatInGold };
