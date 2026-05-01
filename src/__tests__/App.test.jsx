import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import React from 'react';

// Mock complex utilities and APIs
vi.mock('../utils/firebase', () => ({
  loginAnonymously: vi.fn().mockResolvedValue({ uid: 'test-user' }),
  saveChatSession: vi.fn(),
  loadChatSession: vi.fn().mockResolvedValue([])
}));

vi.mock('../utils/gemini', () => ({
  getAssistantResponse: vi.fn().mockResolvedValue('Mock AI Response')
}));

vi.mock('../utils/calendar', () => ({
  initCalendarClient: vi.fn()
}));

// Mock ResizeObserver which is often needed for some UI components in tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state and welcome message', async () => {
    render(<App />);
    expect(screen.getByText(/Welcome to CivicPath/i)).toBeInTheDocument();
  });

  it('shows sidebar navigation items', () => {
    render(<App />);
    expect(screen.getByLabelText(/Find your local representatives/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Find your local polling location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/View voting checklist/i)).toBeInTheDocument();
  });

  it('allows user to type in the chat input and send a message', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Ask about the election process/i);

    fireEvent.change(input, { target: { value: 'How do I register?' } });
    expect(input.value).toBe('How do I register?');

    fireEvent.submit(input.closest('form'));
    
    await waitFor(() => {
      expect(screen.queryByText('How do I register?')).toBeInTheDocument();
    });
  });
});
