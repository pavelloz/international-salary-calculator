export const GRAMS_IN_OUNCE = 28.34952;
export const WORKING_DAYS_PER_YEAR = 260;
export const CALENDAR_DAYS_PER_YEAR = 365;
export const WORKING_DAYS_PER_WEEK = 5;
export const CALENDAR_DAYS_PER_WEEK = 7;
export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;
export const HOURS_PER_DAY = 8;
export const HOURS_PER_WEEK = 40;
export const WORKING_DAYS_PER_MONTH = 21;
export const CURRENCY_CONFIG = {
  pln: { flag: "🇵🇱", name: "PLN" },
  usd: { flag: "🇺🇸", name: "USD" },
  eur: { flag: "🇪🇺", name: "EUR" },
  gbp: { flag: "🇬🇧", name: "GBP" },
  chf: { flag: "🇨🇭", name: "CHF" },
};
export const CURRENCY_FLAGS = Object.fromEntries(Object.entries(CURRENCY_CONFIG).map(([key, val]) => [key, val.flag]));

export const CURRENCIES = Object.keys(CURRENCY_CONFIG);

export const PLN = { pln: 1 };

export const PERIOD_CONFIG = {
  hourly: "Hourly",
  monthly: "Monthly",
  yearly: "Yearly",
};
export const PERIOD_NAMES = PERIOD_CONFIG;
export const PERIODS = Object.keys(PERIOD_CONFIG);
