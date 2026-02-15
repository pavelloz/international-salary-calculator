// Time constants
export const WORKING_DAYS_PER_YEAR = 260; // 52 weeks * 5 days per week
export const CALENDAR_DAYS_PER_YEAR = 365;
export const WORKING_DAYS_PER_WEEK = 5;
export const CALENDAR_DAYS_PER_WEEK = 7;
export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;
export const HOURS_PER_DAY = 8;
export const HOURS_PER_WEEK = 40;
export const WORKING_DAYS_PER_MONTH = 21; // Approximate: 260 / 12

// Currency configuration - single source of truth
export const CURRENCY_CONFIG = {
  usd: { flag: "🇺🇸", name: "USD" }, // United States
  eur: { flag: "🇪🇺", name: "EUR" }, // European Union
  gbp: { flag: "🇬🇧", name: "GBP" }, // United Kingdom
  chf: { flag: "🇨🇭", name: "CHF" }, // Switzerland
};

export const CURRENCIES = Object.keys(CURRENCY_CONFIG);

export const CURRENCY_FLAGS = Object.fromEntries(
  Object.entries(CURRENCY_CONFIG).map(([key, val]) => [key, val.flag]),
);

// Period types - single source of truth
export const PERIOD_CONFIG = {
  hourly: "Hourly",
  daily: "Daily",
  monthly: "Monthly",
  yearly: "Yearly",
};

export const PERIODS = Object.keys(PERIOD_CONFIG);

export const PERIOD_NAMES = PERIOD_CONFIG;
