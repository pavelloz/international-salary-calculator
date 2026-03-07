import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import numeric from '../numeric';

describe('numeric Valibot schema', () => {
    it('should parse valid numbers correctly', () => {
        expect(v.parse(numeric, 45000)).toBe(45000);
        expect(v.parse(numeric, 0)).toBe(0);
        expect(v.parse(numeric, -100)).toBe(-100);
    });

    it('should parse valid string numbers into numbers', () => {
        expect(v.parse(numeric, "45000")).toBe(45000);
        expect(v.parse(numeric, "26")).toBe(26);
        expect(v.parse(numeric, "-50")).toBe(-50);
    });

    it('should fall back to 0 for invalid strings', () => {
        expect(v.parse(numeric, "invalid")).toBe(0);
        expect(v.parse(numeric, "not_a_number")).toBe(0);
        expect(v.parse(numeric, "")).toBe(0);
    });

    it('should fall back to 0 for strings with leading letters', () => {
        // parseInt("abc10", 10) -> NaN -> 0
        expect(v.parse(numeric, "abc10")).toBe(0);
    });

    it('should ignore trailing non-numbers in string parsing, as parseInt does', () => {
        // parseInt("45abc", 10) -> 45
        expect(v.parse(numeric, "45abc")).toBe(45);
    });

    it('should optionally fall back to 0 for types outside string/number if parsed (based on fallback)', () => {
        expect(v.parse(numeric, null)).toBe(0);
        expect(v.parse(numeric, undefined)).toBe(0);
        expect(v.parse(numeric, {})).toBe(0);
    });
});
