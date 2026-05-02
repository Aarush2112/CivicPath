import { describe, it, expect, vi } from 'vitest';
import { validateIssueReport } from '../utils/validation';

describe('Civic Assistant - Issue Validation', () => {
  it('should invalidate an empty report', () => {
    const report = {};
    const result = validateIssueReport(report);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should validate a correct report and sanitize input', () => {
    const report = {
      title: 'Large Pothole <script>alert("xss")</script>',
      description: 'There is a massive pothole on 5th avenue.',
      category: 'Infrastructure',
      location: { lat: 40.7128, lng: -74.0060 }
    };
    const result = validateIssueReport(report);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
    // Ensure script tags are removed by sanitization
    expect(result.sanitizedData.title).toBe('Large Pothole');
  });

  it('should invalidate a report missing a valid location', () => {
    const report = {
      title: 'Broken Streetlight',
      description: 'Streetlight is out, very dark.',
      category: 'Utilities',
      location: null
    };
    const result = validateIssueReport(report);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Valid location coordinates are required.');
  });
});
