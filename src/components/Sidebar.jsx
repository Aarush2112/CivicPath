import { Book, HelpCircle, MapPin, CheckSquare, Info, RefreshCw } from 'lucide-react';

const Sidebar = ({ onSelectSection, currentJurisdiction, onReset }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '0.25rem', fontFamily: 'Outfit' }}>
          CivicPath
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.2' }}>
          Your smart guide to the voting process
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        <SidebarItem 
          icon={<Info size={18} />} 
          label="The Process" 
          onClick={() => onSelectSection('process')} 
          ariaLabel="Learn about the general election process"
        />
        <SidebarItem 
          icon={<MapPin size={18} />} 
          label="Jurisdictions" 
          onClick={() => onSelectSection('jurisdictions')} 
          ariaLabel="View available state data"
        />
        <SidebarItem 
          icon={<CheckSquare size={18} />} 
          label="My Checklist" 
          onClick={() => onSelectSection('checklist')} 
          ariaLabel="Open your voting checklist"
        />
        <SidebarItem 
          icon={<HelpCircle size={18} />} 
          label="Common FAQs" 
          onClick={() => onSelectSection('faq')} 
          ariaLabel="Read frequently asked questions"
        />
        <SidebarItem 
          icon={<Book size={18} />} 
          label="Glossary" 
          onClick={() => onSelectSection('glossary')} 
          ariaLabel="View election terms glossary"
        />
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="sidebar-logo card" style={{ padding: '0.75rem', background: 'var(--secondary)', border: 'none' }}>
          <p style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--primary)', margin: 0 }}>
            Current Focus
          </p>
          <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            {currentJurisdiction ? currentJurisdiction.name : 'Not selected'}
          </p>
        </div>
        <SidebarItem 
          icon={<RefreshCw size={18} />} 
          label="Reset Chat" 
          onClick={onReset} 
          ariaLabel="Reset the conversation"
        />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, onClick, ariaLabel }) => (
  <button 
    onClick={onClick}
    aria-label={ariaLabel}
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
      fontSize: '0.9375rem',
      color: 'var(--text-main)',
      transition: 'all 0.2s',
      fontFamily: 'Inter',
      fontWeight: 500
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <span style={{ color: 'var(--primary-light)', display: 'flex' }}>{icon}</span>
    <span className="sidebar-logo">{label}</span>
  </button>
);

export default Sidebar;

