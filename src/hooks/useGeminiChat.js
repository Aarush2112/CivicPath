import { useState, useCallback } from 'react';
import { getAssistantResponse } from '../utils/gemini';

/**
 * Custom hook for managing Gemini chat sessions
 * @param {Array} initialMessages 
 */
export const useGeminiChat = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text, history, jurisdiction, onStream) => {
    setIsLoading(true);
    try {
      const response = await getAssistantResponse(text, history, jurisdiction, onStream);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  return { messages, setMessages, isLoading, sendMessage };
};
