import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAssistantResponse } from '../utils/gemini';
import { getRepresentativeInfo, getElectionInfo, generateCalendarLink } from '../utils/civicApi';

describe('Google Services Integration', () => {
  beforeEach(() => {
    // Reset mocks before each test
    globalThis.fetch = vi.fn();
    console.error = vi.fn(); // Suppress expected errors in console
  });

  describe('Google Calendar Integration', () => {
    it('should generate a valid Google Calendar event URL', () => {
      const title = "Election Day";
      const date = "2026-11-03";
      const description = "Don't forget to vote!";
      
      const url = generateCalendarLink(title, date, description);
      
      expect(url).toContain('https://www.google.com/calendar/render');
      expect(url).toContain('action=TEMPLATE');
      expect(url).toContain(encodeURIComponent(title));
      expect(url).toContain('20261103');
    });
  });

  describe('Google Gemini API', () => {
    it('should call the local /api/gemini proxy instead of Google directly', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ candidates: [{ content: { parts: [{ text: "Test Response" }] } }] })
      });

      await getAssistantResponse("Hello");
      
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/gemini', expect.any(Object));
      expect(globalThis.fetch).not.toHaveBeenCalledWith(expect.stringContaining('googleapis.com'), expect.any(Object));
    });

    it('should gracefully handle Gemini service unavailability', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal Server Error" })
      });

      const response = await getAssistantResponse("Hello");
      
      expect(response).toContain("Google Gemini is currently unavailable");
      expect(response).toContain("verify official election information with your local election office");
    });
  });

  describe('Google Civic Information API', () => {
    it('should call local /api/civic/representatives proxy', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ offices: [], officials: [] })
      });

      await getRepresentativeInfo("123 Test St");
      
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/civic/representatives', expect.any(Object));
      expect(globalThis.fetch).not.toHaveBeenCalledWith(expect.stringContaining('googleapis.com'), expect.any(Object));
    });

    it('should call local /api/civic/voterinfo proxy', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ pollingLocations: [] })
      });

      await getElectionInfo("123 Test St");
      
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/civic/voterinfo', expect.any(Object));
      expect(globalThis.fetch).not.toHaveBeenCalledWith(expect.stringContaining('googleapis.com'), expect.any(Object));
    });

    it('should gracefully handle Civic API service unavailability', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal Server Error" })
      });

      await expect(getRepresentativeInfo("123 Test St")).rejects.toThrow(/Google service is currently unavailable/);
    });
  });
});
