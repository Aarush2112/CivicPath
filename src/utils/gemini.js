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
Today's date is April 26, 2026. 
The 2026 Midterm Elections are on November 3, 2026.
`;

export async function getAssistantResponse(userQuery, history = [], jurisdictionData = null) {
  try {
    if (!API_KEY) {
      return "Assistant API key not found. Please set VITE_GEMINI_API_KEY in your .env file.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build the prompt with jurisdiction context if available
    let fullPrompt = `${SYSTEM_PROMPT}\n\n`;
    if (jurisdictionData) {
      fullPrompt += `USER JURISDICTION: ${jurisdictionData.name}\n`;
      fullPrompt += `JURISDICTION DATA: ${JSON.stringify(jurisdictionData)}\n\n`;
    }

    // Add conversation history
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(userQuery);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again in a moment, or check your internet connection.";
  }
}
