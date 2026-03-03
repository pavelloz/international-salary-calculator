import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import userInputSchema from '../userInput';

describe('userInputSchema Valibot schema', () => {
    it('should successfully parse a valid object', () => {
        const validData = {
            salary: 30000,
            currency: "pln",
            period: "monthly",
            daysOff: 26,
        };
        const result = v.parse(userInputSchema, validData);
        expect(result).toEqual(validData);
    });

    it('should fail if required fields are missing', () => {
        const invalidData = {
            salary: 30000,
            currency: "pln",
            // missing period and daysOff
        };

        expect(() => v.parse(userInputSchema, invalidData)).toThrow(v.ValiError);
    });

    it('should fail if types are incorrect', () => {
        const invalidData = {
            salary: "30000", // should be a number, but userInputSchema is strict (no fallback inside it)
            currency: 123,   // should be a string
            period: "monthly",
            daysOff: 26,
        };

        expect(() => v.parse(userInputSchema, invalidData)).toThrow(v.ValiError);
    });
});
