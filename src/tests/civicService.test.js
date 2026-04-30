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

  it('should fetch election info correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ election: { name: '2026 Midterms' } })
    });

    const data = await getElectionInfo('1600 Amphitheatre Pkwy');
    expect(data.election.name).toBe('2026 Midterms');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should use cached data if available', async () => {
    sessionStorage.getItem.mockReturnValue(JSON.stringify({ election: { name: 'Cached Election' } }));

    const data = await getElectionInfo('1600 Amphitheatre Pkwy');
    expect(data.election.name).toBe('Cached Election');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should fetch representative info correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ officials: [{ name: 'John Doe' }] })
    });

    const data = await getRepresentativeInfo('1600 Amphitheatre Pkwy');
    expect(data.officials[0].name).toBe('John Doe');
  });
});
