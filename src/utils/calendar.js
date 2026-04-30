/**
 * Google Calendar API utility using Google Identity Services (GIS)
 * Handles OAuth2 token acquisition and event creation
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient;
let accessToken = null;

/**
 * Initializes the GIS token client
 * Should be called when the Google Identity Services script is loaded
 */
export const initCalendarClient = () => {
  if (typeof google === 'undefined') return;
  
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse) => {
      if (tokenResponse.error !== undefined) {
        throw (tokenResponse);
      }
      accessToken = tokenResponse.access_token;
      console.log("Access token acquired");
    },
  });
};

/**
 * Adds an election event to the user's Google Calendar
 * @param {Object} eventDetails - { title, description, date }
 */
export const addCalendarEvent = async (eventDetails) => {
  const { title, description, date } = eventDetails;
  
  const requestToken = () => {
    return new Promise((resolve, reject) => {
      tokenClient.callback = (resp) => {
        if (resp.error) reject(resp);
        accessToken = resp.access_token;
        resolve(resp.access_token);
      };
      tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  };

  try {
    const token = accessToken || await requestToken();
    
    const event = {
      'summary': title,
      'description': description,
      'start': {
        'date': date, // Use 'date' for all-day events (YYYY-MM-DD)
        'timeZone': 'UTC'
      },
      'end': {
        'date': date,
        'timeZone': 'UTC'
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'popup', 'minutes': 1440 } // 1 day before
        ]
      }
    };

    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) throw new Error("Failed to create calendar event");
    
    // Track GA Event
    if (window.gtag) {
      window.gtag('event', 'calendar_event_added', { event_type: title });
    }
    
    return true;
  } catch (error) {
    console.error("Calendar API Error:", error);
    throw error;
  }
};
