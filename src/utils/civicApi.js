export async function getRepresentativeInfo(address) {
  try {
    const response = await fetch(`/api/civic/representatives?address=${encodeURIComponent(address)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Could not find representative info for this address.');
    }
    return await response.json();
  } catch (error) {
    console.error("Civic API Error:", error);
    throw error;
  }
}

export async function getElectionInfo(address) {
  try {
    const response = await fetch(`/api/civic/voterinfo?address=${encodeURIComponent(address)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Could not find election info for this address.');
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
