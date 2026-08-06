const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware'); // Verifies JWT and sets req.user

// @route   POST /api/events/:id/book
// @desc    Book a seat for an event or join the waitlist if sold out
// @access  Private (Logged-in Users)
router.post('/:id/book', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const eventId = req.params.id;
    const userId = req.user.id; // Extracted from decoded JWT token

    // Fetch event within transaction session
    const event = await Event.findById(eventId).session(session);

    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Event not found' });
    }

    // 1. Check if user has already booked a seat
    const isAlreadyBooked = event.attendees.some(
      (attendeeId) => attendeeId.toString() === userId.toString()
    );

    if (isAlreadyBooked) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'You have already booked a seat for this event.' });
    }

    // 2. Check if user is already on the waitlist
    const isAlreadyOnWaitlist = event.waitlist.some(
      (waitlistUserId) => waitlistUserId.toString() === userId.toString()
    );

    // 3. Handle Seat Reservation vs Waitlist Allocation
    if (event.availableSeats > 0) {
      // Reserve Seat
      event.attendees.push(userId);
      event.availableSeats -= 1;

      // If user was previously on waitlist, remove them
      if (isAlreadyOnWaitlist) {
        event.waitlist = event.waitlist.filter(
          (waitlistUserId) => waitlistUserId.toString() !== userId.toString()
        );
      }

      await event.save({ session });
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: 'Seat booked successfully!',
        event
      });
    } else {
      // Event is Sold Out: Add to Waitlist
      if (isAlreadyOnWaitlist) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: 'You are already on the waitlist for this event.' });
      }

      event.waitlist.push(userId);
      await event.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: 'Event is sold out. You have been added to the waitlist.',
        event
      });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Booking Error:', err);
    return res.status(500).json({ error: 'Server error while processing booking.' });
  }
});

module.exports = router;