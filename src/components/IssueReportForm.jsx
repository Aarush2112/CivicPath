import { useState } from 'react';
import PropTypes from 'prop-types';
import MapComponent from './MapComponent';
import { validateIssueReport } from '../utils/validation';
import { submitReport } from '../utils/firebase';

const IssueReportForm = ({ user, onReportSubmitted }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [location, setLocation] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Default center for map (fallback if geolocation fails)
  const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // Center of US

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors.length > 0) setErrors([]);
  };

  const handleMapClick = (latLng) => {
    setLocation(latLng);
    if (errors.length > 0) setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    
    const reportPayload = {
      ...formData,
      location
    };

    const validation = validateIssueReport(reportPayload);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the sanitized data for submission
      const result = await submitReport(user?.uid, validation.sanitizedData);
      setSuccess(true);
      if (onReportSubmitted) {
        onReportSubmitted(result);
      }
      
      // Reset form after short delay
      setTimeout(() => {
        setFormData({ title: '', description: '', category: '' });
        setLocation(null);
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setErrors(["Failed to submit report. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ color: '#10B981', marginBottom: '1rem' }}>Report Submitted Successfully!</h3>
        <p style={{ color: 'var(--text-muted)' }}>Thank you for helping improve our community. Your issue has been logged.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="btn-primary"
          style={{ marginTop: '1.5rem' }}
        >
          Report Another Issue
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.5rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Report a Civic Issue</h2>
      
      {errors.length > 0 && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }} role="alert">
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="title" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Issue Title <span style={{ color: '#EF4444' }}>*</span></label>
          <input 
            type="text" 
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Large pothole on Main St"
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface-light)', color: 'var(--text-primary)' }}
            aria-required="true"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="category" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Category <span style={{ color: '#EF4444' }}>*</span></label>
          <select 
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface-light)', color: 'var(--text-primary)' }}
            aria-required="true"
          >
            <option value="">Select a category</option>
            <option value="Infrastructure">Infrastructure (Potholes, Sidewalks)</option>
            <option value="Sanitation">Sanitation (Trash, Graffiti)</option>
            <option value="Utilities">Utilities (Streetlights, Water Leaks)</option>
            <option value="Public Safety">Public Safety (Traffic Signs, Hazards)</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Description <span style={{ color: '#EF4444' }}>*</span></label>
          <textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide specific details about the issue..."
            rows={4}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface-light)', color: 'var(--text-primary)', resize: 'vertical' }}
            aria-required="true"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Location <span style={{ color: '#EF4444' }}>*</span></label>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Click on the map to drop a pin at the issue location.</p>
          <div style={{ marginTop: '0.5rem' }}>
            <MapComponent 
              center={defaultCenter} 
              isReportingMode={true}
              onMapClick={handleMapClick}
              newPinLocation={location}
            />
          </div>
          {location && (
            <p style={{ fontSize: '0.75rem', color: '#10B981', margin: '0.5rem 0 0 0' }}>✓ Location selected ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary"
          style={{ padding: '0.875rem', fontSize: '1rem', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>

      </form>
    </div>
  );
};

IssueReportForm.propTypes = {
  user: PropTypes.object,
  onReportSubmitted: PropTypes.func
};

export default IssueReportForm;
