# CivicPath 🏛️

CivicPath is a production-grade AI-powered civic assistant designed to help users report local issues, get guidance on civic services, and navigate government-related workflows (such as elections and voting).

![CivicPath UI Demo](./public/og-image.png)

## 🎯 Problem Statement

Navigating local government services and reporting community issues (like potholes or broken streetlights) can be confusing and fragmented. Citizens often struggle to find the right authority or understand the correct reporting process. Additionally, understanding voting rights and election deadlines remains a significant hurdle.

## 🚀 Solution Approach

CivicPath solves this by providing a unified, AI-driven conversational interface. 
- **AI Civic Advisor:** A smart chat assistant (powered by Gemini 1.5 Flash) that understands natural language descriptions of issues, categorizes them, assigns severity, and provides immediate guidance.
- **Interactive Issue Mapping:** Users can drop pins on an interactive Google Map to accurately report locations, and view a dashboard of recently reported community issues.
- **Election Navigation:** Built-in tools for official representative lookup, polling location finding, and voting checklists.

## 🛠️ Architecture & Technologies

CivicPath is built with a modern, serverless React architecture deployed on Vercel.

- **Frontend:** React (Vite), CSS Variables for theming, Lucide React (Icons). Heavy components (like Maps) are lazy-loaded for maximum efficiency.
- **Backend/API:** Vercel Serverless Functions (`/api/gemini.js`).
- **Google Services Deep Integration:**
  - **Firebase:** Authentication (Anonymous login for frictionless UX) & Firestore Database (storing chat history and community issue reports).
  - **Google Maps API:** `@vis.gl/react-google-maps` for interactive plotting, click-to-pin reporting, and rendering `AdvancedMarker`s for issues vs polling locations.
  - **Gemini API:** Integrates `gemini-1.5-flash` with a custom system prompt to act as the AI Civic Advisor. Securely routed through a serverless backend to protect API keys.
  - **Google Civic Information API:** Retrieves official polling places and representatives.
- **Testing:** Comprehensive Vitest unit tests covering the core AI validation, input sanitization, and security logic.

## 📦 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/civicpath.git
   cd civicpath
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys. (See `.env.example` for details):
   ```env
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_MAPS_API_KEY=your_maps_key
   VITE_CIVIC_API_KEY=your_civic_key
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   # ... other Firebase config
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Run Tests:**
   ```bash
   npm run test
   ```

## 🔐 Security & Code Quality

- **API Security:** The Gemini API key is kept secure by routing all requests through the `/api/gemini` Vercel serverless function.
- **Sanitization:** All user-submitted issue reports undergo strict XSS sanitization and payload validation before reaching Firestore.
- **Accessibility (a11y):** Fully ARIA-compliant forms, proper focus management, and high-contrast color palettes ensure accessibility for all users.
- **Performance:** Lazy loading, React `Suspense`, and debouncing are utilized to maintain a repository size under 10MB and near-instant load times.

## 🔭 Future Scope

- **Government Portal Integration:** Direct integration with city 311 APIs to automatically forward verified issues to local authorities.
- **Push Notifications:** Alert users when their reported issue status changes from "Open" to "Resolved".
- **Multilingual Support:** Leverage Gemini's translation capabilities to serve diverse communities natively.

---
*Built for the Google Prompt Wars.*
