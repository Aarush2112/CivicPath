# CivicPath — Your Democratic Process Navigator

**Live Demo:** [https://civic-path.vercel.app](https://civic-path.vercel.app)

## Chosen Vertical
Civic Engagement & Election Assistance

## Problem Statement
A significant portion of eligible voters face barriers to participation due to complex registration rules, unclear polling locations, and a lack of accessible, nonpartisan information about their representatives. This gap in civic engagement weakens democratic representation.

## Solution Overview
CivicPath is a premium, AI-powered election assistant that guides users through the democratic process with clarity and confidence. By integrating real-time data from Google Civic Information, Google Maps, and Google Calendar, it provides a one-stop-shop for voter registration, official representative lookup, and personalized election deadlines.

## Google Services Used
| Service | Purpose | Integration Depth |
|---|---|---|
| **Gemini 1.5 Flash** | AI chat with grounding | Multi-turn history, streaming responses, and Google Search grounding for real-time election news. |
| **Civic Information API** | Voter info + reps | Deep integration with `voterInfo` and `representatives` endpoints, including official photos and social links. |
| **Maps JavaScript API** | Polling location map | Custom Advanced Markers, InfoWindows with directions, and Geocoding for address-to-location mapping. |
| **Calendar API** | Deadline reminders | OAuth 2.0 flow to add official election dates and registration deadlines directly to user calendars. |
| **Custom Search API** | Civic source search | Restricted search engine targeting only trusted government domains (.gov, vote.org, usa.gov). |
| **Firebase Auth + Firestore** | Session persistence | Anonymous authentication and Firestore-backed chat history for returning users. |
| **Google Analytics 4** | Usage tracking | Custom event tracking for chat interactions, address lookups, and feature engagement. |
| **Google Translate** | Accessibility | Seamless multi-language support injected directly into the HTML to ensure civic information is accessible to all demographics. |
| **Google Fonts** | Typography | Professional Inter and Outfit font families for a premium, accessible UI. |

## Architecture
CivicPath is built with React and Vite, utilizing a modular component architecture:
- **`App.jsx`**: Central state management, authentication flow, and API orchestration.
- **`utils/`**: Specialized modules for Gemini, Civic API, Calendar, and Firebase logic.
- **`components/`**: Reusable UI elements, including a lazy-loaded Map component and rich official cards.
- **`hooks/`**: Custom React hooks for encapsulating complex API logic and loading states.

## How to Run
1.  **Clone the repository:** `git clone <repo-url>`
2.  **Install dependencies:** `npm install`
3.  **Configure environment variables:**
    - Rename `.env.example` to `.env`
    - Add your Google API Keys (Gemini, Civic, Maps, Search, Firebase)
4.  **Start development server:** `npm run dev`
5.  **Run tests:** `npm test`

## Assumptions
- Users have a Google account for Calendar integration.
- Election data is primarily focused on the United States.
- The 2026 Midterm Elections are the current primary context.
