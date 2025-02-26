const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
let usersRoutes;
let careRecipientsRoutes;
let healthEventsRoutes;
let medicationsRoutes;
let visitsRoutes;

try {
  usersRoutes = require('./routes/users');
  careRecipientsRoutes = require('./routes/careRecipients');
  healthEventsRoutes = require('./routes/healthEvents');
  medicationsRoutes = require('./routes/medications');
  visitsRoutes = require('./routes/visits');
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
}

const app = express();
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

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Care API is up and running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});