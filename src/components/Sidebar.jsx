import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: 'fa-chart-pie', label: 'Dashboard' },
  { to: '/properties', icon: 'fa-building', label: 'Properties' },
  { to: '/tenants', icon: 'fa-users', label: 'Tenants' },
  { to: '/assignments', icon: 'fa-handshake', label: 'Assignments' },
  { to: '/rent-plan', icon: 'fa-calendar-alt', label: 'Rent Plan' },
  { to: '/rent-records', icon: 'fa-file-invoice-dollar', label: 'Rent Records' },
  { to: '/demands', icon: 'fa-bullhorn', label: 'Payment Demands' },
  { to: '/expenses', icon: 'fa-receipt', label: 'Expenses' },
  { to: '/reports', icon: 'fa-chart-bar', label: 'Reports' },
  { to: '/settings', icon: 'fa-cog', label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <i className="fas fa-home" />
          <span>Tenant Manager</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className={`fas ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
