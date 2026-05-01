import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getElectionInfo, getRepresentativeInfo } from '../utils/civicApi';

global.fetch = vi.fn();
global.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};

describe('Civic API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.getItem.mockReturnValue(null);
  });

  it('should fetch election info correctly (address -> voterInfo mapping)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        election: { name: '2026 Midterms' },
        pollingLocations: [{ address: { locationName: 'Main Library' } }]
      })
    });

    const data = await getElectionInfo('1600 Amphitheatre Pkwy');
    expect(data.election.name).toBe('2026 Midterms');
    expect(data.pollingLocations[0].address.locationName).toBe('Main Library');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('voterinfo'));
  });

  it('should handle empty results gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        election: { name: '2026 Midterms' },
        pollingLocations: [] 
      })
    });

    const data = await getElectionInfo('Unknown Address');
    expect(data.pollingLocations).toHaveLength(0);
  });

  it('should fetch representative info correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        offices: [{ name: 'Governor' }],
        officials: [{ name: 'Jane Smith' }]
      })
    });

    const data = await getRepresentativeInfo('California');
    expect(data.offices[0].name).toBe('Governor');
    expect(data.officials[0].name).toBe('Jane Smith');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('representatives'));
  });

  it('should use cached data if available', async () => {
    sessionStorage.getItem.mockReturnValue(JSON.stringify({ cached: true }));

    const data = await getElectionInfo('1600 Amphitheatre Pkwy');
    expect(data.cached).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });
});
