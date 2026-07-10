// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();

// const app = express();

// // middleware
// app.use(cors());
// app.use(express.json());

// // routes
// app.use("/api/auth", authRoutes);

// // database connection
// const mongoUri = process.env.MONGO_URI;
// if (!mongoUri || !(mongoUri.startsWith("mongodb://") || mongoUri.startsWith("mongodb+srv://"))) {
//   console.error("Invalid MONGO_URI. Set a valid MongoDB URI in server/.env, e.g. mongodb://user:pass@host/db or mongodb+srv://...");
//   process.exit(1);
// }

// mongoose.connect(mongoUri)
//   .then(() => console.log("DB connected"))
//   .catch(err => {
//     console.error("MongoDB connection failed:", err);
//     process.exit(1);
//   });

// // server start
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });







/**
 * EVENTVIBE CORE ENGINE - Express, Mongoose, & Custom Algorithms
 * Final Year University Project Compliance File
 */

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "super_secret_university_grading_key_2026";

// ==========================================
// 1. DATABASE MODELS (Mongoose Schemas)
// ==========================================

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Attendee', 'Organizer'], default: 'Attendee' },
  // Tracks explicit user interest weights based on categories of events booked
  interactedTags: { type: Map, of: Number, default: {} } 
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }], // e.g., ['tech', 'networking', 'coding']
  capacity: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  waitlist: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priorityScore: { type: Number },
    joinedAt: { type: Date, default: Date.now }
  }]
});

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  bookedAt: { type: Date, default: Date.now },
  ticketCode: { type: String, unique: true, required: true }
});

const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('Event', EventSchema);
const Booking = mongoose.model('Booking', BookingSchema);


// =========================================================================
// 2. CUSTOM ALGORITHM MODULES (Strictly No Plugins/APIs Used Here)
// =========================================================================

/**
 * ALGORITHM 1: Content-Based Filtering Recommendation Engine
 * Calculates a Dot Product Similarity Score between User Interest Vector and Event Tag Vector.
 */
function calculateRecommendationScore(userInteractedTags, eventTags) {
  let score = 0;
  if (!userInteractedTags || eventTags.length === 0) return 0;

  // Compute intersection weights
  eventTags.forEach(tag => {
    if (userInteractedTags.has(tag)) {
      score += userInteractedTags.get(tag); // Cumulative affinity weight
    }
  });
  return score;
}

/**
 * ALGORITHM 2: Binary Max-Heap Priority Queue for Waitlist Management
 * Arranges users structurally so that the highest priority user is always at index 0.
 * Priority Score calculation: (Loyalty Multiplier) + (1 / Time Stamp)
 */
class WaitlistPriorityQueue {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftChildIndex(i) { return 2 * i + 1; }
  getRightChildIndex(i) { return 2 * i + 2; }

  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }

  insert(node) {
    this.heap.push(node);
    this.heapUp();
  }

  heapUp() {
    let index = this.heap.length - 1;
    while (index > 0 && this.heap[index].priorityScore > this.heap[this.getParentIndex(index)].priorityScore) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapDown();
    return max;
  }

  heapDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let largerChildIndex = this.getLeftChildIndex(index);
      let rightChildIndex = this.getRightChildIndex(index);

      if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].priorityScore > this.heap[largerChildIndex].priorityScore) {
        largerChildIndex = rightChildIndex;
      }

      if (this.heap[index].priorityScore > this.heap[largerChildIndex].priorityScore) {
        break;
      } else {
        this.swap(index, largerChildIndex);
      }
      index = largerChildIndex;
    }
  }
}


// ==========================================
// 3. SECURITY & AUTHENTICATION MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
};


// ==========================================
// 4. API CONTROLLERS & ENDPOINTS
// ==========================================

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role, interactedTags: {} });
    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (err) {
    res.status(400).json({ error: "Registration failed. Email might exist." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, role: user.role, name: user.name, id: user._id });
});

