import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAssistantResponse } from '../utils/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

const { mockStartChat, mockGetGenerativeModel } = vi.hoisted(() => {
  const mockStartChat = vi.fn().mockReturnValue({
    sendMessage: vi.fn().mockResolvedValue({ response: { text: () => 'Mocked response' } }),
    sendMessageStream: vi.fn().mockResolvedValue({
      stream: (async function* () {
        yield { text: () => 'Mocked ' };
        yield { text: () => 'streaming ' };
        yield { text: () => 'response' };
      })()
    })
  });
  return {
    mockStartChat,
    mockGetGenerativeModel: vi.fn().mockReturnValue({ startChat: mockStartChat })
  };
});

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function() {
      return { getGenerativeModel: mockGetGenerativeModel };
    })
  };
});

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send chat history correctly', async () => {
    const history = [
      { sender: 'user', text: 'Hi' },
      { sender: 'bot', text: 'Hello' }
    ];
    await getAssistantResponse('How are you?', history);
    
    const chatOptions = mockStartChat.mock.calls[0][0];
    
    expect(chatOptions.history).toHaveLength(2);
    expect(chatOptions.history[0].role).toBe('user');
    expect(chatOptions.history[1].role).toBe('model');
  });

  it('should handle streaming chunks correctly', async () => {
    let streamedText = '';
    const response = await getAssistantResponse('Hello', [], null, (chunk) => {
      streamedText = chunk;
    });
    expect(streamedText).toBe('Mocked streaming response');
    expect(response).toBe('Mocked streaming response');
  });

  it('should return fallback message when API key is missing or initialization fails', async () => {
    mockGetGenerativeModel.mockImplementationOnce(() => {
      throw new Error('API Key Missing');
    });

    const response = await getAssistantResponse('Hello');
    expect(response).toContain("I'm having trouble connecting to my AI core");
  });
});
