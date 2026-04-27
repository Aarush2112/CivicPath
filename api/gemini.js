/**
 * Gemini API Serverless Function
 * POST only: Proxies requests to Google Gemini API to protect API keys.
 * Integrates Google Gemini 1.5 Flash to power the nonpartisan election assistant.
 */
export default async function handler(req, res) {
  // 1. Method Validation: Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed. This endpoint only supports POST requests for secure data handling.' 
    });
  }

  // 2. Environment Variable Validation: Ensure API key is configured
  const { GEMINI_API_KEY } = process.env;
  if (!GEMINI_API_KEY) {
    console.error('Environment Error: GEMINI_API_KEY is missing.');
    return res.status(500).json({ 
      error: 'Google Gemini service is not configured. Please check server environment variables.' 
    });
  }

  try {
    const { contents, generationConfig } = req.body;

    // 3. Input Validation: Check for required payload
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ 
        error: 'Invalid Request Body: "contents" array is required.' 
      });
    }

    // 4. External API Call: Securely communicate with Google
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents, generationConfig }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.error?.message || 'Upstream Error from Google Gemini API',
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Gemini API Internal Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error while communicating with Google Services.' 
    });
  }
}
