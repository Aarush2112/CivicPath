import { useState } from 'react';
import { CheckSquare, Square, ClipboardCheck } from 'lucide-react';

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

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="card" style={{ maxWidth: '450px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <ClipboardCheck size={24} color="var(--primary)" />
        <h3 style={{ margin: 0 }}>Voting Checklist</h3>
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
            className="checklist-item"
            style={{
              background: item.completed ? '#f0fdf4' : 'transparent',
              border: item.completed ? '1px solid #dcfce7' : '1px solid transparent'
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

export default Checklist;

