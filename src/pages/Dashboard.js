// File: client/src/pages/Dashboard.js
import React from 'react';

function Dashboard({ user }) {
  return (
    <div>
      <h2>Welcome, {user.full_name}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default Dashboard;
