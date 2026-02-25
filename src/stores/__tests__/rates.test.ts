import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { $ratesStore, fetchRates } from '../rates';
import { cleanStores } from 'nanostores';

const globalFetch = globalThis.fetch;

describe('ratesStore', () => {
    beforeEach(() => {
        cleanStores($ratesStore);
        // Reset to initial state for each test
        $ratesStore.set({
            rates: {},
            goldPrice: 0,
            loading: false,
        });
    });

    afterEach(() => {
        globalThis.fetch = globalFetch;
        vi.restoreAllMocks();
    });

    it('should have correct initial state', () => {
        expect($ratesStore.get()).toEqual({
            rates: {},
            goldPrice: 0,
            loading: false,
        });
    });

    it('should fetch rates and update store on success', async () => {
        const mockData = {
            rates: { eur: 4.5, usd: 4.0 },
            goldPrice: 300,
        };

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        await fetchRates();

        expect(globalThis.fetch).toHaveBeenCalledWith('/api/rates.json');
        expect($ratesStore.get()).toEqual({
            rates: { eur: 4.5, usd: 4.0, pln: 1 },
            goldPrice: 300,
            loading: false,
        });
    });

    it('should handle fetch failure gracefully', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500
        });

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        await fetchRates();

        expect($ratesStore.get().loading).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should not fetch if already loading', async () => {
        $ratesStore.setKey('loading', true);
        globalThis.fetch = vi.fn();

        await fetchRates();

        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('should handle validation failure', async () => {
        // Return invalid data (missing required fields)
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ invalidData: 'test' })
        });

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        await fetchRates();

        expect($ratesStore.get().loading).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
    });
});
