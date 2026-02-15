import {
  WORKING_DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
  WORKING_DAYS_PER_WEEK,
  HOURS_PER_WEEK,
  MONTHS_PER_YEAR,
} from "./constants";

const deductDaysOff = (annualSalary, daysOff) => {
  return annualSalary * (1 - daysOff / WORKING_DAYS_PER_YEAR);
};

const convertToAllPeriods = (annualSalary) => {
  return {
    yearly: Math.round(annualSalary),
    monthly: Math.round(annualSalary / MONTHS_PER_YEAR),
    daily: Math.round(annualSalary / WEEKS_PER_YEAR / WORKING_DAYS_PER_WEEK),
    hourly: Number((annualSalary / WEEKS_PER_YEAR / HOURS_PER_WEEK).toFixed(2)),
  };
};

export { deductDaysOff, convertToAllPeriods };
