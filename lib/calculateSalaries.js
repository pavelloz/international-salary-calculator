const calculateSalaries = (inputSalary, period, rate) => {
  const salary = inputSalary * rate;
  let annual;

  // 1. Convert any input to a standard Annual Salary first
  switch (period) {
    case "hourly":
      annual = salary * 40 * 52;
      break;
    case "daily":
      annual = (salary / 8) * 40 * 52;
      break;
    case "monthly":
      annual = salary * 12;
      break;
    case "yearly":
      annual = salary;
      break;
  }

  // 2. Derive other values from the Annual baseline
  return {
    yearly: Math.round(annual),
    monthly: Math.round(annual / 12),
    daily: Math.round(annual / 52 / 5), // Assumes 5-day week
    hourly: Number((annual / 52 / 40).toFixed(2)), // Keep decimals for hourly
  };
};

const calculateB2BRyczalt = (inputSalary, rate = 12) => {
  return inputSalary * rate;
};

const formatSalary = (value) => {
  if (isNaN(value)) return null;

  return Math.round(value).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumSignificantDigits: 7,
  });
};

export { calculateSalaries, formatSalary, calculateB2BRyczalt };
