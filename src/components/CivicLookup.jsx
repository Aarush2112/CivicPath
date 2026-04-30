import { useState, useCallback } from 'react';
import { Search, User, Building, Loader2, Globe, Phone, Share2, ExternalLink } from 'lucide-react';
import { getRepresentativeInfo } from '../utils/civicApi';
import debounce from 'lodash.debounce';

/**
 * Official Civic Lookup Component
 * Displays representatives with photos, party info, and social links
 */
const CivicLookup = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search function (Efficiency Priority 2)
  const debouncedSearch = useCallback(
    debounce(async (val) => {
      if (!val.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getRepresentativeInfo(val);
        setData(result);
        if (window.gtag) {
          window.gtag('event', 'representative_lookup', { jurisdiction: result.normalizedInput?.city });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setAddress(val);
    debouncedSearch(val);
  };

  const getSocialIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'twitter': 
      case 'facebook': 
      case 'youtube':
      case 'instagram':
        return <Share2 size={14} />;
      default: return <ExternalLink size={14} />;
    }
  };

  return (
    <div className="card animate-fade" style={{ maxWidth: '500px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Building size={24} color="var(--primary)" />
        <h3 style={{ margin: 0 }}>Official Civic Lookup</h3>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#4285F4', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
        Powered by Google Civic Information API
      </p>
      
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Enter your address to find your local, state, and federal representatives.
      </p>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          value={address}
          onChange={handleInputChange}
          placeholder="Enter address (e.g., 1600 Amphitheatre Pkwy, CA)"
          style={{
            width: '100%',
            padding: '0.625rem 2.5rem 0.625rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
          {loading ? <Loader2 size={16} className="animate-spin" color="var(--primary)" /> : <Search size={16} color="#94a3b8" />}
        </div>
      </div>

      {error && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: '1rem' }}>{error}</p>}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="skeleton" style={{ height: '60px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '60px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '60px', borderRadius: '8px' }} />
        </div>
      )}

      {!loading && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {data.offices.map((office, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{office.name}</p>
              {office.officialIndices.map(idx => {
                const official = data.officials[idx];
                const partyColor = official.party?.includes('Democrat') ? '#2563EB' : official.party?.includes('Republican') ? '#EF4444' : '#64748B';
                
                return (
                  <div key={idx} className="card" style={{ display: 'flex', gap: '1rem', padding: '10px', background: '#fff' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#f1f5f9' }}>
                      {official.photoUrl ? (
                        <img src={official.photoUrl} alt={official.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                          <User size={24} color="#cbd5e1" />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{official.name}</span>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 700, 
                          color: 'white', 
                          background: partyColor, 
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}>
                          {official.party?.split(' ')[0]}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {official.urls?.[0] && (
                          <a href={official.urls[0]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} title="Website"><Globe size={14} /></a>
                        )}
                        {official.phones?.[0] && (
                          <a href={`tel:${official.phones[0]}`} style={{ color: 'var(--text-muted)' }} title="Call"><Phone size={14} /></a>
                        )}
                        {official.channels?.map((ch, ci) => (
                          <a key={ci} href={`https://${ch.type.toLowerCase()}.com/${ch.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }} title={ch.type}>
                            {getSocialIcon(ch.type)}
                          </a>
                        ))}
                      </div>
                    </div>
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

