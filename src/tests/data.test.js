import { describe, it, expect } from 'vitest';
import { electionData } from '../data/electionData';

describe('Election Data Integrity', () => {
  it('should have required fields for all states', () => {
    const states = Object.keys(electionData);
    expect(states.length).toBeGreaterThan(0);

    states.forEach(stateKey => {
      const state = electionData[stateKey];
      expect(state.name).toBeDefined();
      expect(state.registration_deadline).toBeDefined();
      expect(state.early_voting_start).toBeDefined();
      expect(state.election_day).toBeDefined();
      expect(state.certification_deadline).toBeDefined();
      expect(Array.isArray(state.official_sources)).toBe(true);
    });
  });

  it('should have consistent election day across states', () => {
    const states = Object.keys(electionData);
    const electionDay = electionData[states[0]].election_day;
    
    states.forEach(stateKey => {
      expect(electionData[stateKey].election_day).toBe(electionDay);
    });
  });
});
