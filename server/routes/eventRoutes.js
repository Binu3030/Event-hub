const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * POST /api/events
 * Core Action: Create a brand new event.
 * Access Level: Restricted strictly to logged-in Administrators ('admin').
 */
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { title, description, category, tags, capacity, location, date } = req.body;

    if (!title || !capacity) {
      return res.status(400).json({ error: "Title and capacity fields are required." });
    }

    const userId = req.user?.id || req.user?._id;

    // Build the new event object. Available seats match total capacity on day one.
    const newEvent = await Event.create({
      title,
      description,
      category,
      location: location || 'Online',
      date: date || Date.now(),
      tags: tags || [],
      capacity: Number(capacity),
      availableSeats: Number(capacity),
      createdBy: userId,
      attendees: [],
      waitlist: []
    });

    res.status(201).json({ message: "Event established successfully.", event: newEvent });
  } catch (err) {
    console.error("POST /api/events error:", err);
    res.status(500).json({ error: "System error compiling event data schema initialization." });
  }
});

/**
 * GET /api/events
 * Core Action: Fetch all events across the platform.
 * Access Level: Public (Anyone can view events).
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // Newest events show up first
    res.json(events);
  } catch (err) {
    console.error("GET /api/events error:", err);
    res.status(500).json({ error: "Database reading engine encountered a processing fault." });
  }
});

/**
 * GET /api/events/:id
 * Core Action: Fetch a single event node by ID.
 * Access Level: Public
 */
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Target event object node not found." });
    }
    res.json(event);
  } catch (err) {
    console.error(`GET /api/events/${req.params.id} error:`, err);
    res.status(500).json({ error: "Error fetching event details." });
  }
});

/**
 * POST /api/events/:id/book
 * Core Action: Reserve a seat or append user to waitlist if sold out.
 * Access Level: Private (Authenticated Users)
 */
router.post('/:id/book', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Target event object node not found." });
    }

    const userId = (req.user?.id || req.user?._id)?.toString();
    if (!userId) {
      return res.status(401).json({ error: "Authentication required. Missing user identity payload." });
    }

    // Defensive initialization for legacy records missing arrays
    event.attendees = event.attendees || [];
    event.waitlist = event.waitlist || [];

    const isBooked = event.attendees.some((id) => id.toString() === userId);

    if (isBooked) {
      return res.status(400).json({ error: "You have already booked a seat for this event." });
    }

    // Allocate seat if available; otherwise add to waitlist
    if (event.availableSeats > 0) {
      event.attendees.push(userId);
      event.availableSeats -= 1;

      // Remove from waitlist if user was previously on it
      event.waitlist = event.waitlist.filter((id) => id.toString() !== userId);

      await event.save();
      return res.status(200).json({ message: "Seat reserved successfully!", event });
    } else {
      const isWaitlisted = event.waitlist.some((id) => id.toString() === userId);
      if (isWaitlisted) {
        return res.status(400).json({ error: "You are already on the waitlist for this event." });
      }

      event.waitlist.push(userId);
      await event.save();
      return res.status(200).json({ message: "Event sold out. Added to waitlist!", event });
    }
  } catch (err) {
    console.error(`POST /api/events/${req.params.id}/book error:`, err);
    res.status(500).json({ error: "System error processing seat booking operation." });
  }
});

/**
 * POST /api/events/:id/cancel
 * Core Action: Cancel a reservation and auto-promote waitlist user if present.
 * Access Level: Private (Authenticated Users)
 */
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Target event object node not found." });
    }

    const userId = (req.user?.id || req.user?._id)?.toString();
    if (!userId) {
      return res.status(401).json({ error: "Authentication required. Missing user identity payload." });
    }

    // Defensive initialization for legacy records
    event.attendees = event.attendees || [];
    event.waitlist = event.waitlist || [];

    const attendeeIndex = event.attendees.findIndex((id) => id.toString() === userId);
    const waitlistIndex = event.waitlist.findIndex((id) => id.toString() === userId);

    if (attendeeIndex === -1 && waitlistIndex === -1) {
      return res.status(400).json({ error: "No active reservation or waitlist position found to cancel." });
    }

    if (attendeeIndex !== -1) {
      // Remove user from attendees list
      event.attendees.splice(attendeeIndex, 1);

      // Promote first waitlist user OR restore seat count
      if (event.waitlist.length > 0) {
        const nextUser = event.waitlist.shift();
        event.attendees.push(nextUser);
      } else {
        event.availableSeats += 1;
      }
    } else if (waitlistIndex !== -1) {
      // Remove user from waitlist only
      event.waitlist.splice(waitlistIndex, 1);
    }

    await event.save();
    return res.status(200).json({ message: "Reservation canceled successfully.", event });
  } catch (err) {
    console.error(`POST /api/events/${req.params.id}/cancel error:`, err);
    res.status(500).json({ error: "System error processing cancellation request." });
  }
});

/**
 * PUT /api/events/:id
 * Core Action: Modify event traits (e.g., description, capacity, tagging matrices).
 * Access Level: Restricted strictly to logged-in Administrators ('admin').
 */
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // Return the modified document and run sanity checks
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Target event object node not found." });
    }

    res.json({ message: "Event modifications updated successfully.", event: updatedEvent });
  } catch (err) {
    console.error(`PUT /api/events/${req.params.id} error:`, err);
    res.status(500).json({ error: "Internal mutation fault rewriting data object." });
  }
});

/**
 * DELETE /api/events/:id
 * Core Action: Wipe an event node out of the database cluster entirely.
 * Access Level: Restricted strictly to logged-in Administrators ('admin').
 */
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Target event object node not found." });
    }

    res.json({ message: "Event node scrubbed clean from system catalog." });
  } catch (err) {
    console.error(`DELETE /api/events/${req.params.id} error:`, err);
    res.status(500).json({ error: "Internal breakdown executing document removal query." });
  }
});

module.exports = router;
