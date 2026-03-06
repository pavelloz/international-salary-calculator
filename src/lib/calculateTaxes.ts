import { HOURS_PER_DAY, MONTHS_PER_YEAR, WORKING_DAYS_PER_MONTH } from "./constants";

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
interface HealthInsuranceRate {
  maxYearlyRevenue?: number;
  monthlyRate: number;
}

const ZUS_FLAT_TAX_HEALTH_INSURANCE: Record<string, HealthInsuranceRate> = {
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

const getHealthInsuranceRateForFlatTax = (monthlyRevenue: number): number => {
  const yearlyRevenue = monthlyRevenue * MONTHS_PER_YEAR;

  if (yearlyRevenue < ZUS_FLAT_TAX_HEALTH_INSURANCE.LOW.maxYearlyRevenue!) {
    return ZUS_FLAT_TAX_HEALTH_INSURANCE.LOW.monthlyRate;
  }
  if (yearlyRevenue <= ZUS_FLAT_TAX_HEALTH_INSURANCE.MEDIUM.maxYearlyRevenue!) {
    return ZUS_FLAT_TAX_HEALTH_INSURANCE.MEDIUM.monthlyRate;
  }
  return ZUS_FLAT_TAX_HEALTH_INSURANCE.HIGH.monthlyRate;
};

interface ZUSValues {
  socialSecurity: number;
  healthInsurance: number;
}

function calculateZUSFlatTax12(monthlyRevenue: number): ZUSValues {
  const socialSecurity = ZUS_FLAT_TAX_SOCIAL_SECURITY;
  const healthInsurance = getHealthInsuranceRateForFlatTax(monthlyRevenue);

  return {
    socialSecurity,
    healthInsurance,
  };
}

export interface TaxValues {
  monthly: number;
  yearly: number;
  hourly: number;
}

export function calculateFlatTax12(monthlyRevenue: number): TaxValues {
  const zus = calculateZUSFlatTax12(monthlyRevenue);
  const taxBase =
    monthlyRevenue - zus.socialSecurity - zus.healthInsurance * ZUS_FLAT_TAX_HEALTH_INSURANCE_DEDUCTIBLE_PERCENTAGE;
  const tax = Math.round(taxBase * FLAT_TAX_RATE);
  const net = monthlyRevenue - zus.socialSecurity - zus.healthInsurance - tax;
  return {
    monthly: net,
    yearly: net * MONTHS_PER_YEAR,
    hourly: net / (WORKING_DAYS_PER_MONTH * HOURS_PER_DAY),
  };
}

function calculateZUSLinear19(monthlyRevenue: number): ZUSValues {
  const costs = Math.round(monthlyRevenue * BUSINESS_COST_PERCENTAGE);
  const income = monthlyRevenue - costs;

  const socialSecurity = ZUS_LINEAR_TAX_SOCIAL_SECURITY;

  // Health insurance - 9% of income (revenue - costs)
  const healthInsurance = Math.max(
    Math.round(income * HEALTH_INSURANCE_PERCENTAGE),
    ZUS_LINEAR_TAX_MIN_HEALTH_INSURANCE
  );

  return {
    socialSecurity,
    healthInsurance,
  };
}

export function calculateLineartax19(monthlyRevenue: number): TaxValues {
  const zus = calculateZUSLinear19(monthlyRevenue);
  const taxBase = monthlyRevenue - zus.socialSecurity - zus.healthInsurance;
  const tax = Math.round(taxBase * LINEAR_TAX_RATE);
  const net = monthlyRevenue - zus.socialSecurity - zus.healthInsurance - tax;
  return {
    monthly: net,
    yearly: net * MONTHS_PER_YEAR,
    hourly: net / (WORKING_DAYS_PER_MONTH * HOURS_PER_DAY),
  };
}

// Employment Contract (Umowa o pracę)
// 2026 Rules & Deductions based on user data:
// - ZUS Pension: 9.76% of Gross
// - ZUS Disability: 1.5% of Gross
// - ZUS Sickness: 2.45% of Gross
//   * Note: Some calculators cap sickness along with pension/disability to 30x average salary limit.
//     We follow the user's reference which drops ALL ZUS to 0 after the limit is reached.
// - ZUS Annual Limit: ~282,600 PLN (from 2026 projections)
// - Health Insurance: 9% of (Gross - ZUS)
// - Tax Cost Deductions (Income Deductible Expenses): 250 PLN monthly
// - Tax-free advance amount (Tax Reducing Amount): 300 PLN monthly
// - Progressive Tax Brackets: 12% up to 120,000 PLN, 32% above 120,000 PLN.

const EMPLOYMENT_TAX_FREE_ALLOWANCE = 30000;
const EMPLOYMENT_TAX_BRACKET_1_LIMIT = 120000;
const EMPLOYMENT_TAX_RATE_1 = 0.12;
const EMPLOYMENT_TAX_RATE_2 = 0.32;
const ZUS_PENSION_RATE = 0.0976;
const ZUS_DISABILITY_RATE = 0.015;
const ZUS_SICKNESS_RATE = 0.0245;
const ZUS_HEALTH_INSURANCE_RATE = 0.09;

const ZUS_ANNUAL_LIMIT = 282600;
const INCOME_DEDUCTIBLE_EXPENSES = 250;
const TAX_REDUCING_AMOUNT = 300;

export function calculateEmploymentContract(monthlyGross: number): TaxValues {
  let yearlyNet = 0;
  let cumulativeGrossForZus = 0;
  let cumulativeTaxBase = 0;

  for (let month = 1; month <= 12; month++) {
    // 1. ZUS (Social Security) limits
    let zusBase = monthlyGross;

    if (cumulativeGrossForZus + monthlyGross > ZUS_ANNUAL_LIMIT) {
      if (cumulativeGrossForZus < ZUS_ANNUAL_LIMIT) {
        zusBase = ZUS_ANNUAL_LIMIT - cumulativeGrossForZus;
      } else {
        zusBase = 0;
      }
    }

    const pension = zusBase * ZUS_PENSION_RATE;
    const disability = zusBase * ZUS_DISABILITY_RATE;
    // Mirorring reference calculator: capping sickness too when limits reached.
    const sickness = zusBase * ZUS_SICKNESS_RATE;

    const totalZus = pension + disability + sickness;
    cumulativeGrossForZus += monthlyGross;

    // 2. Health Insurance
    const healthBase = monthlyGross - totalZus;
    const healthInsurance = healthBase * ZUS_HEALTH_INSURANCE_RATE;

    // 3. Tax Base
    let taxBaseMonth = Math.round(monthlyGross - totalZus - INCOME_DEDUCTIBLE_EXPENSES);
    if (taxBaseMonth < 0) taxBaseMonth = 0;

    let tax = 0;
    const previousCumulativeTaxBase = cumulativeTaxBase;
    cumulativeTaxBase += taxBaseMonth;

    if (cumulativeTaxBase <= EMPLOYMENT_TAX_BRACKET_1_LIMIT) {
      tax = taxBaseMonth * EMPLOYMENT_TAX_RATE_1;
    } else {
      if (previousCumulativeTaxBase < EMPLOYMENT_TAX_BRACKET_1_LIMIT) {
        // Crossed the bracket this month
        const amountAt12 = EMPLOYMENT_TAX_BRACKET_1_LIMIT - previousCumulativeTaxBase;
        const amountAt32 = taxBaseMonth - amountAt12;
        tax = (amountAt12 * EMPLOYMENT_TAX_RATE_1) + (amountAt32 * EMPLOYMENT_TAX_RATE_2);
      } else {
        // Fully in 32% bracket
        tax = taxBaseMonth * EMPLOYMENT_TAX_RATE_2;
      }
    }

    // Apply tax reduction and round to nearest integer 
    tax -= TAX_REDUCING_AMOUNT;
    tax = Math.max(0, Math.round(tax));

    const net = monthlyGross - totalZus - healthInsurance - tax;
    yearlyNet += net;
  }

  const averageMonthlyNet = yearlyNet / MONTHS_PER_YEAR;

  return {
    monthly: averageMonthlyNet,
    yearly: yearlyNet,
    hourly: averageMonthlyNet / (WORKING_DAYS_PER_MONTH * HOURS_PER_DAY),
  };
}
