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
        scrollbarColor: '#CBD5E1 transparent',
        padding: '24px',
        gap: '16px'
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
          animation: 'fadeIn 0.5s ease-out',
          margin: 'auto'
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
        <>
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
          {isLoading && (!messages[messages.length - 1] || !messages[messages.length - 1].isStreaming) && (
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
