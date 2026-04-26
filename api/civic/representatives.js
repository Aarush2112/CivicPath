export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { address } = req.body;
  const CIVIC_INFO_API_KEY = process.env.CIVIC_INFO_API_KEY || process.env.GEMINI_API_KEY;

  if (!CIVIC_INFO_API_KEY) {
    return res.status(500).json({ error: 'CIVIC_INFO_API_KEY is not configured on the server.' });
  }

  if (!address) {
    return res.status(400).json({ error: 'Address parameter is required' });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/content/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${CIVIC_INFO_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.error?.message || 'Error from Civic Info API',
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Civic Representatives API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
