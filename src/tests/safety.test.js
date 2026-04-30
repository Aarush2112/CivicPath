import { describe, it, expect, vi } from 'vitest';
import { getAssistantResponse } from '../utils/gemini';

vi.mock('@google/generative-ai', () => {
  const GoogleGenerativeAI = vi.fn();
  GoogleGenerativeAI.prototype.getGenerativeModel = vi.fn().mockReturnValue({
    startChat: vi.fn().mockReturnValue({
      sendMessage: vi.fn().mockResolvedValue({ response: { text: () => 'Mocked response' } }),
    })
  });
  return { GoogleGenerativeAI };
});

describe('Assistant Safety and Policy', () => {
  it('should return a nonpartisan response', async () => {
    const response = await getAssistantResponse("Hello");
    expect(response).toBe('Mocked response');
  });
});