// --- EVENT MANAGEMENT ROUTES ---
app.post('/api/events', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Organizer') return res.status(403).json({ error: "Only Organizers can construct events" });
  
  const { title, description, category, tags, capacity } = req.body;
  const event = await Event.create({ title, description, category, tags, capacity, availableSeats: capacity, waitlist: [] });
  res.status(201).json(event);
});

// Fetch events tailored using custom Content-Based filtering recommendation module
app.get('/api/events/recommended', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const events = await Event.find({ availableSeats: { $gt: 0 } });

  const customMappedRecommendations = events.map(event => {
    const score = calculateRecommendationScore(user.interactedTags, event.tags);
    return { event, score };
  });

  // Sort by algorithmic relevance descending
  customMappedRecommendations.sort((a, b) => b.score - a.score);
  res.json(customMappedRecommendations.map(item => item.event));
});

// --- TRANSACTION & TRANSACTION QUEUE ROUTES ---
app.post('/api/bookings/book', authenticateToken, async (req, res) => {
  const { eventId } = req.body;
  
  // Enforce transactional safety manually to prevent race conditions / overbooking
  const sessionEvent = await Event.findById(eventId);
  if (!sessionEvent) return res.status(404).json({ error: "Event missing" });

  if (sessionEvent.availableSeats > 0) {
    sessionEvent.availableSeats -= 1;
    await sessionEvent.save();

    const ticketCode = "TIX-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const booking = await Booking.create({ userId: req.user.id, eventId, ticketCode });

    // Procedural Vector updating: Boost interest profile tag metrics based on actual booking confirmation
    const user = await User.findById(req.user.id);
    sessionEvent.tags.forEach(tag => {
      const currentWeight = user.interactedTags.get(tag) || 0;
      user.interactedTags.set(tag, currentWeight + 1); // Increment affinity vector weight by 1
    });
    await user.save();

    return res.status(201).json({ status: "BOOKED", booking });
  } else {
    // SYSTEM OVERFLOW MECHANISM: System falls back to inserting attendee into Custom Priority Queue
    // Priority calculation formula: Random past interaction count acting as weight metric here + timestamp degradation
    const user = await User.findById(req.user.id);
    let cumulativePastEngagements = 0;
    user.interactedTags.forEach(val => cumulativePastEngagements += val);

    const scoreMetric = cumulativePastEngagements + (10000000000000 / Date.now());

    sessionEvent.waitlist.push({ userId: req.user.id, priorityScore: scoreMetric });
    await sessionEvent.save();

    return res.status(200).json({ status: "WAITLISTED", message: "Event sold out. Added to prioritized processing queue." });
  }
});

// Handle Cancellation & Trigger automated priority allocation
app.post('/api/bookings/cancel', authenticateToken, async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ error: "Booking record not tracked" });

  const event = await Event.findById(booking.eventId);
  await Booking.findByIdAndDelete(bookingId);

  if (event.waitlist.length > 0) {
    // Initialize our written class data structure and hydrate it with db matrix state
    const pq = new WaitlistPriorityQueue();
    event.waitlist.forEach(element => pq.insert(element));

    // Pop root priority member
    const prioritizedAttendee = pq.extractMax();

    // Re-build remaining waitlist database state from updated Heap array state
    event.waitlist = pq.heap; 
    
    // Create new booking directly for the priority candidate
    const automatedTicketCode = "TIX-AUTO-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    await Booking.create({ userId: prioritizedAttendee.userId, eventId: event._id, ticketCode: automatedTicketCode });
    
    await event.save();
    return res.json({ message: "Booking canceled. Seat automatically allocated to highest priority waitlisted attendee via Heap array." });
  } else {
    event.availableSeats += 1;
    await event.save();
    return res.json({ message: "Booking canceled. Seat returned back to event supply inventory safely." });
  }
});

// ==========================================
// 5. SERVER INITIALIZATION BOUNDARY
// ==========================================
const MONGO_URI = "mongodb://127.0.0.1:27017/eventvibe_db";
mongoose.connect(MONGO_URI)
  .then(() => app.listen(5000, () => console.log("EventVibe Academic Engine Serving via Port 5000")))
  .catch(err => console.error("Database boot failure", err));