import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Timeline from './components/Timeline';
import Checklist from './components/Checklist';
import CivicLookup from './components/CivicLookup';
import { electionData, generalFAQs, glossary } from './data/electionData';
import { getAssistantResponse } from './utils/gemini';
import { ExternalLink } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "Hello! I'm CivicPath, your interactive election guide. I can help you understand how voting works, deadlines in your area, and what steps to take. To get started, what state or jurisdiction are you interested in?" 
    }
  ]);
  const [currentJurisdiction, setCurrentJurisdiction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text) => {
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Detect jurisdiction from user input
    const detectedJurisdiction = Object.values(electionData).find(d => 
      text.toLowerCase().includes(d.name.toLowerCase())
    );

    let updatedJurisdiction = currentJurisdiction;
    if (detectedJurisdiction) {
      updatedJurisdiction = detectedJurisdiction;
      setCurrentJurisdiction(detectedJurisdiction);
    }

    // Call Gemini for smart response (Fallback)
    let botResponse = "";
    try {
      botResponse = await getAssistantResponse(text, messages, updatedJurisdiction);
    } catch (error) {
      botResponse = "I'm having trouble with my AI connection. However, I can still provide you with official election data and tools! For example, would you like to see your local representative lookup or a voting checklist?";
    }
    
    setIsLoading(false);
    
    let component = null;
    const lowerText = text.toLowerCase();
    const lowerBotRes = botResponse.toLowerCase();

    if (updatedJurisdiction && (lowerText.includes('timeline') || lowerText.includes('deadline') || lowerBotRes.includes('timeline'))) {
      component = <Timeline data={updatedJurisdiction} />;
    } else if (lowerText.includes('checklist') || lowerText.includes('step') || lowerBotRes.includes('checklist')) {
      component = <Checklist jurisdictionName={updatedJurisdiction?.name} />;
    } else if (lowerText.includes('representative') || lowerText.includes('lookup') || lowerText.includes('reps')) {
      component = <CivicLookup />;
    }

    setMessages(prev => [...prev, { sender: 'bot', text: botResponse, component }]);
  };

  const resetChat = () => {
    setMessages([
      { 
        sender: 'bot', 
        text: "Hello! I'm CivicPath, your interactive election guide. I can help you understand how voting works, deadlines in your area, and what steps to take. To get started, what state or jurisdiction are you interested in?" 
      }
    ]);
    setCurrentJurisdiction(null);
  };

  const handleSidebarSelect = (section) => {
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
    } else if (section === 'process') {
      handleSendMessage("Explain the general election process step-by-step.");
    } else if (section === 'jurisdictions') {
      setMessages(prev => [...prev, { sender: 'bot', text: "I currently have detailed data for: California, Texas, New York, Florida, and Pennsylvania. Which one would you like to explore?" }]);
    }
  };

  return (
    <div className="app-container">
      <Sidebar onSelectSection={handleSidebarSelect} currentJurisdiction={currentJurisdiction} onReset={resetChat} />
      <ChatArea messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;


