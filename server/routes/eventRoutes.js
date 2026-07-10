const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * POST /api/events
 * Core Action: Create a brand new event.
 * Access Level: Restricted strictly to logged-in Organizers.
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    // RBAC Guard: If the authenticated token payload is not an Organizer, block the request
    if (req.user.role !== 'Organizer') {
      return res.status(403).json({ error: "Access Denied: Only Organizers can instantiate events." });
    }

    const { title, description, category, tags, capacity } = req.body;

    // Build the new event object. Available seats match the total capacity on day one.
    const newEvent = await Event.create({
      title,
      description,
      category,
      tags: tags || [],
      capacity: Number(capacity),
      availableSeats: Number(capacity),
      waitlist: []
    });

    res.status(201).json({ message: "Event established successfully.", event: newEvent });
  } catch (err) {
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
    res.status(500).json({ error: "Database reading engine encountered a processing fault." });
  }
});

/**
 * PUT /api/events/:id
 * Core Action: Modify event traits (e.g., description, tagging matrices).
 * Access Level: Restricted strictly to logged-in Organizers.
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Organizer') {
      return res.status(403).json({ error: "Access Denied: Administrative rights required." });
    }

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
    res.status(500).json({ error: "Internal mutation fault rewriting data object." });
  }
});

/**
 * DELETE /api/events/:id
 * Core Action: Wipe an event node out of the database cluster entirely.
 * Access Level: Restricted strictly to logged-in Organizers.
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Organizer') {
      return res.status(403).json({ error: "Access Denied: Administrative rights required." });
    }

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Target event object node not found." });
    }

    res.json({ message: "Event node scrubbed clean from system catalog." });
  } catch (err) {
    res.status(500).json({ error: "Internal breakdown executing document removal query." });
  }
});

module.exports = router;