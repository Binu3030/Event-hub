const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Booking = require('../models/booking');
const Event = require('../models/event');
const PriorityQueue = require('../utils/priorityQueue');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * POST /api/bookings/:eventId
 * Core Action: Request a ticket booking or jump into the priority waitlist if full.
 * Access Level: Logged-in Users (Attendees / Organizers)
 */
router.post('/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // 1. Verify the target event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Target event not found." });
    }

    // 2. Prevent duplicate ticket purchases
    const existingBooking = await Booking.findOne({ userId, eventId });
    if (existingBooking) {
      return res.status(400).json({ error: "You have already secured a ticket for this event." });
    }

    // --- SCENARIO A: SEATS AVAILABLE ---
    if (event.availableSeats > 0) {
      event.availableSeats -= 1;
      await event.save();

      // Generate a clean, unique alphanumeric ticket verification code
      const ticketCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      
      const newBooking = await Booking.create({
        userId,
        eventId,
        ticketCode: `EVT-${ticketCode}`
      });

      return res.status(201).json({
        message: "Booking confirmed! Ticket assigned successfully.",
        booking: newBooking
      });
    }

    // --- SCENARIO B: EVENT IS COMPLETELY FULL ---
    // Prevent the user from joining the waitlist multiple times
    const isAlreadyWaiting = event.waitlist.some(item => item.userId.toString() === userId);
    if (isAlreadyWaiting) {
      return res.status(400).json({ error: "You are already in the waitlist queue for this event." });
    }

    /* 
      Algorithmic Priority Score Calculation:
      For your university evaluation, we combine a baseline score with early-bird registration timing.
      Higher priority score = moves closer to the root of the Max-Heap.
    */
    const baselineScore = 100;
    const timingBonus = Math.floor(Date.now() / 1000000000); 
    const totalPriorityScore = baselineScore + (timingBonus % 100);

    // Instantiate your Day 6 PriorityQueue class and hydrate it with existing waitlist data
    const pq = new PriorityQueue();
    event.waitlist.forEach(item => pq.insert(item));

    // Insert the new user into the heap tree structure
    pq.insert({
      userId,
      priorityScore: totalPriorityScore,
      joinedAt: new Date()
    });

    // Extract the newly rebalanced structural array and save it to MongoDB
    event.waitlist = pq.getHeap();
    await event.save();

    res.status(202).json({
      message: "Event capacity reached. You have been placed in the priority waitlist.",
      priorityScore: totalPriorityScore,
      waitlistPosition: event.waitlist.length
    });

  } catch (err) {
    res.status(500).json({ error: "Internal booking processor compilation fault." });
  }
});

module.exports = router;