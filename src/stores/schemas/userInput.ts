import * as v from "valibot";

const userInputSchema = v.object({
    salary: v.number(),
    salaryMax: v.optional(v.number()),
    currency: v.string(),
    period: v.string(),
    daysOff: v.number(),
    paidDaysOff: v.optional(v.number()),
});

export default userInputSchema; 