import fetchRates, { clearRatesCache } from '../fxRates';

describe('fetchRates', () => {
  const MOCK_RATES = {
    ok: true,
    json: async () => [{
      rates: [
        { code: 'USD', mid: 4.0 },
        { code: 'EUR', mid: 4.5 },
        { code: 'GBP', mid: 4.8 },
        { code: 'CHF', mid: 4.6 },
        { code: 'PLN', mid: 1 },
        { code: 'XYZ', mid: 1.0 },
      ]
    }]
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    clearRatesCache(); // each test starts with empty cache
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('must throw if response not ok and no cache', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(fetchRates()).rejects.toThrow('FX API request failed');
    consoleSpy.mockRestore();
  });

  it('must throw if fetch fails and no cache', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(fetchRates()).rejects.toThrow('Network error');
    consoleSpy.mockRestore();
  });

  it('must fetch and filter rates successfully', async () => {
    vi.mocked(fetch).mockResolvedValue(MOCK_RATES as Response);

    const rates = await fetchRates();

    expect(fetch).toHaveBeenCalledWith('https://api.nbp.pl/api/exchangerates/tables/a/last/1/?format=json');
    expect(rates).toEqual({ usd: 4.0, gbp: 4.8, eur: 4.5, chf: 4.6 });
  });

  it('must serve cached data within TTL without fetching', async () => {
    vi.mocked(fetch).mockResolvedValue(MOCK_RATES as Response);
    const first = await fetchRates();
    expect(first).toEqual({ usd: 4.0, gbp: 4.8, eur: 4.5, chf: 4.6 });
    expect(fetch).toHaveBeenCalledTimes(1);

    const second = await fetchRates();
    expect(second).toEqual({ usd: 4.0, gbp: 4.8, eur: 4.5, chf: 4.6 });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('must return stale cached data when fetch fails but cache exists', async () => {
    // First call populates cache
    vi.mocked(fetch).mockResolvedValue(MOCK_RATES as Response);
    await fetchRates();
    expect(fetch).toHaveBeenCalledTimes(1);

    // Force a re-fetch but make it fail — should return stale cached data
    vi.mocked(fetch).mockRejectedValue(new Error('NBP timeout'));
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await fetchRates(true); // forceFresh = true

    expect(result).toEqual({ usd: 4.0, gbp: 4.8, eur: 4.5, chf: 4.6 });
    expect(fetch).toHaveBeenCalledTimes(2); // one fresh fetch, one failed re-fetch
    consoleSpy.mockRestore();
  });
});
