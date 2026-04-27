import { useState } from 'react';
import { Search, MapPin, Loader2, Calendar } from 'lucide-react';
import { getElectionInfo } from '../utils/civicApi';

const VoterInfoLookup = () => {
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
      const result = await getElectionInfo(address);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <MapPin size={24} color="var(--primary)" />
        <h3 style={{ margin: 0 }}>Find Polling Location</h3>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#4285F4', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
        Powered by Google Maps & Civic Information API
      </p>
      
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Enter your registered voter address to find your polling location and upcoming elections.
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {data.election && (
            <div style={{ background: 'var(--secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <Calendar size={18} />
                {data.election.name}
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Election Date: {data.election.electionDay}</p>
            </div>
          )}

          {data.pollingLocations && data.pollingLocations.length > 0 ? (
            <div>
              <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-main)' }}>Your Polling Location</h4>
              {data.pollingLocations.slice(0, 1).map((location, i) => {
                const fullAddress = `${location.address.line1}, ${location.address.city}, ${location.address.state} ${location.address.zip}`;
                const encodedAddress = encodeURIComponent(fullAddress);
                const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
                
                return (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                      <p style={{ fontWeight: 600, margin: '0 0 0.25rem 0' }}>{location.address.locationName}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{fullAddress}</p>
                      {location.pollingHours && (
                        <p style={{ fontSize: '0.8125rem', margin: '0.5rem 0 0 0' }}><strong>Hours:</strong> {location.pollingHours}</p>
                      )}
                    </div>
                    {/* Google Maps Embed */}
                    <div style={{ width: '100%', height: '250px' }}>
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight="0" 
                        marginWidth="0" 
                        src={mapsUrl}
                        title="Google Maps Polling Location"
                      ></iframe>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            data.election && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No specific polling locations found for this address in the upcoming election.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VoterInfoLookup;
