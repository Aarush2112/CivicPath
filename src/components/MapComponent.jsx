import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import PropTypes from 'prop-types';

const MAPS_KEY = import.meta.env.VITE_MAPS_API_KEY || "";

/**
 * Advanced Map Component using Google Maps JavaScript API
 * Displays polling locations or reported civic issues, and allows click-to-pin
 */
const MapComponent = ({ 
  center, 
  locations = [], 
  onMapClick, 
  isReportingMode = false, 
  newPinLocation = null,
  onMarkerClick 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Guard: If MAPS_KEY is missing, show a fallback UI
  if (!MAPS_KEY) {
    return (
      <div style={{ 
        width: '100%', 
        height: '300px', 
        borderRadius: 'var(--radius-md)', 
        background: '#f1f5f9',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Map Unavailable
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
          Google Maps API key is not configured. Please check your environment variables.
        </p>
      </div>
    );
  }

  const handleMapClick = (e) => {
    if (isReportingMode && onMapClick) {
      onMapClick({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng
      });
    }
  };

  return (
    <APIProvider apiKey={MAPS_KEY}>
      <div 
        style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}
        aria-label="Interactive Map for Civic Issues"
      >
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId="bf51a910020fa561" 
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          onClick={handleMapClick}
          style={{ cursor: isReportingMode ? 'crosshair' : 'grab' }}
        >
          {/* Render existing locations (either polling places or reported issues) */}
          {locations.map((loc, index) => {
            const lat = loc.latitude || loc.location?.lat || center.lat;
            const lng = loc.longitude || loc.location?.lng || center.lng;
            const position = { lat, lng };
            
            // Differentiate pin style based on data type
            const isIssue = !!loc.category;
            const bgColor = isIssue ? '#EF4444' : '#2563EB'; // Red for issues, Blue for polling
            const borderColor = isIssue ? '#B91C1C' : '#1E40AF';

            return (
              <AdvancedMarker
                key={loc.id || index}
                position={position}
                onClick={() => {
                  setSelectedLocation(loc);
                  if (onMarkerClick) onMarkerClick(loc);
                }}
              >
                <Pin background={bgColor} glyphColor={'#FFF'} borderColor={borderColor} />
              </AdvancedMarker>
            );
          })}

          {/* Render the user's new pin when in reporting mode */}
          {isReportingMode && newPinLocation && (
            <AdvancedMarker position={newPinLocation}>
              <Pin background={'#F59E0B'} glyphColor={'#FFF'} borderColor={'#D97706'} />
            </AdvancedMarker>
          )}

          {/* Info Window for selected location */}
          {selectedLocation && (
            <InfoWindow
              position={{ 
                lat: selectedLocation.latitude || selectedLocation.location?.lat || center.lat, 
                lng: selectedLocation.longitude || selectedLocation.location?.lng || center.lng 
              }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div style={{ padding: '4px', maxWidth: '200px' }}>
                {selectedLocation.category ? (
                  // Civic Issue Layout
                  <>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#EF4444' }}>{selectedLocation.title}</h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 600 }}>{selectedLocation.category}</p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#64748B' }}>{selectedLocation.description}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>Status: {selectedLocation.status}</p>
                  </>
                ) : (
                  // Polling Location Layout
                  <>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{selectedLocation?.address?.locationName || "Location"}</h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748B' }}>
                      {selectedLocation?.address?.line1}, {selectedLocation?.address?.city}
                    </p>
                    {selectedLocation.pollingHours && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '11px' }}><strong>Hours:</strong> {selectedLocation.pollingHours}</p>
                    )}
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((selectedLocation?.address?.line1 || '') + ' ' + (selectedLocation?.address?.city || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-block',
                        background: '#2563EB',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Get Directions
                    </a>
                  </>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

MapComponent.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  onMapClick: PropTypes.func,
  isReportingMode: PropTypes.bool,
  newPinLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }),
  onMarkerClick: PropTypes.func
};

export default MapComponent;
