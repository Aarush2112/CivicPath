import { describe, it, expect } from 'vitest';
import { generateCalendarLink } from '../utils/civicApi';

describe('Logic and Utilities', () => {
  it('should generate a valid Google Calendar link', () => {
    const title = "Election Day";
    const date = "2026-11-03";
    const description = "Don't forget to vote!";
    
    const url = generateCalendarLink(title, date, description);
    
    expect(url).toContain('https://www.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain(encodeURIComponent(title));
    expect(url).toContain('20261103');
  });

  it('should handle different date formats in calendar link', () => {
    const url = generateCalendarLink("Test", "October 21, 2026", "Desc");
    expect(url).toContain('20261021');
  });
});
