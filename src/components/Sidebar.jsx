import { Book, HelpCircle, MapPin, CheckSquare, RefreshCw, Landmark, ExternalLink } from 'lucide-react';

const Sidebar = ({ onSelectSection, currentJurisdiction, onReset }) => {
  return (
    <aside className="sidebar">
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 700, 
        color: '#2563EB', 
        padding: '0 8px 20px 8px', 
        borderBottom: '1px solid #E2E8F0', 
        marginBottom: '12px' 
      }}>
        CivicPath
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <SidebarItem 
          icon={<Landmark size={18} />} 
          label="Find Representatives" 
          onClick={() => onSelectSection('lookup')} 
          ariaLabel="Find your local representatives"
        />
        <SidebarItem 
          icon={<MapPin size={18} />} 
          label="Find Polling Location" 
          onClick={() => onSelectSection('polling')} 
          ariaLabel="Find your local polling location"
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
        
        <div style={{ margin: '12px 0', padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
          <p style={{ fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '11px', margin: 0 }}>
            Current Focus
          </p>
          <p style={{ color: currentJurisdiction ? '#0F172A' : '#94A3B8', fontSize: '13px', marginTop: '2px', fontWeight: 500, margin: '2px 0 0 0' }}>
            {currentJurisdiction ? currentJurisdiction.name : 'Not selected'}
          </p>
        </div>

        <SidebarItem 
          icon={<RefreshCw size={18} />} 
          label="Reset Chat" 
          onClick={onReset} 
          ariaLabel="Reset the conversation"
        />
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', padding: '16px 12px 8px' }}>
          Google Services Powering CivicPath
        </p>
        
        <ServiceCard 
          title="Google Gemini" 
          description="Powers the nonpartisan assistant responses." 
          status="Connected"
        />
        <ServiceCard 
          title="Civic API" 
          description="Looks up representatives and voter information." 
          status="Connected"
        />
        <ServiceCard 
          title="Google Calendar" 
          description="Adds election deadlines as reminders." 
          status="Available"
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
      gap: '10px',
      padding: '9px 12px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#475569',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      width: '100%',
      textAlign: 'left',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
    className="sidebar-nav-item"
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#EFF6FF';
      e.currentTarget.style.color = '#2563EB';
      e.currentTarget.querySelector('.sidebar-icon').style.color = '#2563EB';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = '#475569';
      e.currentTarget.querySelector('.sidebar-icon').style.color = '#94A3B8';
    }}
  >
    <span className="sidebar-icon" style={{ width: '18px', height: '18px', color: '#94A3B8', flexShrink: 0, display: 'flex', transition: 'all 0.15s ease' }}>{icon}</span>
    <span>{label}</span>
  </button>
);

const ServiceCard = ({ title, description, status }) => (
  <div className="card" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', marginBottom: '8px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '4px', margin: '0 0 4px 0' }}>{title}</p>
    <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', margin: 0, wordBreak: 'break-word' }}>{description}</p>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 500, marginTop: '6px' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status === 'Connected' ? '#10B981' : '#F59E0B' }}></span>
      <span style={{ color: status === 'Connected' ? '#10B981' : '#F59E0B' }}>{status}</span>
    </div>
  </div>
);

export default Sidebar;


export default Sidebar;

