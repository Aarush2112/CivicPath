import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Timeline from './components/Timeline';
import Checklist from './components/Checklist';
import { electionData, generalFAQs, glossary } from './data/electionData';
import { ExternalLink } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "Hello! I'm CivicPath, your interactive election guide. I can help you understand how voting works, deadlines in your area, and what steps to take. To get started, what state or jurisdiction are you interested in? (Try: California, Texas, New York, Florida, or Pennsylvania)" 
    }
  ]);
  const [currentJurisdiction, setCurrentJurisdiction] = useState(null);

  const handleSendMessage = (text) => {
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);

    // Simple Logic Engine
    setTimeout(() => {
      processUserQuery(text.toLowerCase());
    }, 500);
  };

  const resetChat = () => {
    setMessages([
      { 
        sender: 'bot', 
        text: "Hello! I'm CivicPath, your interactive election guide. I can help you understand how voting works, deadlines in your area, and what steps to take. To get started, what state or jurisdiction are you interested in? (Try: California, Texas, New York, Florida, or Pennsylvania)" 
      }
    ]);
    setCurrentJurisdiction(null);
  };

  const addBotMessage = (text, component = null) => {
    setMessages(prev => [...prev, { sender: 'bot', text, component }]);
  };

  const processUserQuery = (query) => {
    // 1. Check for Jurisdictions
    if (query.includes('california')) {
      const data = electionData.california;
      setCurrentJurisdiction(data);
      addBotMessage(`I've updated my information for California. Here's a quick overview: Registration ends on ${data.registration_deadline}. Would you like to see the full timeline or your voting checklist?`, 
        <Timeline data={data} />);
      return;
    }
    if (query.includes('texas')) {
      const data = electionData.texas;
      setCurrentJurisdiction(data);
      addBotMessage(`I've switched to Texas. Important: Registration deadline is ${data.registration_deadline}. Texas requires a photo ID for in-person voting.`, 
        <Timeline data={data} />);
      return;
    }
    if (query.includes('new york')) {
      const data = electionData.new_york;
      setCurrentJurisdiction(data);
      addBotMessage(`Information for New York is ready. Election Day is ${data.election_day}. Would you like to check the early voting dates?`, 
        <Timeline data={data} />);
      return;
    }
    if (query.includes('florida')) {
      const data = electionData.florida;
      setCurrentJurisdiction(data);
      addBotMessage(`I've found information for Florida. Registration closes on ${data.registration_deadline}. Remember to bring a photo ID if you vote in person!`, 
        <Timeline data={data} />);
      return;
    }
    if (query.includes('pennsylvania')) {
      const data = electionData.pennsylvania;
      setCurrentJurisdiction(data);
      addBotMessage(`Pennsylvania data loaded. Note that the mail ballot request deadline is ${data.mail_ballot_request_deadline}.`, 
        <Timeline data={data} />);
      return;
    }

    // 2. Check for Keywords
    if (query.includes('timeline') || query.includes('deadline')) {
      if (currentJurisdiction) {
        addBotMessage(`Here is the key timeline for ${currentJurisdiction.name}:`, <Timeline data={currentJurisdiction} />);
      } else {
        addBotMessage("I can show you a timeline once you tell me which state you're interested in (e.g., California).");
      }
      return;
    }

    if (query.includes('checklist') || query.includes('step')) {
      addBotMessage("Here is your step-by-step voting checklist:", <Checklist jurisdictionName={currentJurisdiction?.name} />);
      return;
    }

    if (query.includes('register')) {
      if (currentJurisdiction) {
        addBotMessage(`In ${currentJurisdiction.name}, the deadline to register is ${currentJurisdiction.registration_deadline}. Here are some official resources:`, 
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentJurisdiction.official_sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                {s.name} <ExternalLink size={14} />
              </a>
            ))}
          </div>
        );
      } else {
        addBotMessage("Voter registration deadlines vary by state. Tell me your state so I can give you the exact date!");
      }
      return;
    }

    // 3. Check FAQs
    const foundFAQ = generalFAQs.find(f => query.includes(f.q.toLowerCase().replace('?', '')));
    if (foundFAQ) {
      addBotMessage(foundFAQ.a);
      return;
    }

    // 4. Check Glossary
    const foundTerm = glossary.find(g => query.includes(g.term.toLowerCase()));
    if (foundTerm) {
      addBotMessage(`${foundTerm.term}: ${foundTerm.definition}`);
      return;
    }

    // Default Fallback
    addBotMessage("I'm not quite sure about that. You can ask me about 'deadlines', 'how to register', 'voting checklist', or a specific state like 'California'.");
  };

  const handleSidebarSelect = (section) => {
    if (section === 'faq') {
      addBotMessage("Common Questions:", 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {generalFAQs.map((f, i) => (
            <div key={i} className="card" style={{ padding: '0.75rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{f.q}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{f.a}</p>
            </div>
          ))}
        </div>
      );
    } else if (section === 'glossary') {
      addBotMessage("Election Glossary:", 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {glossary.map((g, i) => (
            <div key={i} className="card" style={{ padding: '0.75rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>{g.term}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.definition}</p>
            </div>
          ))}
        </div>
      );
    } else if (section === 'checklist') {
      addBotMessage("Opening your checklist...", <Checklist jurisdictionName={currentJurisdiction?.name} />);
    } else if (section === 'process') {
      addBotMessage("The election process generally follows these steps: 1. Registration, 2. Primary Elections, 3. General Election Campaigning, 4. Early/Mail Voting, 5. Election Day, 6. Counting & Certification.");
    } else if (section === 'jurisdictions') {
      addBotMessage("I currently have detailed data for: California, Texas, New York, Florida, and Pennsylvania. Which one would you like to explore?");
    }
  };

  return (
    <div className="app-container">
      <Sidebar onSelectSection={handleSidebarSelect} currentJurisdiction={currentJurisdiction} onReset={resetChat} />
      <ChatArea messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
