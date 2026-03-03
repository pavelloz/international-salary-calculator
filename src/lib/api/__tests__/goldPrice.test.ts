import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fetchGoldPrice from '../goldPrice';

describe('fetchGoldPrice', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should fetch and return gold price successfully', async () => {
        const mockResponse = {
            ok: true,
            json: async () => [{
                data: '2023-10-27',
                cena: 250.5
            }]
        };
        vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

        const price = await fetchGoldPrice();

        expect(fetch).toHaveBeenCalledWith('https://api.nbp.pl/api/cenyzlota/?format=json');
        expect(price).toBe(250.5);
    });

    it('should throw an error if the response is not ok', async () => {
        const mockResponse = {
            ok: false,
        };
        vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await expect(fetchGoldPrice()).rejects.toThrow('Gold price API request failed');

        consoleSpy.mockRestore();
    });

    it('should throw an error if fetch fails', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

        // suppress console.error during this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await expect(fetchGoldPrice()).rejects.toThrow('Network error');

        consoleSpy.mockRestore();
    });
});
