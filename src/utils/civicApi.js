const API_KEY = import.meta.env.VITE_CIVIC_API_KEY;
const BASE_URL = "https://www.googleapis.com/civicinfo/v2";

/**
 * Fetches representative information from Google Civic API
 * @param {string} address - The user's registered address
 * @returns {Promise<Object>} Representative information
 */
export async function getRepresentativeInfo(address) {
  const cacheKey = `reps_${address}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const response = await fetch(`${BASE_URL}/representatives?key=${API_KEY}&address=${encodeURIComponent(address)}`);
    if (!response.ok) throw new Error('Could not find representative info.');
    
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
 * @param {string} address - The user's registered address
 * @returns {Promise<Object>} Voter information
 */
export async function getElectionInfo(address) {
  const cacheKey = `voter_${address}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const response = await fetch(`${BASE_URL}/voterinfo?key=${API_KEY}&address=${encodeURIComponent(address)}`);
    if (!response.ok) throw new Error('Could not find election info.');
    
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
 * @param {string} address 
 * @returns {Promise<{lat: number, lng: number}>}
 */
export async function geocodeAddress(address) {
  const MAPS_KEY = import.meta.env.VITE_MAPS_API_KEY;
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
 * Dynamically generates a link to add election deadlines to the user's Google Calendar
 * (Legacy helper maintained for compatibility)
 */
export function generateCalendarLink(title, date, description) {
  const formattedDate = new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const formattedEndDate = nextDay.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedDate}/${formattedEndDate}&details=${encodeURIComponent(description)}&sf=true&output=xml`;
}
