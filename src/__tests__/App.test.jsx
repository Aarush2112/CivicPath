import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import React from 'react';

// Mock complex utilities and APIs
vi.mock('../utils/firebase', () => ({
  loginAnonymously: vi.fn().mockResolvedValue({ uid: 'test-user' }),
  saveChatSession: vi.fn(),
  loadChatSession: vi.fn().mockResolvedValue([]),
  fetchReports: vi.fn().mockResolvedValue([])
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
    // Wait for the async initAuth to complete
    await waitFor(() => {
      expect(screen.getByText(/Welcome to CivicPath/i)).toBeInTheDocument();
    });
  });

  it('shows sidebar navigation items', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByLabelText(/Report a new civic issue/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Find your local representatives/i)).toBeInTheDocument();
    });
  });

  it('allows user to type in the chat input and send a message', async () => {
    render(<App />);
    
    let input;
    await waitFor(() => {
      input = screen.getByPlaceholderText(/Ask about the election process/i);
      expect(input).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'How do I register?' } });
    expect(input.value).toBe('How do I register?');

    fireEvent.submit(input.closest('form'));
    
    await waitFor(() => {
      expect(screen.queryByText('How do I register?')).toBeInTheDocument();
    });
  });
});
