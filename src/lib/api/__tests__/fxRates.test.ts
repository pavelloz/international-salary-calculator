import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fetchRates from '../fxRates';

describe('fetchRates', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should fetch and filter rates successfully', async () => {
        const mockResponse = {
            ok: true,
            json: async () => [{
                rates: [
                    { code: 'USD', mid: 4.0 },
                    { code: 'EUR', mid: 4.5 },
                    { code: 'CHF', mid: 4.6 },
                    { code: 'XYZ', mid: 1.0 }, // Should be filtered out
                ]
            }]
        };
        vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

        const rates = await fetchRates();

        expect(fetch).toHaveBeenCalledWith('https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json');
        expect(rates).toEqual({
            usd: 4.0,
            eur: 4.5,
            chf: 4.6,
        });
        expect(rates.xyz).toBeUndefined();
    });

    it('should throw an error if the response is not ok', async () => {
        const mockResponse = {
            ok: false,
        };
        vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await expect(fetchRates()).rejects.toThrow('FX API request failed');

        consoleSpy.mockRestore();
    });

    it('should throw an error if fetch fails', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

        // suppress console.error during this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await expect(fetchRates()).rejects.toThrow('Network error');

        consoleSpy.mockRestore();
    });
});
