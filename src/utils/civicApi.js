const API_KEY = import.meta.env.VITE_CIVIC_INFO_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

export async function getRepresentativeInfo(address) {
  try {
    const response = await fetch(`https://www.googleapis.com/content/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Could not find representative info for this address.');
    }
    return await response.json();
  } catch (error) {
    console.error("Civic API Error:", error);
    throw error;
  }
}

export async function getElectionInfo(address) {
  try {
    const response = await fetch(`https://www.googleapis.com/content/civicinfo/v2/voterinfo?address=${encodeURIComponent(address)}&key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Could not find election info for this address.');
    }
    return await response.json();
  } catch (error) {
    console.error("Civic API Error:", error);
    throw error;
  }
}

export function generateCalendarLink(title, date, description) {
  const formattedDate = new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const formattedEndDate = nextDay.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedDate}/${formattedEndDate}&details=${encodeURIComponent(description)}&sf=true&output=xml`;
  return url;
}
