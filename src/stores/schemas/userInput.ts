import * as v from "valibot";

/**
 * User input schema for salary calculator.
 *
 * All numeric fields use v.fallback(v.number(), 0) to default to 0
 * when the stored value is undefined/null (e.g., from old cached data).
 * This ensures clean `number` types — no `undefined | number` unions.
 */
const userInputSchema = v.object({
  salary: v.fallback(v.number(), 0),
  salaryMax: v.fallback(v.number(), 0),
  currency: v.string(),
  period: v.string(),
  daysOff: v.fallback(v.number(), 0),
  paidDaysOff: v.fallback(v.number(), 0),
  yearlyBonus: v.fallback(v.number(), 0),
  benefits: v.fallback(v.number(), 0),
  contractType: v.fallback(v.string(), "all"),
  isCreative: v.fallback(v.boolean(), false),
  onlyUopForPaidDaysOff: v.fallback(v.boolean(), false),
  onlyUopForYearlyBonus: v.fallback(v.boolean(), false),
});

export default userInputSchema;
