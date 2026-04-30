import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import PropTypes from 'prop-types';

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

/**
 * Advanced Map Component using Google Maps JavaScript API
 * Displays polling locations with custom markers and info windows
 */
const MapComponent = ({ center, locations }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId="bf51a910020fa561" // Example Map ID for advanced markers
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {locations.map((loc, index) => {
            const position = { 
              lat: loc.latitude || center.lat, // In a real app, you'd geocode these too or use API results
              lng: loc.longitude || center.lng 
            };
            
            return (
              <AdvancedMarker
                key={index}
                position={position}
                onClick={() => setSelectedLocation(loc)}
              >
                <Pin background={'#2563EB'} glyphColor={'#FFF'} borderColor={'#1E40AF'} />
              </AdvancedMarker>
            );
          })}

          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.latitude || center.lat, lng: selectedLocation.longitude || center.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div style={{ padding: '4px', maxWidth: '200px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{selectedLocation.address.locationName}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748B' }}>
                  {selectedLocation.address.line1}, {selectedLocation.address.city}
                </p>
                {selectedLocation.pollingHours && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '11px' }}><strong>Hours:</strong> {selectedLocation.pollingHours}</p>
                )}
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedLocation.address.line1 + ' ' + selectedLocation.address.city)}`}
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
  locations: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default MapComponent;
