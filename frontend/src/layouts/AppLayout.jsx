import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Menu
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('peoplecore_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme === 'dark') {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      }
    } catch (e) {
      console.error('Error applying theme from settings:', e);
    }
  }, []);

  // Get current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview';
    if (path === '/employees') return 'Employee Directory';
    if (path === '/departments') return 'Department Directory';
    if (path === '/settings') return 'System Settings';
    return 'Dashboard';
  };

  const pageTitle = getPageTitle();

  return (
    <div className="app-shell">
      {/* Fixed Left Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">P</div>
          <div className="brand-info">
            <span className="brand-name">PeopleCore</span>
            <span className="brand-subtitle">Employee Management</span>
          </div>
        </div>

        <div className="sidebar-nav-container">
          <div className="nav-section-title">Main Menu</div>
          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item-link active' : 'nav-item-link'}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/employees" className={({ isActive }) => isActive ? 'nav-item-link active' : 'nav-item-link'}>
              <Users size={18} />
              <span>Employees</span>
            </NavLink>
            <NavLink to="/departments" className={({ isActive }) => isActive ? 'nav-item-link active' : 'nav-item-link'}>
              <Building2 size={18} />
              <span>Departments</span>
            </NavLink>
          </nav>

          <div className="nav-section-title">System</div>
          <nav className="sidebar-nav">
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item-link active' : 'nav-item-link'}>
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-link">
            <HelpCircle size={16} />
            <span>Help & Support</span>
          </div>
          <div className="sidebar-footer-link">
            <LogOut size={16} />
            <span>Sign Out</span>
          </div>
          <div className="system-version-badge">
            <div className="status-dot-green"></div>
            <span>EMS v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-layout">
        {/* Top Header */}
        <header className="app-header">
          <div className="header-left">
            <div className="header-breadcrumb">
              <span>PeopleCore</span>
              <ChevronRight size={14} />
              <span className="header-breadcrumb-current">{pageTitle}</span>
            </div>
          </div>

          <div className="header-right">
            <div className="user-profile-badge">
              <div className="user-avatar-circle">AD</div>
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">HR Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Region */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
