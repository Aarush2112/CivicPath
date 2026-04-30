import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAssistantResponse } from '../utils/gemini';
import { getRepresentativeInfo, getElectionInfo, geocodeAddress } from '../utils/civicApi';

vi.mock('@google/generative-ai', () => {
  const GoogleGenerativeAI = vi.fn();
  GoogleGenerativeAI.prototype.getGenerativeModel = vi.fn().mockReturnValue({
    startChat: vi.fn().mockReturnValue({
      sendMessage: vi.fn().mockResolvedValue({ response: { text: () => 'Mocked response' } }),
    })
  });
  return { GoogleGenerativeAI };
});



describe('Google Services Integration', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
    globalThis.sessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    };
  });

  describe('Google Gemini API (SDK)', () => {
    it('should return a valid assistant response via SDK', async () => {
      const response = await getAssistantResponse("Hello");
      expect(response).toBe('Mocked response');
    });
  });

  describe('Google Civic Information API (Direct)', () => {
    it('should call Google Civic API directly with API key', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ officials: [] })
      });

      await getRepresentativeInfo("123 Test St");
      
      expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('googleapis.com/civicinfo'));
    });

    it('should fetch voter information directly', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ pollingLocations: [] })
      });

      await getElectionInfo("123 Test St");
      
      expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('voterinfo'));
    });
  });

  describe('Google Maps Integration', () => {
    it('should geocode an address to lat/lng', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'OK', results: [{ geometry: { location: { lat: 10, lng: 20 } } }] })
      });

      const coords = await geocodeAddress("123 Test St");
      expect(coords).toEqual({ lat: 10, lng: 20 });
    });
  });
});

