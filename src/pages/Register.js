// File: client/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', role: '',
    profile_picture_url: '', id_card_url: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://motouber-web-production.up.railway.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="full_name" placeholder="Full Name" onChange={handleChange} required /><br />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required /><br />
      <input name="phone" placeholder="Phone" onChange={handleChange} required /><br />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required /><br />
      <input name="role" placeholder="Role (e.g., rider)" onChange={handleChange} required /><br />
      <input name="profile_picture_url" placeholder="Profile Picture URL" onChange={handleChange} /><br />
      <input name="id_card_url" placeholder="ID Card URL" onChange={handleChange} /><br />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;