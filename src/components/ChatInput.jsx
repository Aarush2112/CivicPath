import React, { useState } from 'react';
import { Send } from 'lucide-react';
import PropTypes from 'prop-types';

const TOPICS = [
  { label: "Check Deadlines", query: "What are the important election deadlines?" },
  { label: "How to Register", query: "How do I register to vote?" },
  { label: "Voting Checklist", query: "Can I see my voting checklist?" },
  { label: "What's a Primary?", query: "Explain what a primary election is." }
];

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.6)', 
      padding: '16px 24px 20px', 
      flexShrink: 0,
      boxShadow: '0 -4px 24px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {TOPICS.map((topic, i) => (
          <button 
            key={i} 
            onClick={() => onSendMessage(topic.query)}
            aria-label={`Ask about ${topic.label}`}
            style={{ 
              padding: '6px 16px', 
              borderRadius: '999px', 
              border: '1px solid var(--border)', 
              background: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '13px', 
              fontWeight: 600, 
              color: 'var(--text-secondary)', 
              cursor: 'pointer', 
              transition: 'var(--transition)',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-glow)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.background = 'var(--primary-light)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {topic.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
        <label htmlFor="chat-input" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Ask about elections</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the election process..."
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px 56px 14px 20px',
            borderRadius: '999px',
            border: '1.5px solid var(--border)',
            background: '#FFFFFF',
            fontSize: '15px',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'var(--transition)',
            boxSizing: 'border-box',
            boxShadow: 'var(--shadow-sm)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          style={{ 
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)',
            opacity: (isLoading || !input.trim()) ? 0.5 : 1,
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <Send size={16} />
        </button>
      </form>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px', margin: '12px 0 0 0', fontWeight: 500 }}>
        CivicPath is nonpartisan and provides educational information. Verify with official sources.
      </p>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ChatInput;
