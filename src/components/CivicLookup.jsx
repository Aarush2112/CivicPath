import React, { useState } from 'react';
import { Search, MapPin, User, Building, ExternalLink, Loader2 } from 'lucide-react';
import { getRepresentativeInfo } from '../utils/civicApi';

const CivicLookup = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await getRepresentativeInfo(address);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Building size={24} color="var(--primary)" />
        <h3 style={{ margin: 0 }}>Official Representative Lookup</h3>
      </div>
      
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Enter your address to find your local, state, and federal representatives.
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address (e.g., 1600 Amphitheatre Pkwy, CA)"
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0',
            fontSize: '0.875rem'
          }}
        />
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </form>

      {error && <p style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{error}</p>}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {data.offices.map((office, i) => (
            <div key={i} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--primary)' }}>{office.name}</p>
              {office.officialIndices.map(idx => {
                const official = data.officials[idx];
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <User size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.875rem' }}>{official.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({official.party})</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CivicLookup;
