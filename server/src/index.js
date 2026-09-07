const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io for Real-time Negotiations and Live Updates
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'agriintel-api-gateway',
    timestamp: new Date().toISOString()
  });
});

// Root API Endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to AgriIntel API Gateway',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// WebSocket Connection Management
io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`[WebSocket] Client ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    // Broadcast to room
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[AgriIntel Gateway] Running on port ${PORT}`);
});
