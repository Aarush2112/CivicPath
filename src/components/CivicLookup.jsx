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

      {!loading && data && data.offices && data.officials && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: '0.5rem' }}>
            Officials for your address
          </p>
          {data.offices.map((office, officeIndex) => (
            <div key={officeIndex} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.8125rem', color: 'var(--primary)', margin: '0.5rem 0 0.25rem 0', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                {office.name}
              </h4>
              {office.officialIndices.map((idx) => {
                const official = data.officials[idx];
                return (
                  <div key={idx} className="card animate-slide" style={{ padding: '12px', background: '#fff', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {official.photoUrl ? (
                      <img 
                        src={official.photoUrl} 
                        alt={official.name} 
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f1f5f9' }} 
                      />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#94a3b8' }}>
                        <User size={24} style={{ margin: 'auto' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>{official.name}</p>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 700, 
                          color: official.party?.includes('Democrat') ? '#2563EB' : official.party?.includes('Republican') ? '#DC2626' : '#64748B',
                          background: official.party?.includes('Democrat') ? '#EFF6FF' : official.party?.includes('Republican') ? '#FEF2F2' : '#F8FAFC',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {official.party || 'Nonpartisan'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {official.urls?.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${official.name} website`} style={{ color: '#64748B' }}><Globe size={14} /></a>
                        ))}
                        {official.phones?.map((phone, i) => (
                          <a key={i} href={`tel:${phone}`} aria-label={`${official.name} phone`} style={{ color: '#64748B' }}><Phone size={14} /></a>
                        ))}
                        {official.channels?.map((channel, i) => (
                          <a key={i} href={`https://www.${channel.type.toLowerCase()}.com/${channel.id}`} target="_blank" rel="noopener noreferrer" aria-label={`${official.name} on ${channel.type}`} style={{ color: '#64748B' }}>
                            {getSocialIcon(channel.type)}
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

      {!loading && data && (!data.offices || data.offices.length === 0) && (
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', padding: '20px' }}>
          No representative data found for this address.
        </p>
      )}
    </div>
  );
};

export default CivicLookup;

