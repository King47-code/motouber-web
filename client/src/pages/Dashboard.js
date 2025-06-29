// File: client/src/pages/Dashboard.js
import React, { useState } from 'react';
import './Dashboard.css';
import MapWithRoute from '../components/MapWithRoute';

export default function Dashboard({ user }) {
  const [routeRequest, setRouteRequest] = useState(null);
  const [menuOpen, setMenuOpen]         = useState(false);

  const menuItems = [
    'Payment','Ride History','Support','Settings','Logout'
  ].map(label => ({
    label,
    action: () => {
      if (label === 'Logout') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert(label);
      }
    }
  }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="profile-info">
          <img
            src={user.profile_picture_url || 'https://via.placeholder.com/150'}
            alt="Profile"
          />
          <div className="details">
            <p>{user.full_name}</p>
            <p>{user.role}</p>
          </div>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen(o => !o)}>
          ☰
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            {menuItems.map(item => (
              <div
                key={item.label}
                className="menu-dropdown-item"
                onClick={() => { setMenuOpen(false); item.action(); }}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="request-card">
        <h2>Request a Ride</h2>
        <MapWithRoute onReady={setRouteRequest} />
        <button
          className="btn"
          onClick={() => {
            if (!routeRequest) return alert('Choose pickup and destination first');
            alert('Route ready! See the map.');
          }}
        >
          Confirm Ride
        </button>
        <button 
  className="btn" 
  onClick={() => window.location.href = '/chat/room1'}
  style={{ marginTop: '1rem' }}
>
  Open Chat
</button>

      </div>
      
    </div>
  );
}
