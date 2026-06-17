import { NavLink } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Target, Activity } from 'lucide-react';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <ShieldAlert className="icon" size={28} />
        RedTeam AI
      </div>
      <nav>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Overview
        </NavLink>
        <NavLink to="/campaigns" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Activity size={20} />
          Campaigns
        </NavLink>
        <NavLink to="/models" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Target size={20} />
          Models
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
