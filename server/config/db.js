const mongoose = require('mongoose');

/**
 * EventHub Core Database Configuration Connection Module
 * Establishes explicit connection state to local MongoDB Server instance
 */
const connectDB = async () => {
  try {
    // Connects to local MongoDB instance under the unique database context name 'eventhub_db'
    const MONGO_URI = "mongodb://127.0.0.1:27017/eventhub_db";
    
    await mongoose.connect(MONGO_URI);
    console.log("======================================================");
    console.log("SUCCESS: EventHub Database Cluster Connection Active.");
    console.log("======================================================");
  } catch (err) {
    console.error("CRITICAL ERROR: Database link integration failure:", err.message);
    // Exit process with failure code (1) to prevent the server from running in a broken state
    process.exit(1);
  }
};

module.exports = connectDB;