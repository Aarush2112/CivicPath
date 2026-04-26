import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const TOPICS = [
  { label: "Check Deadlines", query: "What are the important election deadlines?" },
  { label: "How to Register", query: "How do I register to vote?" },
  { label: "Voting Checklist", query: "Can I see my voting checklist?" },
  { label: "What's a Primary?", query: "Explain what a primary election is." }
];

const ChatArea = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="main-content">
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem' }}>
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`animate-slide ${msg.sender === 'bot' ? 'message-bot' : 'message-user'}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9375rem' }}>{msg.text}</div>
              {msg.component && (
                <div style={{ marginTop: '1.25rem', animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both', animationDelay: '0.2s' }}>
                  {msg.component}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message-bot animate-slide" style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 1.25rem' }}>
              <Loader2 className="animate-spin" size={18} color="var(--primary-light)" />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>


      <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e5e7eb', background: 'white' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {TOPICS.map((topic, i) => (
            <button 
              key={i} 
              onClick={() => onSendMessage(topic.query)}
              className="card"
              style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              {topic.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the election process..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              borderRadius: '9999px',
              border: '1px solid #e5e7eb',
              outline: 'none',
              fontSize: '1rem',
              boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.02)',
              opacity: isLoading ? 0.7 : 1
            }}
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading || !input.trim()}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '50%', 
              width: '48px', 
              height: '48px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              opacity: (isLoading || !input.trim()) ? 0.5 : 1
            }}
          >
            <Send size={20} />
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          CivicPath is nonpartisan and provides educational information. Verify with official sources.
        </p>
      </div>
    </div>
  );
};

export default ChatArea;

