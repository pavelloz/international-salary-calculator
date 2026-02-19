import {
  HOURS_PER_WEEK,
  MONTHS_PER_YEAR,
  WEEKS_PER_YEAR,
  WORKING_DAYS_PER_WEEK,
  WORKING_DAYS_PER_YEAR,
} from "./constants";

export const deductDaysOff = (annualSalary: number, daysOff: number): number => {
  return annualSalary * (1 - daysOff / WORKING_DAYS_PER_YEAR);
};

export interface PeriodValues {
  yearly: number;
  monthly: number;
  daily: number;
  hourly: number;
}

export const convertToAllPeriods = (annualSalary: number): PeriodValues => {
  return {
    yearly: Math.round(annualSalary),
    monthly: Math.round(annualSalary / MONTHS_PER_YEAR),
    daily: Math.round(annualSalary / WEEKS_PER_YEAR / WORKING_DAYS_PER_WEEK),
    hourly: Number((annualSalary / WEEKS_PER_YEAR / HOURS_PER_WEEK).toFixed(2)),
  };
};
