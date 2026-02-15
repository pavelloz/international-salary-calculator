import {
  MONTHS_PER_YEAR,
  WORKING_DAYS_PER_MONTH,
  HOURS_PER_DAY,
} from "./constants";

// Tax rates
const FLAT_TAX_RATE = 0.12; // 12%
const LINEAR_TAX_RATE = 0.19; // 19%
const BUSINESS_COST_PERCENTAGE = 0.5; // 50% of revenue
const HEALTH_INSURANCE_PERCENTAGE = 0.09; // 9% of income

// ZUS (Social Security) amounts - monthly
const ZUS_FLAT_TAX_SOCIAL_SECURITY = 1788.29;
const ZUS_LINEAR_TAX_SOCIAL_SECURITY = 1788.29;
const ZUS_LINEAR_TAX_MIN_HEALTH_INSURANCE = 432.54;

// Health insurance rates for flat tax - monthly (based on yearly revenue)
const ZUS_FLAT_TAX_HEALTH_INSURANCE = {
  LOW: {
    maxYearlyRevenue: 60000,
    monthlyRate: 498.35,
  },
  MEDIUM: {
    maxYearlyRevenue: 300000,
    monthlyRate: 830.58,
  },
  HIGH: {
    monthlyRate: 1495.04,
  },
};

// Health insurance deductibility for flat tax
const ZUS_FLAT_TAX_HEALTH_INSURANCE_DEDUCTIBLE_PERCENTAGE = 0.5; // 50%

const getHealthInsuranceRateForFlatTax = (monthlyRevenue) => {
  const yearlyRevenue = monthlyRevenue * MONTHS_PER_YEAR;

  if (yearlyRevenue < ZUS_FLAT_TAX_HEALTH_INSURANCE.LOW.maxYearlyRevenue) {
    return ZUS_FLAT_TAX_HEALTH_INSURANCE.LOW.monthlyRate;
  }
  if (yearlyRevenue <= ZUS_FLAT_TAX_HEALTH_INSURANCE.MEDIUM.maxYearlyRevenue) {
    return ZUS_FLAT_TAX_HEALTH_INSURANCE.MEDIUM.monthlyRate;
  }
  return ZUS_FLAT_TAX_HEALTH_INSURANCE.HIGH.monthlyRate;
};

function calculateZUSFlatTax12(monthlyRevenue) {
  const socialSecurity = ZUS_FLAT_TAX_SOCIAL_SECURITY;
  const healthInsurance = getHealthInsuranceRateForFlatTax(monthlyRevenue);

  return {
    socialSecurity,
    healthInsurance,
  };
}

export function calculateFlatTax12(monthlyRevenue) {
  const zus = calculateZUSFlatTax12(monthlyRevenue);
  const taxBase =
    monthlyRevenue -
    zus.socialSecurity -
    zus.healthInsurance * ZUS_FLAT_TAX_HEALTH_INSURANCE_DEDUCTIBLE_PERCENTAGE;
  const tax = Math.round(taxBase * FLAT_TAX_RATE, 2);
  const net = monthlyRevenue - zus.socialSecurity - zus.healthInsurance - tax;
  return {
    monthly: net,
    yearly: net * MONTHS_PER_YEAR,
    daily: net / WORKING_DAYS_PER_MONTH,
    hourly: net / (WORKING_DAYS_PER_MONTH * HOURS_PER_DAY),
  };
}

function calculateZUSLinear19(monthlyRevenue) {
  const costs = Math.round(monthlyRevenue * BUSINESS_COST_PERCENTAGE);
  const income = monthlyRevenue - costs;

  const socialSecurity = ZUS_LINEAR_TAX_SOCIAL_SECURITY;

  // Health insurance - 9% of income (revenue - costs)
  const healthInsurance = Math.max(
    Math.round(income * HEALTH_INSURANCE_PERCENTAGE, 2),
    ZUS_LINEAR_TAX_MIN_HEALTH_INSURANCE,
  );

  return {
    socialSecurity,
    healthInsurance,
  };
}

export function calculateLineartax19(monthlyRevenue) {
  const zus = calculateZUSLinear19(monthlyRevenue);
  const taxBase = monthlyRevenue - zus.socialSecurity - zus.healthInsurance;
  const tax = Math.round(taxBase * LINEAR_TAX_RATE, 2);
  const net = monthlyRevenue - zus.socialSecurity - zus.healthInsurance - tax;
  return {
    monthly: net,
    yearly: net * MONTHS_PER_YEAR,
    daily: net / WORKING_DAYS_PER_MONTH,
    hourly: net / (WORKING_DAYS_PER_MONTH * HOURS_PER_DAY),
  };
}
