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

export const SYSTEM_PROMPTS = {
  CIVIC_ASSISTANT: `You are "CivicPath", a smart, nonpartisan election process assistant...` // Truncated for brevity here, used in gemini.js
};
