const SocialSecurityRates = {
  flatTax: {
    TOTAL: 1788.29,
  },
  linear: {
    TOTAL: 1788.29,
    MIN_HEALTH_INSURANCE: 432.54,
  },
};

const getHealthInsuranceRateForFlatTax = (monthlyRevenue) => {
  const yearlyRevenue = monthlyRevenue * 12;

  if (yearlyRevenue < 60000) return 498.35;
  if (yearlyRevenue <= 300000) return 830.58;
  if (yearlyRevenue > 300000) return 1495.04;
};

function calculateZUSFlatTax12(monthlyRevenue) {
  const socialSecurity = SocialSecurityRates.flatTax.TOTAL;
  const healthInsurance = getHealthInsuranceRateForFlatTax(monthlyRevenue);

  return {
    socialSecurity,
    healthInsurance,
  };
}

export function calculateFlatTax12(monthlyRevenue) {
  const zus = calculateZUSFlatTax12(monthlyRevenue);
  const taxBase = monthlyRevenue - zus.socialSecurity - zus.healthInsurance / 2;
  const tax = Math.round(taxBase * 0.12, 2);
  const net = monthlyRevenue - zus.socialSecurity - zus.healthInsurance - tax;
  return {
    monthly: net,
    yearly: net * 12,
    daily: net / 21, // assuming 21 working days in a month
    hourly: net / (21 * 8), // assuming 8 working hours per day
  };
}

function calculateZUSLinear19(monthlyRevenue) {
  const costPercentage = 50;
  const costs = Math.round(monthlyRevenue * (costPercentage / 100));
  const income = monthlyRevenue - costs;

  const socialSecurity = SocialSecurityRates.linear.TOTAL;

  // Health insurance - 9% of income (revenue - costs)
  const healthInsurance = Math.max(
    Math.round(income * 0.09, 2),
    SocialSecurityRates.linear.MIN_HEALTH_INSURANCE,
  );

  return {
    socialSecurity,
    healthInsurance,
  };
}

export function calculateLineartax19(monthlyRevenue) {
  const zus = calculateZUSLinear19(monthlyRevenue);
  const taxBase = monthlyRevenue - zus.socialSecurity - zus.healthInsurance;
  const tax = Math.round(taxBase * 0.19, 2);
  const net = monthlyRevenue - zus.socialSecurity - zus.healthInsurance - tax;
  return {
    monthly: net,
    yearly: net * 12,
    daily: net / 21, // assuming 21 working days in a month
    hourly: net / (21 * 8), // assuming 8 working hours per day
  };
}
