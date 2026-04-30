const API_KEY = import.meta.env.VITE_CIVIC_API_KEY || "";
const BASE_URL = "https://www.googleapis.com/civicinfo/v2";

/**
 * Fetches representative information from Google Civic API
 */
export async function getRepresentativeInfo(address) {
  if (!API_KEY) {
    throw new Error('Civic API key is missing. Please configure VITE_CIVIC_API_KEY.');
  }
  
  const cacheKey = `reps_${address}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const response = await fetch(`${BASE_URL}/representatives?key=${API_KEY}&address=${encodeURIComponent(address)}`);
    if (!response.ok) {
      if (response.status === 403) throw new Error('Google Civic API access denied (check API key restrictions or enable Civic Information API in Library).');
      throw new Error(`Civic API Error (${response.status}): Could not find representative info.`);
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
    const response = await fetch(`${BASE_URL}/voterinfo?key=${API_KEY}&address=${encodeURIComponent(address)}`);
    if (!response.ok) {
      if (response.status === 403) throw new Error('Google Civic API access denied (check API key restrictions or enable Civic Information API in Library).');
      throw new Error(`Voter API Error (${response.status}): Could not find election info.`);
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
