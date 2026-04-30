import { useState } from 'react';
import { CheckSquare, Square, ClipboardCheck, Calendar, Check } from 'lucide-react';
import { addCalendarEvent } from '../utils/calendar';
import PropTypes from 'prop-types';

const Checklist = ({ jurisdictionName }) => {
  const [items, setItems] = useState([
    { id: 1, text: 'Check eligibility requirements', completed: false },
    { id: 2, text: 'Register to vote', completed: false },
    { id: 3, text: 'Confirm registration status', completed: false },
    { id: 4, text: 'Decide how you will vote (Mail/In-person)', completed: false },
    { id: 5, text: 'Review sample ballot', completed: false },
    { id: 6, text: 'Check polling place or drop-box location', completed: false },
    { id: 7, text: 'Prepare required ID/documents', completed: false },
    { id: 8, text: 'Cast your vote!', completed: false }
  ]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarSuccess, setCalendarSuccess] = useState(false);

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleAddDeadlines = async () => {
    setCalendarLoading(true);
    setCalendarSuccess(false);
    try {
      // Example deadlines - in a production app, these would come from the Civic API
      const deadlines = [
        { title: "Voter Registration Deadline", date: "2026-10-05", description: "Final day to register for the 2026 Midterm Elections." },
        { title: "Election Day 2026", date: "2026-11-03", description: "Don't forget to cast your vote! Polls open 7am-8pm." }
      ];
      
      for (const d of deadlines) {
        await addCalendarEvent(d);
      }
      setCalendarSuccess(true);
      setTimeout(() => setCalendarSuccess(false), 3000);
    } catch (error) {
      alert("Failed to add events. Please ensure you granted calendar permissions.");
    } finally {
      setCalendarLoading(false);
    }
  };

  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="card animate-slide" style={{ maxWidth: '450px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ClipboardCheck size={24} color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Voting Checklist</h3>
        </div>
        <button 
          onClick={handleAddDeadlines}
          disabled={calendarLoading}
          style={{
            background: calendarSuccess ? 'var(--success)' : 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease'
          }}
        >
          {calendarLoading ? <Loader2 size={12} className="animate-spin" /> : 
           calendarSuccess ? <Check size={12} /> : <Calendar size={12} />}
          {calendarSuccess ? 'Added to Google Calendar' : 'Sync Deadlines'}
        </button>
      </div>
      
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Step-by-step preparation for {jurisdictionName || 'your area'}.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${progress}%`, 
            background: 'var(--success)', 
            transition: 'width 0.3s ease' 
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: item.completed ? '#f0fdf4' : '#f8fafc',
              border: item.completed ? '1px solid #dcfce7' : '1px solid #e2e8f0',
              transition: 'all 0.2s ease'
            }}
          >
            {item.completed ? (
              <CheckSquare size={20} color="var(--success)" style={{ flexShrink: 0 }} />
            ) : (
              <Square size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
            )}
            <span style={{ 
              fontSize: '0.875rem', 
              color: item.completed ? '#166534' : 'var(--text-main)',
              textDecoration: item.completed ? 'line-through' : 'none'
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

Checklist.propTypes = {
  jurisdictionName: PropTypes.string
};

export default Checklist;


