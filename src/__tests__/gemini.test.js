import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAssistantResponse } from '../utils/gemini';

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('should send chat history correctly via fetch', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Mocked response" }] } }]
      })
    });

    const history = [
      { sender: 'user', text: 'Hi' },
      { sender: 'bot', text: 'Hello' }
    ];
    await getAssistantResponse('How are you?', history);
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = global.fetch.mock.calls[0];
    expect(fetchArgs[0]).toBe('/api/gemini');
    
    const reqBody = JSON.parse(fetchArgs[1].body);
    // history length + system prompt + ack + current query
    expect(reqBody.contents.length).toBeGreaterThan(2);
    
    // The current query should be the last item
    const lastItem = reqBody.contents[reqBody.contents.length - 1];
    expect(lastItem.parts[0].text).toBe('How are you?');
  });

  it('should handle simulated streaming chunks correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Mocked streaming response" }] } }]
      })
    });

    let streamedText = '';
    const response = await getAssistantResponse('Hello', [], null, (chunk) => {
      streamedText = chunk;
    });
    
    // Since our simulate streaming appends space
    expect(streamedText.trim()).toBe('Mocked streaming response');
    expect(response.trim()).toBe('Mocked streaming response');
  });

  it('should return fallback message when API fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    const response = await getAssistantResponse('Hello');
    expect(response).toContain("I'm having trouble connecting to my AI core");
  });
});
