import { Book, HelpCircle, MapPin, CheckSquare, RefreshCw, Landmark, ExternalLink, Calendar, Search } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Sidebar component for navigation and Google Services status
 */
const Sidebar = ({ onSelectSection, currentJurisdiction, onReset }) => {
  return (
    <aside className="sidebar">
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 800, 
        color: 'var(--primary)', 
        padding: '0 8px 20px 8px', 
        borderBottom: '1px solid var(--border)', 
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Landmark size={22} />
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
          icon={<Calendar size={18} />} 
          label="Voting Checklist" 
          onClick={() => onSelectSection('checklist')} 
          ariaLabel="View voting checklist"
        />
        <SidebarItem 
          icon={<Search size={18} />} 
          label="Search Sources" 
          onClick={() => onSelectSection('process')} 
          ariaLabel="Search official government sources"
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
        
        <div style={{ margin: '12px 0', padding: '10px 12px', background: 'var(--primary-light)', border: '1px solid var(--primary-glow)', borderRadius: '10px' }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '10px', margin: 0 }}>
            Active Jurisdiction
          </p>
          <p style={{ color: currentJurisdiction ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '13px', marginTop: '2px', fontWeight: 600, margin: '2px 0 0 0' }}>
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
        <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '16px 12px 8px' }}>
          Integrated Services
        </p>
        
        <ServiceCard 
          title="Gemini 1.5 Flash" 
          description="Multi-turn AI with streaming & grounding." 
          status={import.meta.env.VITE_GEMINI_API_KEY ? "Connected" : "Disconnected"}
        />
        <ServiceCard 
          title="Civic Info API" 
          description="Voter info, reps, and official sources." 
          status={import.meta.env.VITE_CIVIC_API_KEY ? "Connected" : "Disconnected"}
        />
        <ServiceCard 
          title="Maps JS API" 
          description="Dynamic polling maps & geocoding." 
          status={import.meta.env.VITE_MAPS_API_KEY ? "Connected" : "Disconnected"}
        />
        <ServiceCard 
          title="Calendar API" 
          description="OAuth2-powered event reminders." 
          status={import.meta.env.VITE_GOOGLE_CLIENT_ID ? "Connected" : "Disconnected"}
        />
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  onSelectSection: PropTypes.func.isRequired,
  currentJurisdiction: PropTypes.object,
  onReset: PropTypes.func.isRequired
};

/**
 * Helper component for sidebar items
 */
const SidebarItem = ({ icon, label, onClick, ariaLabel }) => (
  <button 
    onClick={onClick}
    aria-label={ariaLabel}
    className="sidebar-nav-item"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '9px 12px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      color: 'var(--text-secondary)',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'var(--transition)',
      width: '100%',
      textAlign: 'left'
    }}
  >
    <span className="sidebar-icon" style={{ width: '18px', height: '18px', color: 'var(--text-muted)', flexShrink: 0, display: 'flex' }}>{icon}</span>
    <span>{label}</span>
  </button>
);

SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string
};

/**
 * Card for displaying service status
 */
const ServiceCard = ({ title, description, status }) => (
  <div className="card" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px', marginBottom: '8px' }}>
    <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', margin: 0 }}>{title}</p>
    <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>{description}</p>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 600, marginTop: '4px' }}>
      <span style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: status === 'Connected' ? 'var(--success)' : '#EF4444' 
      }}></span>
      <span style={{ color: status === 'Connected' ? 'var(--success)' : '#EF4444' }}>{status}</span>
    </div>
  </div>
);

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default Sidebar;


