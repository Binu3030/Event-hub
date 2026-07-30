require('dotenv').config(); // 👈 MANDATORY: Must be at line 1 to load environment variables

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

// Express json parser
app.use(express.json());

// System API Endpoints Mapping
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Base Status Endpoint
app.get('/', (req, res) => {
  return res.json({ status: 'Online', framework: 'EventHub MERN Core Engine Running' });
});

// Global 404 Fallback
app.use((req, res) => {
  return res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
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