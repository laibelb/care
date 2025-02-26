const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
let usersRoutes;
let careRecipientsRoutes;
let healthEventsRoutes;
let medicationsRoutes;
let visitsRoutes;
let camerasRoutes;

try {
  usersRoutes = require('./routes/users');
  careRecipientsRoutes = require('./routes/careRecipients');
  healthEventsRoutes = require('./routes/healthEvents');
  medicationsRoutes = require('./routes/medications');
  visitsRoutes = require('./routes/visits');
  camerasRoutes = require('./routes/cameras');
} catch (error) {
  console.error('Error loading routes:', error);
  // Create empty routers as fallback
  const router = express.Router();
  router.get('/', (req, res) => res.json({ message: 'Route not implemented yet' }));
  
  usersRoutes = router;
  careRecipientsRoutes = router;
  healthEventsRoutes = router;
  medicationsRoutes = router;
  visitsRoutes = router;
  camerasRoutes = router;
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/care-recipients', careRecipientsRoutes);
app.use('/api/health-events', healthEventsRoutes);
app.use('/api/medications', medicationsRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/cameras', camerasRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Care API is up and running' });
});

// Socket.io for camera events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-camera-stream', (streamId) => {
    console.log(`Client ${socket.id} joined camera stream ${streamId}`);
    socket.join(`camera-${streamId}`);
  });
  
  socket.on('leave-camera-stream', (streamId) => {
    console.log(`Client ${socket.id} left camera stream ${streamId}`);
    socket.leave(`camera-${streamId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export socket.io instance for use in other modules
app.set('io', io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server running`);
});