require('dotenv').config(); // Load environment variables at startup

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Global Middleware Configurations
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express JSON Parser
app.use(express.json());

// System API Endpoints Mapping
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Base Health/Status Endpoint
app.get('/', (req, res) => {
  return res.json({ status: 'Online', framework: 'EventHub MERN Core Engine Running' });
});

// Diagnostic 404 Fallback - Logs failed route requests in terminal
app.use((req, res) => {
  console.log(`❌ 404 NOT FOUND: [${req.method}] ${req.originalUrl}`);
  return res.status(404).json({ message: `Route ${req.originalUrl} not found on server.` });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('======================================================');
      console.log(`SERVER SYSTEM ONLINE: Listening on Port ${PORT}`);
      console.log(`Diagnostic Check: Access http://localhost:${PORT}/ in browser`);
      console.log('======================================================');
    });
  } catch (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
};

startServer();