const API_KEY = import.meta.env.VITE_CIVIC_API_KEY || "";
const BASE_URL = "https://www.googleapis.com/civicinfo/v2";

/**
 * Fetches political divisions for an address from Google Civic API
 * Note: The "Representatives" endpoint was turned down by Google in April 2025.
 * This replacement finds the OCD-IDs (divisions) for the address.
 */
export async function getRepresentativeInfo(address) {
  if (!API_KEY) {
    throw new Error('Civic API key is missing. Please configure VITE_CIVIC_API_KEY.');
  }
  
  const cacheKey = `divs_${address}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const response = await fetch(`${BASE_URL}/divisionsByAddress?key=${API_KEY}&address=${encodeURIComponent(address)}`);
    if (!response.ok) {
      if (response.status === 403) throw new Error('Google Civic API access denied (check API key restrictions or enable Civic Information API in Library).');
      if (response.status === 404) throw new Error('Address not recognized by the Civic API.');
      throw new Error(`Civic API Error (${response.status}): Service unavailable or malformed request.`);
    }
    
    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Civic API Error:", error);
    throw error;
  }
}

/**
 * Fetches voter information (polling locations, contests) from Google Civic API
 */
export async function getElectionInfo(address) {
  if (!API_KEY) {
    throw new Error('Civic API key is missing. Please configure VITE_CIVIC_API_KEY.');
  }

  const cacheKey = `voter_${address}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    // 1. Try default voter lookup (automatic election detection)
    let response = await fetch(`${BASE_URL}/voterinfo?key=${API_KEY}&address=${encodeURIComponent(address)}`);
    
    // 2. If 400, try to find a specific active election ID as a fallback
    if (response.status === 400) {
      console.warn("Default voterinfo failed, attempting fallback to latest election...");
      const elections = await getActiveElections();
      if (elections.length > 0) {
        // Sort by date descending and pick the first one (excluding the '2000' VIP test election)
        const validElections = elections.filter(e => e.id !== "2000").sort((a, b) => new Date(b.electionDay) - new Date(a.electionDay));
        const targetId = validElections[0]?.id || elections[0].id;
        response = await fetch(`${BASE_URL}/voterinfo?key=${API_KEY}&address=${encodeURIComponent(address)}&electionId=${targetId}`);
      }
    }

    if (!response.ok) {
      if (response.status === 403) throw new Error('Google Civic API access denied (check API key restrictions or enable Civic Information API in Library).');
      throw new Error(`Voter API Error (${response.status}): No active election data found for this address in the current cycle.`);
    }
    
    const data = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Civic API Error:", error);
    throw error;
  }
}

/**
 * Geocodes an address to lat/lng using Google Maps Geocoding API
 */
export async function geocodeAddress(address) {
  const MAPS_KEY = import.meta.env.VITE_MAPS_API_KEY || "";
  if (!MAPS_KEY) {
    console.warn("Maps API key missing for geocoding");
    return { lat: 37.0902, lng: -95.7129 }; // Default US center
  }

  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_KEY}`);
    const data = await response.json();
    if (data.status === 'OK') {
      return data.results[0].geometry.location;
    }
    throw new Error('Geocoding failed');
  } catch (error) {
    console.error("Geocoding Error:", error);
    return { lat: 37.0902, lng: -95.7129 }; // Default US center
  }
}

/**
 * Fetches all active elections from Google Civic API
 */
export async function getActiveElections() {
  if (!API_KEY) return [];
  try {
    const response = await fetch(`${BASE_URL}/elections?key=${API_KEY}`);
    const data = await response.json();
    return data.elections || [];
  } catch (error) {
    console.error("Elections API Error:", error);
    return [];
  }
}

/**
 * Legacy helper for calendar links
 */
export function generateCalendarLink(title, date, description) {
  try {
    const formattedDate = new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const formattedEndDate = nextDay.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedDate}/${formattedEndDate}&details=${encodeURIComponent(description)}&sf=true&output=xml`;
  } catch (err) {
    return "#";
  }
}
