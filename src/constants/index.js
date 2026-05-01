/**
 * Global Constants for CivicPath
 */

export const GOOGLE_SERVICES = {
  CIVIC_INFO_API: "https://www.googleapis.com/civicinfo/v2",
  MAPS_JS_API: "https://maps.googleapis.com/maps/api/js",
  CALENDAR_API: "https://www.googleapis.com/calendar/v3"
};

export const TRUSTED_DOMAINS = [
  ".gov",
  "vote.org",
  "usa.gov",
  "ballotpedia.org",
  "vote411.org"
];

export const ELECTION_DATE = "2026-11-03";
export const TODAY = "2026-05-01";

export const FEATURE_FLAGS = {
  ENABLE_MAPS: true,
  ENABLE_CALENDAR: true,
  ENABLE_FIRESTORE: true,
  ENABLE_STREAMING: true
};

export const DEFAULT_MESSAGES = {
  WELCOME: "Hello! I'm CivicPath, your interactive election guide. I can help you understand how voting works, deadlines in your area, and what steps to take.",
  ERROR_GENERIC: "I'm having trouble connecting to my services. Please try again or consult official sources.",
  NO_DATA: "No official data found for this specific query. Try searching for a broader term or check your address."
};

export const SYSTEM_PROMPTS = {
  CIVIC_ASSISTANT: `You are "CivicPath", a smart, nonpartisan election process assistant...` // Truncated for brevity here, used in gemini.js
};
