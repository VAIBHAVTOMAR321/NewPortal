import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContext';
import './NavBar.css';

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/MushroomForm', label: 'Mushroom Form', icon: 'mushroom' },
    { path: '/BaagwaniMission', label: 'Baagwani Mission', icon: 'leaf' },
    { path: '/PMKSY', label: 'PMKSY', icon: 'water' },
  ];

  return (
    <nav className="topnav" role="navigation" aria-label="Main navigation">
      <div className="topnav-brand">
        <svg className="brand-logo" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2"/>
          <path d="M30 15V45M15 30H45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <span className="brand-name">Dhokotdwar Portal</span>
      </div>

      <div className="topnav-links">
        <ul className="nav-list" role="menubar">
          {navItems.map(item => (
            <li key={item.path} role="none">
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                role="menuitem"
                aria-current={({ isActive }) => isActive ? 'page' : undefined}
              >
                <span className="nav-icon">
                  {item.icon === 'mushroom' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10c0-1.5-.5-3-1-4-2-1-4-1-6 1-1 1-1 2-1 3 0 1.5.5 3 1 4a7 7 0 1 1-14 0c0-1.5-.5-3-1-4-2-1-4-1-6 1-1 1-1 2-1 3"/>
                      <path d="M12 12v10"/>
                    </svg>
                  )}
                  {item.icon === 'leaf' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                      <path d="M12 2v20M2 12h20"/>
                    </svg>
                  )}
                  {item.icon === 'water' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                  )}
                </span>
                <span className="nav-label">{item.label}</span>
                <span className="nav-indicator" aria-hidden="true"></span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="topnav-user">
        <div className="user-info">
          <div className="user-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="user-details">
            <span className="user-name">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin'}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
        <button
          className="btn-logout"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;