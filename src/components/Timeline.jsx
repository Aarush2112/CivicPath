
import { Calendar, Clock, FileText, Send, Landmark, BadgeCheck, Plus } from 'lucide-react';
import { generateCalendarLink } from '../utils/civicApi';

const Timeline = ({ data }) => {
  if (!data) return null;

  const phases = [
    { id: 'reg', label: 'Registration Deadline', date: data.registration_deadline, icon: <Landmark size={16} /> },
    { id: 'es', label: 'Early Voting Starts', date: data.early_voting_start, icon: <Clock size={16} /> },
    { id: 'mail', label: 'Mail Ballot Request', date: data.mail_ballot_request_deadline, icon: <Send size={16} /> },
    { id: 'ee', label: 'Early Voting Ends', date: data.early_voting_end, icon: <Clock size={16} /> },
    { id: 'ed', label: 'Election Day', date: data.election_day, highlight: true, icon: <BadgeCheck size={16} /> },
    { id: 'cert', label: 'Results Certification', date: data.certification_deadline, icon: <FileText size={16} /> }
  ];

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
          <div key={idx} className="timeline-item">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ 
                  marginTop: '0.25rem',
                  color: phase.highlight ? 'var(--accent)' : 'var(--primary-light)',
                  background: phase.highlight ? '#fffbeb' : '#eff6ff',
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
                    color: phase.highlight ? 'var(--accent)' : 'var(--text-main)',
                    margin: 0
                  }}>
                    {phase.label}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                    {phase.date}
                  </p>
                </div>
              </div>
              
              <a 
                href={generateCalendarLink(
                  `${phase.label} - ${data.name}`, 
                  phase.date, 
                  `Election reminder for ${data.name}. Visit ${data.official_sources[0].url} for more info.`
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ 
                  padding: '0.25rem 0.5rem', 
                  fontSize: '0.65rem', 
                  borderRadius: '6px',
                  background: phase.highlight ? 'var(--accent)' : 'var(--primary-light)'
                }}
                title="Add to Google Calendar"
              >
                <Plus size={12} />
                Remind
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;


