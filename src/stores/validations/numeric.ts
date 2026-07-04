import * as v from "valibot";

/**
 * Validates that a value is a safe integer, falling back to 0 on failure.
 * Does NOT accept or parse strings — only strict numbers.
 */
const numericSchema = v.fallback(
  v.pipe(v.number(), v.integer("Value must be an integer"), v.minValue(0, "Value must be non-negative")),
  0
);

export default numericSchema;
