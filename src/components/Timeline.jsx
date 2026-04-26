import React from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

const Timeline = ({ data }) => {
  if (!data) return null;

  const phases = [
    { label: 'Registration Deadline', date: data.registration_deadline },
    { label: 'Early Voting Starts', date: data.early_voting_start },
    { label: 'Mail Ballot Request Deadline', date: data.mail_ballot_request_deadline },
    { label: 'Early Voting Ends', date: data.early_voting_end },
    { label: 'Election Day', date: data.election_day, highlight: true },
    { label: 'Results Certification', date: data.certification_deadline }
  ];

  return (
    <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={20} color="var(--primary)" />
        {data.name} Election Timeline
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {phases.map((phase, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '1rem', minHeight: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: phase.highlight ? 'var(--accent)' : 'var(--primary)',
                marginTop: '6px'
              }} />
              {idx !== phases.length - 1 && (
                <div style={{ width: '2px', flex: 1, background: '#e2e8f0', margin: '4px 0' }} />
              )}
            </div>
            <div style={{ paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {phase.highlight ? <Clock size={14} color="var(--accent)" /> : <Calendar size={14} color="var(--primary-light)" />}
                <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: phase.highlight ? 'var(--accent)' : 'var(--text-main)' }}>
                  {phase.label}
                </p>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginLeft: '1.25rem' }}>
                {phase.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
