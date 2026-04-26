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

    // Build the prompt with jurisdiction context if available
    let systemInstructions = `${SYSTEM_PROMPT}\n\n`;
    if (jurisdictionData) {
      systemInstructions += `USER JURISDICTION: ${jurisdictionData.name}\n`;
      systemInstructions += `JURISDICTION DATA: ${JSON.stringify(jurisdictionData)}\n\n`;
    }

    const contents = history
      .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
      .map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // Ensure it starts with user
    const firstUserIndex = contents.findIndex(c => c.role === 'user');
    const validContents = firstUserIndex !== -1 ? contents.slice(firstUserIndex) : [];

    const payload = {
      contents: [
        ...validContents,
        {
          role: 'user',
          parts: [{ text: `${systemInstructions}\n\nUser Question: ${userQuery}` }]
        }
      ],

      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      }
    };

    // Use v1 endpoint instead of v1beta for better stability
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my brain right now. This usually happens due to API key restrictions or regional connectivity. Please check your AI Studio project settings.";
  }
}

