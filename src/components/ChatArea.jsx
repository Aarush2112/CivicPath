import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}>
        {messages.length === 1 ? (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px 24px',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(28px, 4vw, 48px)', 
              fontWeight: 800, 
              color: '#0F172A', 
              textAlign: 'center', 
              letterSpacing: '-0.02em', 
              lineHeight: 1.15,
              margin: 0
            }}>
              Welcome to CivicPath
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#64748B', 
              textAlign: 'center', 
              maxWidth: '440px', 
              marginTop: '12px', 
              lineHeight: 1.6,
              margin: '12px 0 0 0'
            }}>
              Your intelligent companion for navigating the democratic process with confidence and clarity.
            </p>
            <div style={{ 
              width: '60px', 
              height: '3px', 
              borderRadius: '2px', 
              background: 'linear-gradient(90deg, #2563EB, #0EA5E9)', 
              margin: '20px auto 0' 
            }} />
          </div>
        ) : (
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, index) => (
              <div 
                key={msg.id || index} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                  maxWidth: '75%',
                  animation: 'slideUp 0.3s ease-out'
                }}
              >
                <div style={{ 
                  background: msg.sender === 'bot' ? '#FFFFFF' : '#2563EB',
                  color: msg.sender === 'bot' ? '#0F172A' : '#FFFFFF',
                  border: msg.sender === 'bot' ? '1px solid #E2E8F0' : 'none',
                  borderRadius: msg.sender === 'bot' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  padding: msg.sender === 'bot' ? '14px 18px' : '12px 16px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  boxShadow: msg.sender === 'bot' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  position: 'relative'
                }}>
                  {msg.isStreaming && !msg.text ? (
                    <div style={{ display: 'flex', gap: '4px', padding: '4px 0' }}>
                      <div className="typing-dot" style={{ animationDelay: '0s' }} />
                      <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                      <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  )}
                </div>
                {msg.component && !msg.isStreaming && (
                  <div style={{ marginTop: '12px', width: '100%' }}>
                    {msg.component}
                  </div>
                )}
              </div>
            ))}
            {isLoading && !messages[messages.length - 1].isStreaming && (
              <div style={{ 
                alignSelf: 'flex-start',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'slideUp 0.3s ease-out'
              }}>
                <Loader2 className="animate-spin" size={16} color="#2563EB" />
                <span style={{ fontSize: '13px', color: '#64748B' }}>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '16px 24px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {TOPICS.map((topic, i) => (
            <button 
              key={i} 
              onClick={() => onSendMessage(topic.query)}
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
          <input
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
    </div>
  );
};

export default ChatArea;

