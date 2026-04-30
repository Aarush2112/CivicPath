import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock components that use complex APIs
vi.mock('../utils/firebase', () => ({
  loginAnonymously: vi.fn().mockResolvedValue({ uid: 'test-user' }),
  saveChatSession: vi.fn(),
  loadChatSession: vi.fn().mockResolvedValue([])
}));

vi.mock('../components/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

vi.mock('../components/ChatArea', () => ({
  default: () => <div data-testid="chat-area">ChatArea</div>
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('sidebar')).toBeDefined();
    expect(screen.getByTestId('chat-area')).toBeDefined();
  });
});
