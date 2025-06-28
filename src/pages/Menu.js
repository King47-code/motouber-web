// File: client/src/pages/Menu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

function Menu() {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Payment',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
          <line x1="2" y1="10" x2="22" y2="10" stroke="#059669" strokeWidth="2"/>
        </svg>
      ),
      action: () => alert('Go to Payment')
    },
    {
      label: 'Ride History',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z" />
        </svg>
      ),
      action: () => alert('Go to Ride History')
    },
    {
      label: 'Support',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      action: () => alert('Go to Support')
    },
    {
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 
                   1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 
                   1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 
                   4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 
                   1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 
                   2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 
                   4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33
                   l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8a1.65 1.65 
                   0 0 0 1 1.51H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 
                   1z" />
        </svg>
      ),
      action: () => alert('Go to Settings')
    },
    {
      label: 'Logout',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 17l5-5-5-5M21 12H9"/>
          <path d="M9 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"/>
        </svg>
      ),
      action: () => {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  ];

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Menu</h1>
        <button
          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem' }}
          onClick={() => navigate(-1)}
        >
          ×
        </button>
      </div>

      <div className="menu-list">
        {items.map((item) => (
          <div key={item.label} className="menu-item" onClick={item.action}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
