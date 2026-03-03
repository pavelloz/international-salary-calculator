import * as v from "valibot";

const userInputSchema = v.object({
    salary: v.number(),
    currency: v.string(),
    period: v.string(),
    daysOff: v.number(),
});

export default userInputSchema; 