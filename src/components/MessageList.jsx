import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

const MessageList = ({ messages, isLoading }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Using scrollTo instead of scrollIntoView prevents the whole page from shifting
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={containerRef}
      role="log" 
      aria-live="polite" 
      style={{ 
        flex: 1, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        scrollbarWidth: 'thin', 
        scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
        padding: '24px',
        gap: '20px'
      }}
    >
      {messages.length === 1 ? (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '40px 24px',
          animation: 'fadeIn 0.6s ease-out',
          margin: 'auto'
        }}>
          <h1 className="text-gradient" style={{ 
            fontSize: 'clamp(32px, 5vw, 56px)', 
            fontWeight: 800, 
            textAlign: 'center', 
            letterSpacing: '-0.03em', 
            lineHeight: 1.15,
            margin: 0,
            paddingBottom: '8px'
          }}>
            Welcome to CivicPath
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--text-secondary)', 
            textAlign: 'center', 
            maxWidth: '480px', 
            marginTop: '16px', 
            lineHeight: 1.6,
            fontWeight: 500
          }}>
            Your intelligent companion for navigating the democratic process with confidence and clarity.
          </p>
          <div style={{ 
            width: '80px', 
            height: '4px', 
            borderRadius: '2px', 
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))', 
            margin: '24px auto 0',
            boxShadow: 'var(--shadow-glow)'
          }} />
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <div 
              key={msg.id || index} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                maxWidth: '80%',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div className={msg.sender === 'bot' ? 'glass-panel' : ''} style={{ 
                background: msg.sender === 'bot' ? 'rgba(255, 255, 255, 0.85)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: msg.sender === 'bot' ? 'var(--text-primary)' : '#FFFFFF',
                border: msg.sender === 'bot' ? '1px solid rgba(255, 255, 255, 0.9)' : 'none',
                borderRadius: msg.sender === 'bot' ? '20px 20px 20px 6px' : '20px 20px 6px 20px',
                padding: '14px 20px',
                fontSize: '15px',
                lineHeight: 1.6,
                boxShadow: msg.sender === 'bot' ? 'var(--shadow-sm)' : 'var(--shadow-md)',
                position: 'relative',
                backdropFilter: msg.sender === 'bot' ? 'blur(12px)' : 'none'
              }}>
                {msg.isStreaming && !msg.text ? (
                  <div style={{ display: 'flex', gap: '4px', padding: '4px 0', alignItems: 'center' }}>
                    <div className="typing-dot" style={{ animationDelay: '0s' }} />
                    <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                    <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap', fontWeight: msg.sender === 'user' ? 500 : 400 }}>{msg.text}</div>
                )}
              </div>
              {msg.component && !msg.isStreaming && (
                <div style={{ marginTop: '16px', width: '100%' }}>
                  {msg.component}
                </div>
              )}
            </div>
          ))}
          {isLoading && (!messages[messages.length - 1] || !messages[messages.length - 1].isStreaming) && (
            <div className="glass-panel" style={{ 
              alignSelf: 'flex-start',
              borderRadius: '20px 20px 20px 6px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <Loader2 className="animate-spin" size={18} color="var(--primary)" />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Thinking...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isStreaming: PropTypes.bool,
    component: PropTypes.node
  })).isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default MessageList;
