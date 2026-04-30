import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
You are "CivicPath", a smart, nonpartisan election process assistant. 
Your goal is to guide users through the voting process with accuracy, clarity, and neutrality.

RULES:
1. JURISDICTION FIRST: If the user hasn't specified their state or jurisdiction, ask for it before giving location-specific deadlines or rules.
2. NONPARTISAN: Do not express opinions on candidates, parties, or policies. Refuse any request to provide partisan persuasion or "who should I vote for" advice.
3. NO LEGAL ADVICE: You are an educational tool. Do not provide legal advice. Remind users to consult official sources for legal interpretations.
4. UNOFFICIAL RESULTS: Never present unofficial election results as final. Emphasize that results are only official after certification.
5. STEP-BY-STEP: Provide clear, sequential explanations for processes like registration or mail-in voting.
6. OFFICIAL SOURCES: Always encourage users to verify information with their local Secretary of State or Board of Elections.
7. NEXT ACTIONS: End every response with a suggested "Next Step" or a follow-up question.
8. SEPARATION: Clearly distinguish between general educational info (e.g., "What is a primary?") and jurisdiction-specific rules (e.g., "In California, the deadline is...").

CONTEXT:
Today's date is May 1, 2026. 
The 2026 Midterm Elections are on November 3, 2026.
`;

/**
 * Communicates with Google Gemini API for nonpartisan civic assistance
 * @param {string} userQuery - The message from the user
 * @param {Array} history - Previous chat messages
 * @param {Object} jurisdictionData - Contextual data about the user's jurisdiction
 * @param {Function} onStream - Callback for streaming chunks
 * @returns {Promise<string>} The full response text
 */
export async function getAssistantResponse(userQuery, history = [], jurisdictionData = null, onStream = null) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT + (jurisdictionData ? `\n\nUSER JURISDICTION: ${jurisdictionData.name}\nJURISDICTION DATA: ${JSON.stringify(jurisdictionData)}` : ""),
      tools: [{ googleSearch: {} }] // Enable Google Search Grounding
    });

    const chatHistory = history
      .filter(msg => (msg.sender === 'user' || msg.sender === 'bot') && msg.text)
      .map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.5,
      },
    });

    if (onStream) {
      const result = await chat.sendMessageStream(userQuery);
      let fullText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        onStream(fullText);
      }
      return fullText;
    } else {
      const result = await chat.sendMessage(userQuery);
      return result.response.text();
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my AI core. However, I can still provide you with official election data and tools from my sidebar! For example, would you like to see your local representative lookup or a voting checklist?";
  }
}


