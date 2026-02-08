const getSocialSecurityRates = () => {
  return {
    flatTax: {
      baseAmount: 8200,
      retirement: 959.12,
      disability: 392.95,
      accident: 82.03,
      health: 381.81,
      laborFund: 0,
      total: 1815.91,
    },
    linear: {
      baseAmount: 8200.0,
      retirement: 1601.44,
      disability: 656.0,
      accident: 136.94,
      sickness: 410.0,
      health: 738.0,
      laborFund: 0,
      total: 3542.38,
    },
  };
};

export function calculateFlatTax12(monthlyRevenue) {
  const socialSecurity = getSocialSecurityRates().flatTax;

  if (monthlyRevenue <= 0) return 0;

  const socialSecurityTotal = socialSecurity.total;
  const socialContributions =
    socialSecurity.retirement +
    socialSecurity.disability +
    socialSecurity.accident;

  const taxBase = monthlyRevenue - socialContributions;
  const tax = Math.round(taxBase * 0.12);
  const monthlyNet = monthlyRevenue - socialSecurityTotal - tax;

  return {
    hourly: Math.round((monthlyNet / 168) * 100) / 100, // monthly / 168 hours
    daily: Math.round((monthlyNet / 20) * 100) / 100, // monthly / 20 days
    monthly: Math.round(monthlyNet * 100) / 100, // as is
    yearly: Math.round(monthlyNet * 12 * 100) / 100, // monthly × 12
  };
}

export function calculateLinearTax19(grossRevenue, options = {}) {
  const {
    costPercentage = 50, // percentage of revenue considered as costs (default 50%)
    includeSickness = true, // whether to include sickness insurance (optional)
    useBigZUS = false, // true = full base (Duży ZUS), false = Mały ZUS+
  } = options;

  const rates = getSocialSecurityRates();
  const socialSecurity = useBigZUS ? rates.linear : rates.linear; // same for now, adjust if needed

  const revenue = grossRevenue;
  const costs = Math.round(revenue * (costPercentage / 100));
  const income = revenue - costs;

  // Social contributions
  let socialContributions =
    socialSecurity.retirement +
    socialSecurity.disability +
    socialSecurity.accident;

  if (includeSickness) {
    socialContributions += socialSecurity.sickness;
  }

  // Tax base
  const taxBase = Math.max(0, revenue - costs - socialContributions);

  // Tax 19%
  const tax = Math.round(taxBase * 0.19);

  // Health insurance - 9% of income (revenue - costs)
  const healthInsurance = Math.max(
    Math.round(income * 0.09),
    381.81, // minimum
  );

  // Net
  const net = revenue - socialContributions - tax - healthInsurance;

  return net;
}
