const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const protect = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { full_name, email, phone, password, role, profile_picture_url, id_card_url } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password, role, profile_picture_url, id_card_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [full_name, email, phone, hashedPassword, role, profile_picture_url, id_card_url]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    delete user.password;
    res.status(201).json({ message: 'User registered', token, user });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Hardcoded test credentials
  if (email === 'test@example.com' && password === 'test123') {
    const testUser = { id: 0, full_name: 'Test User', email: 'test@example.com', role: 'tester' };
    const testToken = jwt.sign({ id: testUser.id, role: testUser.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ message: 'Logged in (hardcoded test)', token: testToken, user: testUser });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    delete user.password;
    res.json({ message: 'Logged in', token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET CURRENT USER
router.get('/me', protect, async (req, res) => {
  try {
    const { id } = req.user;
    const { rows } = await pool.query(
      'SELECT id, full_name, email, phone, role, profile_picture_url, id_card_url, created_at FROM users WHERE id = $1',
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
