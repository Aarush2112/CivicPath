const SYSTEM_PROMPT = `
You are "CivicPath", a smart, production-grade AI-powered civic assistant.
Your goal is to help users report local issues, get guidance on civic services, and navigate government-related workflows (including elections).

RULES:
1. ISSUE REPORTING: If the user describes a civic issue (e.g., pothole, broken streetlight, graffiti, noise complaint):
   - Acknowledge the issue.
   - Classify the issue into a category (e.g., Infrastructure, Public Safety, Sanitation).
   - Assign a severity score from 1-5.
   - Suggest the next steps or nearest authority to contact.
   - Remind them they can use the "Report Issue" map tool.
2. ELECTION & VOTING: If the user asks about voting, remain nonpartisan and ask for their jurisdiction if not provided.
3. CLEAR FORMATTING: Use bolding, bullet points, and clear headers to structure your response.
4. TONE: Be helpful, empathetic, professional, and clear.
5. NO LEGAL ADVICE: Remind users to consult official sources for legal or emergency situations. For emergencies, tell them to call 911 immediately.
`;

/**
 * Communicates with the secure /api/gemini endpoint
 * @param {string} userQuery - The message from the user
 * @param {Array} history - Previous chat messages
 * @param {Object} jurisdictionData - Contextual data about the user's jurisdiction
 * @param {Function} onStream - Callback for streaming chunks (simulated for serverless endpoint)
 * @returns {Promise<string>} The full response text
 */
export async function getAssistantResponse(userQuery, history = [], jurisdictionData = null, onStream = null) {
  try {
    const contents = [];
    
    // Add System Prompt as the first user message (a common workaround if systemInstruction isn't explicitly supported in the proxy)
    const contextStr = jurisdictionData ? `\n\nUSER JURISDICTION: ${jurisdictionData.name}\nJURISDICTION DATA: ${JSON.stringify(jurisdictionData)}` : "";
    contents.push({
      role: 'user',
      parts: [{ text: "SYSTEM PROMPT: " + SYSTEM_PROMPT + contextStr }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: "Understood. I will act as CivicPath." }]
    });

    // Add history
    const chatHistory = history
      .filter(msg => (msg.sender === 'user' || msg.sender === 'bot') && msg.text)
      .map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
    
    contents.push(...chatHistory);

    // Add current query
    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.5,
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to fetch from /api/gemini');
    }

    const data = await response.json();
    const finalBotResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that request.";

    // Simulate streaming for the UI if requested
    if (onStream) {
      // Chunking simulation
      const chunks = finalBotResponse.split(' ');
      let currentText = '';
      for (const word of chunks) {
        currentText += word + ' ';
        onStream(currentText);
        // Small delay to simulate streaming effect
        await new Promise(r => setTimeout(r, 20));
      }
    }

    return finalBotResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my AI core. Please try again later or use the tools in the sidebar.";
  }
}
