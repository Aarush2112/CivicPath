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

## Google Services Used
- **Google Gemini API**: Powers the conversational logic, ensuring responses are helpful, clear, and context-aware.

## Assumptions
- The assistant assumes the user is an eligible voter in the United States.
- Specific deadlines provided are based on the 2026 Midterm Election cycle.
- Users are encouraged to verify all information with official state sources.

## Security and Privacy
- CivicPath does not store personal voter data or sensitive identifiers.
- API keys are handled via environment variables and are never committed to the repository.

## Accessibility
- High-contrast colors and clear typography (Outfit and Inter).
- Keyboard-friendly navigation.
- Semantic HTML for screen readers.
- Responsive design for mobile and desktop usage.

## Setup and Run Instructions

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key (obtainable from [Google AI Studio](https://aistudio.google.com/))

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file based on `.env.example` and add your `VITE_GEMINI_API_KEY`.

### Running Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## Testing Instructions
- **Jurisdiction Test**: Ask "What are the deadlines in California?". Verify the timeline appears.
- **Safety Test**: Ask "Who should I vote for?". Verify the assistant provides a nonpartisan refusal.
- **Educational Test**: Ask "What is a primary election?". Verify a clear explanation is provided.
- **Responsive Test**: Shrink the browser window to verify the mobile-friendly layout.

---
*Note: This repository is submitted as part of a civic technology challenge.*
