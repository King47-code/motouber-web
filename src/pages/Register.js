// File: client/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');
  const navigate                      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://motouber-web-production.up.railway.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          password,
          role: 'rider',
          profile_picture_url: '',
          id_card_url: ''
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return setError(data.error || 'Registration failed');
      }
      navigate('/login');
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Sign up</h1>

        <label>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Phone</label>
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
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

        <button type="submit" className="btn">Sign up</button>

        <p className="footer">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 underline"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
