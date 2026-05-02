import { Book, HelpCircle, MapPin, CheckSquare, RefreshCw, Landmark, ExternalLink, Calendar, Search, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Sidebar component for navigation and Google Services status
 */
const Sidebar = ({ onSelectSection, currentJurisdiction, onReset }) => {
  return (
    <aside className="sidebar">
      <div style={{ 
        padding: '8px 12px 24px 12px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.4)', 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md), var(--shadow-glow)'
        }}>
          <Landmark size={22} color="white" />
        </div>
        <span className="text-gradient" style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          CivicPath
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <SidebarItem 
          icon={<AlertCircle size={18} />} 
          iconColor="#EF4444"
          label="Report Civic Issue" 
          onClick={() => onSelectSection('report_issue')} 
          ariaLabel="Report a new civic issue"
        />
        <SidebarItem 
          icon={<Landmark size={18} />} 
          iconColor="var(--primary)"
          label="Find Representatives" 
          onClick={() => onSelectSection('lookup')} 
          ariaLabel="Find your local representatives"
        />
        <SidebarItem 
          icon={<MapPin size={18} />} 
          iconColor="var(--secondary)"
          label="Find Polling Location" 
          onClick={() => onSelectSection('polling')} 
          ariaLabel="Find your local polling location"
        />
        <SidebarItem 
          icon={<Calendar size={18} />} 
          iconColor="var(--accent)"
          label="Voting Checklist" 
          onClick={() => onSelectSection('checklist')} 
          ariaLabel="View voting checklist"
        />
        <SidebarItem 
          icon={<Search size={18} />} 
          iconColor="var(--primary-dark)"
          label="Search Sources" 
          onClick={() => onSelectSection('process')} 
          ariaLabel="Search official government sources"
        />
        <SidebarItem 
          icon={<HelpCircle size={18} />} 
          iconColor="#F59E0B"
          label="Common FAQs" 
          onClick={() => onSelectSection('faq')} 
          ariaLabel="Read frequently asked questions"
        />
        <SidebarItem 
          icon={<Book size={18} />} 
          iconColor="#8B5CF6"
          label="Glossary" 
          onClick={() => onSelectSection('glossary')} 
          ariaLabel="View election terms glossary"
        />
        
        <div style={{ 
          margin: '16px 0', 
          padding: '14px 16px', 
          background: 'rgba(255, 255, 255, 0.6)', 
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.9)', 
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '11px', margin: 0 }}>
            Active Jurisdiction
          </p>
          <p style={{ color: currentJurisdiction ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '14px', marginTop: '4px', fontWeight: 600, margin: '4px 0 0 0' }}>
            {currentJurisdiction ? currentJurisdiction.name : 'Not selected'}
          </p>
        </div>

        <SidebarItem 
          icon={<RefreshCw size={18} />} 
          iconColor="var(--text-secondary)"
          label="Reset Chat" 
          onClick={onReset} 
          ariaLabel="Reset the conversation"
        />
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '16px 12px 12px' }}>
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
const SidebarItem = ({ icon, label, onClick, ariaLabel, iconColor }) => (
  <button 
    onClick={onClick}
    aria-label={ariaLabel}
    className="sidebar-nav-item"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'var(--transition)',
      width: '100%',
      textAlign: 'left'
    }}
  >
    <span className="sidebar-icon" style={{ width: '20px', height: '20px', color: iconColor || 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}>
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  iconColor: PropTypes.string
};

/**
 * Card for displaying service status
 */
const ServiceCard = ({ title, description, status }) => (
  <div className="card" style={{ marginBottom: '10px' }}>
    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', margin: 0 }}>{title}</p>
    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>{description}</p>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, marginTop: '8px', background: status === 'Connected' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '999px', color: status === 'Connected' ? 'var(--success)' : '#EF4444' }}>
      <span style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        background: status === 'Connected' ? 'var(--success)' : '#EF4444',
        boxShadow: status === 'Connected' ? '0 0 8px var(--success)' : 'none'
      }}></span>
      <span>{status}</span>
    </div>
  </div>
);

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default Sidebar;


