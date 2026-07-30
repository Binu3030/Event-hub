const mongoose = require('mongoose');

/**
 * EventHub Core Database Configuration Connection Module
 * Establishes explicit connection state to local MongoDB Server instance
 */
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventhub_db";

    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);

    console.log("======================================================");
    console.log("SUCCESS: EventHub Database Cluster Connection Active.");
    console.log("======================================================");
  } catch (err) {
    console.error("CRITICAL ERROR: Database link integration failure:", err.message);
    console.error("Make sure MongoDB is running and MONGO_URI is configured correctly.");
    process.exit(1);
  }
};

module.exports = connectDB;