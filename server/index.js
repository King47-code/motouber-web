// File: server/index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Your existing routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const ridesRoutes = require('./routes/rides');
app.use('/api/rides', ridesRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'  // adjust to your frontend origin in production
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room (e.g., ride session) — clients should emit 'join'
  socket.on('join', (room) => {
    socket.join(room);
  });

  // Listen for new chat messages
  socket.on('chatMessage', ({ room, user, message }) => {
    // Broadcast to everyone in the same room
    io.to(room).emit('chatMessage', { user, message, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
//Add this:
app.get('/', (req, res) => {
  res.send('MotoUber API is live 🚀. Try /api/register or /api/login');
});
// Start server (replace app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
