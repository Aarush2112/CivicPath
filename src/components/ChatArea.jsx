import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot } from 'lucide-react';

const ChatArea = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="main-content">
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`animate-fade`}
            style={{
              display: 'flex',
              gap: '1rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: msg.sender === 'user' ? 'var(--primary-light)' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0
            }}>
              {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div style={{
              background: msg.sender === 'user' ? 'var(--primary)' : 'white',
              color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
              padding: '1rem',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '1rem'
            }}>
              {msg.text}
              {msg.component && <div style={{ marginTop: '1rem' }}>{msg.component}</div>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '2rem', borderTop: '1px solid #e5e7eb', background: 'white' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the election process..."
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              borderRadius: '9999px',
              border: '1px solid #e5e7eb',
              outline: 'none',
              fontSize: '1rem',
              boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.02)'
            }}
          />
          <button 
            type="submit" 
            className="btn-primary"
            style={{ padding: '0.75rem', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={20} />
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          This assistant is for educational purposes. Always verify deadlines with official sources.
        </p>
      </div>
    </div>
  );
};

export default ChatArea;
