import * as v from "valibot";

const userInputSchema = v.object({
    salary: v.number(),
    salaryMax: v.optional(v.number()),
    currency: v.string(),
    period: v.string(),
    daysOff: v.number(),
    paidDaysOff: v.optional(v.number()),
    yearlyBonus: v.optional(v.number()),
    benefits: v.optional(v.number()),
    contractType: v.optional(v.string()),
    isCreative: v.optional(v.boolean()),
});

export default userInputSchema;