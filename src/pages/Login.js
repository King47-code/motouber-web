// File: client/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://motouber-web-production.up.railway.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Sign in</h1>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <button type="submit" className="btn">Sign in</button>

        <p className="footer">
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-green-600 font-semibold hover:underline"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
