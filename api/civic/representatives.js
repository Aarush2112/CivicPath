/**
 * Google Civic Information API - Representatives Lookup
 * POST only: Proxies requests to Google Civic API to protect API keys.
 * Integrates Google Civic Information to fetch official representative data.
 */
export default async function handler(req, res) {
  // 1. Method Validation: Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed. This endpoint only supports POST requests for secure data handling.' 
    });
  }

  const { address } = req.body;
  const CIVIC_INFO_API_KEY = process.env.CIVIC_INFO_API_KEY;

  // 2. Environment Variable Validation
  if (!CIVIC_INFO_API_KEY) {
    console.error('Environment Error: CIVIC_INFO_API_KEY is missing.');
    return res.status(500).json({ 
      error: 'Google Civic service is not configured. Please check server environment variables.' 
    });
  }

  // 3. Input Validation
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ 
      error: 'Address parameter is required and must be a valid string.' 
    });
  }

  try {
    // 4. External API Call: Fetch representatives for the given address
    const response = await fetch(
      `https://www.googleapis.com/content/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${CIVIC_INFO_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.error?.message || 'Upstream Error from Google Civic Information API',
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Civic Representatives Internal API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error while communicating with Google Civic Services.' 
    });
  }
}
