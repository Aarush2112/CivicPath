# CivicPath - Election Process Assistant

CivicPath is a smart, dynamic, and nonpartisan election assistant designed to guide voters through the complex process of participating in democracy. It provides personalized timelines, voting checklists, and educational information based on the user's jurisdiction.

## Vertical
**Civic / Public Information Assistant**

## Problem Statement
Voters often face a fragmented landscape of election information. Deadlines vary by state, rules for mail-in voting are complex, and misinformation can lead to disenfranchisement. CivicPath solves this by providing a single, trustworthy, and interactive source of truth for election procedures.

## Approach and Logic
- **Jurisdictional Awareness**: The assistant identifies the user's state or territory and tailors all procedural information to that specific area.
- **Dynamic Content**: UI components like the Timeline and Checklist update in real-time based on the conversation context.
- **Responsible AI**: Built with a strict nonpartisan system prompt that refuses candidate persuasion and clarifies the difference between unofficial and official results.
- **Step-by-Step Guidance**: Breaks down complex tasks into manageable checklists.

## How the Assistant Works
1. **Initial Inquiry**: The assistant asks for the user's jurisdiction to provide relevant dates.
2. **Contextual Analysis**: Uses Google Gemini to understand user intent (e.g., "how do I register", "when is the election").
3. **Data Integration**: Combines AI-generated educational content with hardcoded, verified election data for key states.
4. **Interactive UI**: Triggers specific components (Timeline, Checklist, FAQ) to help visualize the process.
5. **Next Step Guidance**: Always suggests a follow-up action to keep the voter moving forward.

## Google Services Integration

CivicPath leverages several Google Cloud services to provide a premium experience:
- **Google Gemini API (1.5 Flash)**: Powers the nonpartisan conversational engine. Implemented in `api/gemini.js` and `src/utils/gemini.js`.
- **Google Civic Information API**: Provides official data for local representatives and election information. Implemented in `api/civic/` and `src/utils/civicApi.js`.
- **Google Calendar**: Dynamically generates reminder links for all key election dates. See `generateCalendarLink` in `src/utils/civicApi.js`.

### Environment Variables
For the app to function fully, the following environment variables must be configured in your deployment platform (e.g., Vercel) or local `.env` file:
- `GEMINI_API_KEY`: Your Google AI Studio API Key.
- `CIVIC_INFO_API_KEY`: Your Google Cloud Console API Key with Civic Information API enabled.

## Automated Testing

CivicPath includes a comprehensive test suite using **Vitest** and **React Testing Library**.

### Running Tests
```bash
npm test
```

### What is Covered
- **Safety Policy**: Verifies that the assistant's system prompt strictly enforces nonpartisan behavior and "jurisdiction-first" logic.
- **Logic Validation**: Tests the Google Calendar link generation and data parsing utilities.
- **Data Integrity**: Ensures the `electionData.js` source contains all required fields (registration, early voting, etc.) for every supported state.
- **Error Handling**: Validates that the UI provides clear guidance when Google Services are unavailable.

## API Endpoint Security
- All API routes (`/api/*`) are restricted to **POST** methods only.
- Validation logic ensures that required inputs (like addresses or chat history) are present and correctly formatted.
- Environment variables are handled strictly on the server side to prevent exposing API keys to the client bundle.


## Setup and Installation

### Prerequisites
- Node.js (v18+)
- A Google Cloud API Key with **Generative Language API** and **Google Civic Information API** enabled.

### Local Development
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   CIVIC_INFO_API_KEY=your_google_civic_api_key_here
   ```
4. To test API routes locally, use the Vercel CLI:
   ```bash
   npm i -g vercel
   vercel dev
   ```

### Vercel Deployment
1. Connect your repo to Vercel.
2. Add `GEMINI_API_KEY` and `CIVIC_INFO_API_KEY` to Environment Variables.
3. Deploy. The `/api` folder will be automatically handled as serverless functions.
