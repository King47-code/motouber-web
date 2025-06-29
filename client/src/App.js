// File: client/src/App.js
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams
} from 'react-router-dom';

import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Menu      from './pages/Menu';
import Chat      from './pages/Chat';

function ChatWrapper() {
  const { room } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}').full_name;
  return <Chat room={room} user={user} />;
}

function App() {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://motouber-web-production.up.railway.app/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => localStorage.setItem('user', JSON.stringify(data)) || setUser(data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Checking authentication...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        <Route path="/login"    element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/menu"      element={user ? <Menu />              : <Navigate to="/login" />} />
        <Route path="/chat/:room" element={user ? <ChatWrapper />      : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
