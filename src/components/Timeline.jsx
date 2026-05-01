import { useState } from 'react';
import { Calendar, Clock, FileText, Send, Landmark, BadgeCheck, Loader2, Check } from 'lucide-react';
import { addCalendarEvent } from '../utils/calendar';
import PropTypes from 'prop-types';

/**
 * Election Timeline Component
 * Displays key election dates and allows adding them to Google Calendar
 * @param {Object} props
 * @param {Object} props.data - Jurisdiction data containing deadlines
 */
const Timeline = ({ data }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  if (!data) return null;

  const phases = [
    { id: 'reg', label: 'Registration Deadline', date: data.registration_deadline, icon: <Landmark size={16} /> },
    { id: 'es', label: 'Early Voting Starts', date: data.early_voting_start, icon: <Clock size={16} /> },
    { id: 'mail', label: 'Mail Ballot Request', date: data.mail_ballot_request_deadline, icon: <Send size={16} /> },
    { id: 'ee', label: 'Early Voting Ends', date: data.early_voting_end, icon: <Clock size={16} /> },
    { id: 'ed', label: 'Election Day', date: data.election_day, highlight: true, icon: <BadgeCheck size={16} /> },
    { id: 'cert', label: 'Results Certification', date: data.certification_deadline, icon: <FileText size={16} /> }
  ];

  /**
   * Handles adding an event to Google Calendar via OAuth
   * @param {Object} phase - The phase object containing label and date
   */
  const handleAddToCalendar = async (phase) => {
    setLoadingId(phase.id);
    try {
      await addCalendarEvent({
        title: `${phase.label} - ${data.name}`,
        date: phase.date,
        description: `Election reminder for ${data.name}. Visit ${data.official_sources?.[0]?.url || 'official sources'} for more info.`
      });
      setSuccessId(phase.id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (error) {
      console.error("Failed to add to calendar:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '450px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Calendar size={24} color="var(--primary)" />
        <div>
          <h3 style={{ margin: 0 }}>{data.name} Timeline</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Important dates for the 2026 Midterms</p>
        </div>
      </div>
      
      <div style={{ paddingLeft: '0.5rem' }}>
        {phases.map((phase, idx) => (
          <div key={idx} className="timeline-item" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ 
                  marginTop: '0.25rem',
                  color: phase.highlight ? '#B45309' : '#2563EB',
                  background: phase.highlight ? '#FFFBEB' : '#EFF6FF',
                  padding: '0.35rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {phase.icon}
                </div>
                <div>
                  <p style={{ 
                    fontWeight: 600, 
                    fontSize: '0.9375rem', 
                    color: phase.highlight ? '#B45309' : '#0F172A',
                    margin: 0
                  }}>
                    {phase.label}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                    {phase.date}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => handleAddToCalendar(phase)}
                disabled={loadingId === phase.id}
                aria-label={`Add ${phase.label} to Google Calendar`}
                style={{ 
                  padding: '0.4rem 0.75rem', 
                  fontSize: '0.75rem', 
                  borderRadius: '6px',
                  background: successId === phase.id ? '#10B981' : phase.highlight ? '#B45309' : '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: 'none',
                  color: 'white',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s ease'
                }}
              >
                {loadingId === phase.id ? <Loader2 size={14} className="animate-spin" /> : 
                 successId === phase.id ? <Check size={14} /> : <Calendar size={14} />}
                {successId === phase.id ? 'Added' : 'Sync'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Timeline.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    registration_deadline: PropTypes.string,
    early_voting_start: PropTypes.string,
    mail_ballot_request_deadline: PropTypes.string,
    early_voting_end: PropTypes.string,
    election_day: PropTypes.string,
    certification_deadline: PropTypes.string,
    official_sources: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string
    }))
  }).isRequired
};

export default Timeline;


