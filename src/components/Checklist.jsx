import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';

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

  return (
    <div className="card" style={{ border: '1px solid #e2e8f0', maxWidth: '500px' }}>
      <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Voting Checklist
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Progress for {jurisdictionName || 'your area'}: {completedCount}/{items.length} completed
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #f1f5f9',
              background: item.completed ? '#f0fdf4' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s'
            }}
          >
            {item.completed ? (
              <CheckSquare size={20} color="var(--success)" />
            ) : (
              <Square size={20} color="#cbd5e1" />
            )}
            <span style={{ 
              fontSize: '0.9375rem', 
              color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
              textDecoration: item.completed ? 'line-through' : 'none'
            }}>
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Checklist;
