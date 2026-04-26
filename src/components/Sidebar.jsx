import { Book, HelpCircle, MapPin, CheckSquare, Info, RefreshCw } from 'lucide-react';

const Sidebar = ({ onSelectSection, currentJurisdiction, onReset }) => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          CivicPath
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Your guide to the voting process
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SidebarItem 
          icon={<Info size={20} />} 
          label="The Process" 
          onClick={() => onSelectSection('process')} 
        />
        <SidebarItem 
          icon={<MapPin size={20} />} 
          label="Jurisdictions" 
          onClick={() => onSelectSection('jurisdictions')} 
        />
        <SidebarItem 
          icon={<CheckSquare size={20} />} 
          label="My Checklist" 
          onClick={() => onSelectSection('checklist')} 
        />
        <SidebarItem 
          icon={<HelpCircle size={20} />} 
          label="Common FAQs" 
          onClick={() => onSelectSection('faq')} 
        />
        <SidebarItem 
          icon={<Book size={20} />} 
          label="Glossary" 
          onClick={() => onSelectSection('glossary')} 
        />
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div className="card" style={{ padding: '1rem', background: 'var(--secondary)', border: 'none' }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>
            Current Focus
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            {currentJurisdiction ? currentJurisdiction.name : 'Not selected'}
          </p>
        </div>
        <SidebarItem 
          icon={<RefreshCw size={20} />} 
          label="Reset Chat" 
          onClick={onReset} 
        />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      width: '100%',
      border: 'none',
      background: 'transparent',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      textAlign: 'left',
      fontSize: '1rem',
      color: 'var(--text-main)',
      transition: 'background 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <span style={{ color: 'var(--primary-light)' }}>{icon}</span>
    {label}
  </button>
);

export default Sidebar;
