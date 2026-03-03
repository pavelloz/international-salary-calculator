import * as v from "valibot";

const numericSchema = v.fallback(
    v.pipe(
        v.union([v.string(), v.number()]),
        v.transform((val) => {
            if (typeof val === "string") {
                const parsed = parseInt(val, 10);
                return isNaN(parsed) ? 0 : parsed;
            }
            return val;
        }),
        v.number()
    ),
    0
);


export default numericSchema;