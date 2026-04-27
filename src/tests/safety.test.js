import { describe, it, expect, vi } from 'vitest';
import { getAssistantResponse } from '../utils/gemini';

// Mock fetch globally using Vitest stub
vi.stubGlobal('fetch', vi.fn());

describe('Assistant Safety and Policy', () => {
  it('should include NONPARTISAN in the system instructions', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Mock response" }] } }]
      })
    });

    await getAssistantResponse("Hello");

    const fetchArgs = fetch.mock.calls[0];
    const body = JSON.parse(fetchArgs[1].body);
    const systemPrompt = body.contents[0].parts[0].text;

    expect(systemPrompt).toContain('NONPARTISAN');
    expect(systemPrompt).toContain('JURISDICTION FIRST');
  });

  it('should handle API errors gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Server Error" })
    });

    const response = await getAssistantResponse("Hello");
    expect(response).toContain('Google Gemini is currently unavailable');
  });
});
