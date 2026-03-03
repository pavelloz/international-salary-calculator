import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '../index';
import fetchRates from '../../lib/api/fxRates';
import fetchGoldPrice from '../../lib/api/goldPrice';

vi.mock('astro:actions', () => ({
    defineAction: vi.fn((config) => config),
}));

vi.mock('../../lib/api/fxRates', () => ({
    default: vi.fn(),
}));

vi.mock('../../lib/api/goldPrice', () => ({
    default: vi.fn(),
}));

describe('server actions - getRates', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call fetchRates and fetchGoldPrice and combine their results', async () => {
        const mockRates = { usd: 4.0, eur: 4.5 };
        const mockGoldPrice = 300.5;

        vi.mocked(fetchRates).mockResolvedValue(mockRates);
        vi.mocked(fetchGoldPrice).mockResolvedValue(mockGoldPrice);

        // Since we mocked defineAction to return the config directly,
        // server.getRates has a handler method.
        const result = await (server.getRates as any).handler();

        expect(fetchRates).toHaveBeenCalled();
        expect(fetchGoldPrice).toHaveBeenCalled();
        expect(result).toEqual({ rates: mockRates, goldPrice: mockGoldPrice });
    });
});
