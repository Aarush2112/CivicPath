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
    <div style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '16px 24px 20px', flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {TOPICS.map((topic, i) => (
          <button 
            key={i} 
            onClick={() => onSendMessage(topic.query)}
            aria-label={`Ask about ${topic.label}`}
            style={{ 
              padding: '6px 14px', 
              borderRadius: '999px', 
              border: '1px solid #CBD5E1', 
              background: '#FFFFFF', 
              fontSize: '13px', 
              fontWeight: 500, 
              color: '#475569', 
              cursor: 'pointer', 
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563EB';
              e.currentTarget.style.color = '#2563EB';
              e.currentTarget.style.background = '#EFF6FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.background = '#FFFFFF';
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
            padding: '13px 50px 13px 18px',
            borderRadius: '12px',
            border: '1.5px solid #E2E8F0',
            background: '#F8FAFC',
            fontSize: '14px',
            color: '#0F172A',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#2563EB';
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.background = '#F8FAFC';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          style={{ 
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#2563EB',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            opacity: (isLoading || !input.trim()) ? 0.5 : 1
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1E40AF'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2563EB'}
        >
          <Send size={16} />
        </button>
      </form>
      <p style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', marginTop: '10px', margin: '10px 0 0 0' }}>
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
