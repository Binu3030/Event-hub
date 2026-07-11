const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

// Import your custom routing blueprints built over the last few days
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Instantiate the core Express application engine instance
const app = express();

// 1. Establish Database Connection Cluster Link
connectDB();

// 2. Global Middleware Configurations
app.use(cors());          // Allows your React application to make cross-origin network calls
app.use(express.json());  // Native body parser to handle incoming JSON request payloads

// 3. System API Endpoints Gateway Mapping
app.use('/api/auth', authRoutes);     // Routes handled by Day 3 Auth Engine
app.use('/api/events', eventRoutes);   // Routes handled by Day 4 Event Engine

// 4. Base Status Endpoint (Used for quick structural system health checks)
app.get('/', (req, res) => {
  res.json({ status: "Online", framework: "EventHub MERN Academic Core Engine Running" });
});

// 5. Initialize the Runtime Network Listener Port
const PORT = 5000;
app.listen(PORT, () => {
  console.log("======================================================");
  console.log(`SERVER SYSTEM ONLINE: Listening on Local Network Port ${PORT}`);
  console.log(`Diagnostic Check: Access http://localhost:${PORT}/ in browser`);
  console.log("======================================================");
});