const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth'); // Make sure this file exists
app.use('/api', authRoutes); // Enables /api/register and /api/login

// Add this:
app.get('/', (req, res) => {
  res.send('MotoUber API is live 🚀. Try /api/register or /api/login');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
