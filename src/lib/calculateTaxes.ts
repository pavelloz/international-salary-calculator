import { HOURS_PER_DAY, MONTHS_PER_YEAR, WORKING_DAYS_PER_MONTH } from "./constants";

// Tax rates
const FLAT_TAX_RATE = 0.12; // 12%
const LINEAR_TAX_RATE = 0.19; // 19%

// Default B2B Costs (Koszty uzyskania przychodu).
// In IT, B2B programmers usually have low costs (e.g. accounting ~250 PLN/mo), but for simplicity in a calculator prioritizing Revenue -> Net, we assume 0 default unless specified.
// 50% is for Creative Works (autorskie koszty), not standard B2B.
const BUSINESS_COST_PERCENTAGE = 0;
const HEALTH_INSURANCE_PERCENTAGE = 0.09; // 9% of income

// ZUS (Social Security) amounts - monthly
const ZUS_FLAT_TAX_SOCIAL_SECURITY = 1788.29;
const ZUS_LINEAR_TAX_SOCIAL_SECURITY = 1788.29;
const ZUS_LINEAR_TAX_MIN_HEALTH_INSURANCE = 432.54;

// Health insurance rates for flat tax - monthly (based on yearly revenue)
// Note: Linear tax health insurance is 4.9% of income. Flat tax uses fixed amounts.
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

// Linear Tax allows deducting Health Insurance from the tax base up to a yearly limit.
// For 2026, the limit is 14,100 PLN.
const LINEAR_TAX_HEALTH_DEDUCTION_LIMIT = 14100;

export function calculateLineartax19(monthlyRevenue: number): TaxValues {
  let yearlyNet = 0;
  let cumulativeHealthDeduction = 0;

  for (let month = 1; month <= 12; month++) {
    const zus = calculateZUSLinear19(monthlyRevenue);

    // In actual Polish law, ZUS social security and FP are deducted from Income.
    // Income = Revenue - Costs
    const costs = Math.round(monthlyRevenue * BUSINESS_COST_PERCENTAGE);
    const income = monthlyRevenue - costs;

    // Linear tax health insurance is 4.9% of (Income - ZUS Social).
    // The previous implementation used 9% (HEALTH_INSURANCE_PERCENTAGE) which is only for Flat Tax / UOP.
    const healthInsuranceBase = income - zus.socialSecurity;
    const healthInsurance = Math.max(
      Math.round(healthInsuranceBase * 0.049), // 4.9% for Linear
      ZUS_LINEAR_TAX_MIN_HEALTH_INSURANCE
    );

    // Limit Health Insurance deduction from tax base
    const maxDeductible = LINEAR_TAX_HEALTH_DEDUCTION_LIMIT - cumulativeHealthDeduction;
    const deductibleHealth = Math.min(healthInsurance, Math.max(0, maxDeductible));
    cumulativeHealthDeduction += deductibleHealth;

    // Tax base is Income - ZUS Social - Deductible Health
    let taxBase = income - zus.socialSecurity - deductibleHealth;
    if (taxBase < 0) taxBase = 0;
    taxBase = Math.round(taxBase);

    const tax = Math.round(taxBase * LINEAR_TAX_RATE);
    // In standard Polish calculators, "Net in pocket" for B2B = Revenue - ZUS - Health - Tax.
    const net = monthlyRevenue - zus.socialSecurity - healthInsurance - tax;
    yearlyNet += net;
  }

  const avgMonthlyNet = yearlyNet / MONTHS_PER_YEAR;

  return {
    monthly: avgMonthlyNet,
    yearly: yearlyNet,
    hourly: avgMonthlyNet / (WORKING_DAYS_PER_MONTH * HOURS_PER_DAY),
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
const KUP_LIMIT = 120890;

export function calculateEmploymentContract(monthlyGross: number, isCreative: boolean = false): TaxValues {
  let yearlyNet = 0;
  let cumulativeGrossForZus = 0;
  let cumulativeTaxBase = 0;
  let cumulativeKup = 0;

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
    const basisForKup = monthlyGross - totalZus;
    let appliedKup = INCOME_DEDUCTIBLE_EXPENSES;

    if (isCreative) {
      let creativeKup = basisForKup * 0.5;
      
      if (cumulativeKup + creativeKup > KUP_LIMIT) {
        creativeKup = Math.max(0, KUP_LIMIT - cumulativeKup);
      }
      cumulativeKup += creativeKup;
      
      if (creativeKup > 0) {
        appliedKup = creativeKup;
      }
    }

    let taxBaseMonth = Math.round(basisForKup - appliedKup);
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
