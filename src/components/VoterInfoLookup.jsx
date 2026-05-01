import { useState, Suspense, lazy, useCallback, memo } from 'react';
import { Search, MapPin, Loader2, Calendar } from 'lucide-react';
import { getElectionInfo, geocodeAddress } from '../utils/civicApi';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

const MapComponent = lazy(() => import('./MapComponent'));

/**
 * Voter Information Lookup Component
 * Fetches polling places and contests using Google Civic Information API
 * @param {Object} props - Component props
 */
const VoterInfoLookup = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState(null);
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches data for the given address
   * @param {string} addr - The address to look up
   */
  const fetchData = async (addr) => {
    if (!addr.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      // 1. Geocode the user address for map centering
      const coords = await geocodeAddress(addr);
      setCenter(coords);

      // 2. Fetch voter info
      const result = await getElectionInfo(addr);
      setData(result);
      
      // Track GA Event
      if (window.gtag) {
        window.gtag('event', 'polling_location_searched', { 
          address: addr.slice(0, 20) 
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function (Efficiency Priority 2)
  const debouncedFetch = useCallback(
    debounce((addr) => fetchData(addr), 500),
    []
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setAddress(val);
    debouncedFetch(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(address);
  };

  return (
    <div className="card animate-fade" style={{ maxWidth: '600px', width: '100%' }}>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <label htmlFor="polling-address" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Enter voter address</label>
        <input 
          id="polling-address"
          type="text" 
          value={address}
          onChange={handleInputChange}
          placeholder="Enter address (e.g., 1600 Amphitheatre Pkwy, CA)"
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0',
            fontSize: '0.875rem',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          aria-label="Search polling location"
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </form>

      {error && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: '1rem' }}>{error}</p>}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton" style={{ height: '80px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '300px', borderRadius: '8px' }} />
        </div>
      )}

      {!loading && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {data.election && (
            <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #DBEAFE' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB' }}>
                <Calendar size={18} />
                {data.election.name}
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem' }}><strong>Election Day:</strong> {data.election.electionDay}</p>
            </div>
          )}

          {data.pollingLocations && data.pollingLocations.length > 0 ? (
            <div>
              <h4 style={{ marginBottom: '0.75rem', color: '#0F172A' }}>Your Polling Location</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#fff' }}>
                  <p style={{ fontWeight: 600, margin: '0 0 0.25rem 0' }}>{data.pollingLocations[0].address.locationName}</p>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
                    {data.pollingLocations[0].address.line1}, {data.pollingLocations[0].address.city}
                  </p>
                  {data.pollingLocations[0].pollingHours && (
                    <p style={{ fontSize: '0.8125rem', margin: '0.5rem 0 0 0' }}><strong>Hours:</strong> {data.pollingLocations[0].pollingHours}</p>
                  )}
                </div>

                <Suspense fallback={<div className="skeleton" style={{ height: '300px', borderRadius: '8px' }} />}>
                  {center && <MapComponent center={center} locations={data.pollingLocations} />}
                </Suspense>
              </div>
            </div>
          ) : (
            data.election && <p style={{ fontSize: '0.875rem', color: '#64748B' }}>No specific polling locations found for this address in the upcoming election.</p>
          )}

          {data.contests && data.contests.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#0F172A' }}>Upcoming Contests</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.contests.map((contest, i) => (
                  <div key={i} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#f8fafc' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>{contest.office || contest.type}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>{contest.district?.name || 'Local District'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

VoterInfoLookup.propTypes = {
  // Add props if needed, currently none
};

export default memo(VoterInfoLookup);

