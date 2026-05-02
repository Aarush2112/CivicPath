import { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Timeline from './components/Timeline';
import Checklist from './components/Checklist';
import CivicLookup from './components/CivicLookup';
import VoterInfoLookup from './components/VoterInfoLookup';
const LazyIssueReportForm = lazy(() => import('./components/IssueReportForm'));
const LazyMapComponent = lazy(() => import('./components/MapComponent'));
import { electionData, generalFAQs, glossary } from './data/electionData';
import { getAssistantResponse } from './utils/gemini';
import { loginAnonymously, saveChatSession, loadChatSession, fetchReports } from './utils/firebase';
import { initCalendarClient } from './utils/calendar';
import { searchOfficialSources } from './utils/customSearch';
import { withErrorBoundary } from './components/ErrorBoundary';

const SafeSidebar = withErrorBoundary(Sidebar, 'Sidebar');
const SafeChatArea = withErrorBoundary(ChatArea, 'ChatArea');

/**
 * Main Application Component
 * Handles state management, navigation, and API integrations
 */
function App() {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "Hello! I'm CivicPath, your AI-powered civic assistant. I can help you report local issues (like potholes), navigate civic services, or understand voting rules. How can I help you today?" 
    }
  ]);
  const [currentJurisdiction, setCurrentJurisdiction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize Firebase Auth and Load Session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await loginAnonymously();
        setUser(currentUser);
        initCalendarClient();
        
        const savedChats = await loadChatSession(currentUser.uid);

        if (savedChats && savedChats.length > 0) {
          setMessages(savedChats);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
    };
    initAuth();
  }, []);

  // Save session when messages change
  useEffect(() => {
    if (user && messages.length > 1) {
      saveChatSession(user.uid, messages);
    }
  }, [messages, user]);

  /**
   * Handles sending a message and getting a response from Gemini
   * @param {string} text - User input
   */
  const handleSendMessage = async (text) => {
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const lowerText = text.toLowerCase();

    // Track GA Event
    if (window.gtag) {
      window.gtag('event', 'chat_message_sent', { 
        topic: text.slice(0, 30),
        user_id: user?.uid 
      });
    }

    // Detect jurisdiction from user input
    const detectedJurisdiction = Object.values(electionData).find(d => 
      lowerText.includes(d.name.toLowerCase())
    );

    let updatedJurisdiction = currentJurisdiction;
    if (detectedJurisdiction) {
      updatedJurisdiction = detectedJurisdiction;
      setCurrentJurisdiction(detectedJurisdiction);
      
      if (window.gtag) {
        window.gtag('event', 'jurisdiction_detected', { 
          jurisdiction: detectedJurisdiction.name 
        });
      }
    }

    // Prepare streaming placeholder
    const botMessageId = Date.now();
    setMessages(prev => [...prev, { sender: 'bot', text: '', id: botMessageId, isStreaming: true }]);

    // Call Gemini for smart response
    let finalBotResponse = "";
    let searchResults = [];

    try {
      // 3. Simultaneously search official sources for high-stakes queries
      const shouldSearch = lowerText.includes('rule') || lowerText.includes('law') || lowerText.includes('candidate') || lowerText.includes('requirement');
      if (shouldSearch) {
        searchResults = await searchOfficialSources(text);
      }

      finalBotResponse = await getAssistantResponse(text, messages, updatedJurisdiction, (chunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, text: chunk } : msg
        ));
      });
    } catch (error) {
      console.error("Gemini Error:", error);
      finalBotResponse = "I'm having trouble with my AI connection. However, I can still provide you with official election data and tools! For example, would you like to see your local representative lookup or a voting checklist?";
    }
    
    setIsLoading(false);
    
    let component = null;
    const lowerBotRes = finalBotResponse.toLowerCase();

    // Determine which interactive component to show
    if (updatedJurisdiction && (lowerText.includes('timeline') || lowerText.includes('deadline') || lowerBotRes.includes('timeline'))) {
      component = <Timeline data={updatedJurisdiction} />;
    } else if (lowerText.includes('checklist') || lowerText.includes('step') || lowerBotRes.includes('checklist')) {
      component = <Checklist jurisdictionName={updatedJurisdiction?.name} />;
    } else if (lowerText.includes('representative') || lowerText.includes('lookup') || lowerText.includes('reps')) {
      component = <CivicLookup />;
    } else if (lowerText.includes('polling') || lowerText.includes('vote location') || lowerText.includes('where to vote')) {
      component = <VoterInfoLookup />;
    } else if (lowerText.includes('report') || lowerText.includes('issue') || lowerBotRes.includes('report issue')) {
      component = (
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
          <LazyIssueReportForm user={user} />
        </Suspense>
      );
    } else if (lowerText.includes('show map') || lowerText.includes('view issues') || lowerBotRes.includes('view map')) {
      // Fetch and show map of reports
      fetchReports().then(reports => {
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { 
            ...msg, 
            component: (
              <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading Map...</div>}>
                <div style={{ padding: '1rem', background: 'var(--surface-light)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Recent Civic Issues</h3>
                  <LazyMapComponent center={{ lat: 39.8283, lng: -98.5795 }} locations={reports} />
                </div>
              </Suspense>
            )
          } : msg
        ));
      });
    }

    // Add search results as source cards if available
    if (searchResults.length > 0) {
      const sourceCards = (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Sources Found:</p>
          {searchResults.slice(0, 3).map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="card animate-slide" style={{ textDecoration: 'none', padding: '10px' }}>
              <p style={{ fontWeight: 600, fontSize: '13px', margin: '0 0 2px 0', color: 'var(--primary)' }}>{item.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.snippet}
              </p>
            </a>
          ))}
        </div>
      );
      
      // If there's already a component, wrap both
      if (component) {
        component = (
          <>
            {component}
            {sourceCards}
          </>
        );
      } else {
        component = sourceCards;
      }
    }

    setMessages(prev => prev.map(msg => 
      msg.id === botMessageId ? { ...msg, text: finalBotResponse, component, isStreaming: false } : msg
    ));
  };



  /**
   * Resets the chat state
   */
  const resetChat = () => {
    const initialMsg = { 
      sender: 'bot', 
      text: "Hello! I'm CivicPath, your AI-powered civic assistant. I can help you report local issues (like potholes), navigate civic services, or understand voting rules. How can I help you today?" 
    };
    setMessages([initialMsg]);
    setCurrentJurisdiction(null);
    if (user) saveChatSession(user.uid, [initialMsg]);
  };

  /**
   * Handles sidebar navigation
   * @param {string} section - Selected section ID
   */
  const handleSidebarSelect = (section) => {
    if (window.gtag) {
      window.gtag('event', 'sidebar_navigation', { section });
    }

    if (section === 'faq') {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Common Questions:", 
        component: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {generalFAQs.map((f, i) => (
              <div key={i} className="card" style={{ padding: '0.75rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{f.q}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{f.a}</p>
              </div>
            ))}
          </div>
        )
      }]);
    } else if (section === 'glossary') {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Election Glossary:", 
        component: (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {glossary.map((g, i) => (
              <div key={i} className="card" style={{ padding: '0.75rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>{g.term}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.definition}</p>
              </div>
            ))}
          </div>
        )
      }]);
    } else if (section === 'checklist') {
      setMessages(prev => [...prev, { sender: 'bot', text: "Opening your checklist...", component: <Checklist jurisdictionName={currentJurisdiction?.name} /> }]);
    } else if (section === 'lookup') {
      setMessages(prev => [...prev, { sender: 'bot', text: "Opening the Official Representative Lookup...", component: <CivicLookup /> }]);
    } else if (section === 'polling') {
      setMessages(prev => [...prev, { sender: 'bot', text: "Opening the Polling Location Finder...", component: <VoterInfoLookup /> }]);
    } else if (section === 'process') {
      handleSendMessage("Search official government sources for the election process.");
    } else if (section === 'jurisdictions') {
      setMessages(prev => [...prev, { sender: 'bot', text: "I currently have detailed data for: California, Texas, New York, Florida, and Pennsylvania. Which one would you like to explore?" }]);
    } else if (section === 'report_issue') {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Let's report a civic issue. Please fill out the form below.", 
        component: (
          <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading form...</div>}>
            <LazyIssueReportForm user={user} onReportSubmitted={(r) => {
              setMessages(current => [...current, { sender: 'bot', text: `Issue "${r.title}" successfully reported! It's categorized as ${r.category}. Is there anything else you need help with?` }]);
            }} />
          </Suspense>
        ) 
      }]);
    }
  };

  return (
    <div className="app-container">
      <SafeSidebar onSelectSection={handleSidebarSelect} currentJurisdiction={currentJurisdiction} onReset={resetChat} />
      <main className="main-content" role="main">
        <SafeChatArea messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
