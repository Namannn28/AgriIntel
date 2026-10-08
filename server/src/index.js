const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const ordersRoutes = require('./routes/orders');
const jobsRoutes = require('./routes/jobs');
const workersRoutes = require('./routes/workers');
const subsidiesRoutes = require('./routes/subsidies');
const mlProxyRoutes = require('./routes/mlProxy');
const ragProxyRoutes = require('./routes/ragProxy');
const weatherRoutes = require('./routes/weather');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const reviewsRoutes = require('./routes/reviews');
const notificationsRoutes = require('./routes/notifications');

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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoints
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'agriintel-api-gateway',
    timestamp: new Date().toISOString()
  });
});

// Root API Endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'AgriIntel API Gateway',
    version: '1.0.0',
    description: 'AI-Integrated Digital Platform for Farmer Empowerment',
    endpoints: {
      auth: '/api/auth',
      listings: '/api/listings',
      orders: '/api/orders',
      jobs: '/api/jobs',
      workers: '/api/workers',
      subsidies: '/api/subsidies',
      ml: '/api/ml',
      rag: '/api/rag',
      weather: '/api/weather',
      admin: '/api/admin'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/subsidies', subsidiesRoutes);
app.use('/api/ml', mlProxyRoutes);
app.use('/api/rag', ragProxyRoutes);
app.use('/api/voice', ragProxyRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Static client build serving for unified production deployment
const path = require('path');
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// WebSocket Connection Management
io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`[WebSocket] Client ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    // Broadcast to room
    io.to(data.roomId).emit('receive_message', {
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

if (require.main === module || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`[AgriIntel Gateway] Running on port ${PORT}`);
  });
}

module.exports = { app, server };
