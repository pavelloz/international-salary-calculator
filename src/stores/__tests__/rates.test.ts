import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { $ratesStore, fetchRates } from '../rates';
import { cleanStores } from 'nanostores';
import { actions } from 'astro:actions';

describe('ratesStore', () => {
    beforeEach(() => {
        cleanStores($ratesStore);
        // Reset to initial state for each test
        $ratesStore.set({
            rates: {},
            goldPrice: 0,
            loading: false,
        });
        vi.clearAllMocks();
    });

    afterEach(() => {
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

        vi.mocked(actions.getRates).mockResolvedValue({
            data: mockData,
            error: undefined
        });

        await fetchRates();

        expect(actions.getRates).toHaveBeenCalled();
        expect($ratesStore.get()).toEqual({
            rates: { eur: 4.5, usd: 4.0, pln: 1 },
            goldPrice: 300,
            loading: false,
        });
    });

    it('should handle fetch failure gracefully', async () => {
        vi.mocked(actions.getRates).mockResolvedValue({
            data: undefined,
            error: new Error('Action failed') as any
        });

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        await fetchRates();

        expect($ratesStore.get().loading).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should not fetch if already loading', async () => {
        $ratesStore.setKey('loading', true);

        await fetchRates();

        expect(actions.getRates).not.toHaveBeenCalled();
    });

    it('should handle validation failure', async () => {
        // Return invalid data (missing required fields)
        vi.mocked(actions.getRates).mockResolvedValue({
            data: { invalidData: 'test' } as any,
            error: undefined
        });

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        await fetchRates();

        expect($ratesStore.get().loading).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
    });
});
