import React from 'react';
import PropTypes from 'prop-types';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

/**
 * Main chat interface for CivicPath
 * @param {Object} props
 * @param {Array} props.messages - List of chat messages
 * @param {Function} props.onSendMessage - Callback for sending messages
 * @param {boolean} props.isLoading - Whether the AI is thinking/streaming
 */
const ChatArea = ({ messages, onSendMessage, isLoading }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

ChatArea.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isStreaming: PropTypes.bool,
    component: PropTypes.node
  })).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ChatArea;


