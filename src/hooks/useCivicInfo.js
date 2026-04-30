import { useState, useCallback } from 'react';
import { getElectionInfo } from '../utils/civicApi';

/**
 * Custom hook for fetching voter information
 * @param {string} initialAddress 
 */
export const useCivicInfo = (initialAddress = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInfo = useCallback(async (address) => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getElectionInfo(address);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchInfo };
};
