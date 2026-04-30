const API_KEY = import.meta.env.VITE_SEARCH_API_KEY || "";
const CX = import.meta.env.VITE_SEARCH_CX || "";

/**
 * Searches official civic sources using Google Custom Search JSON API
 * @param {string} query - Search term
 * @returns {Promise<Array>} List of search results
 */
export async function searchOfficialSources(query) {
  if (!API_KEY || !CX) {
    console.warn("Custom Search API key or CX missing");
    return [];
  }
  
  try {
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.warn("Custom Search API request failed");
      return [];
    }
    const data = await response.json();
    
    // Track GA Event
    if (window.gtag) {
      window.gtag('event', 'official_source_search', { query });
    }
    
    return data.items || [];
  } catch (error) {
    console.error("Custom Search Error:", error);
    return [];
  }
}
