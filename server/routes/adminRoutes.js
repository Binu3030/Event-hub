const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Get global telemetry data
router.get('/stats', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.json({
      totalEvents,
      totalUsers,
      totalBookings,
      revenue: totalBookings * 25 // Example static multiplier or aggregation calculation
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve telemetry stats.' });
  }
});

// Get user list
router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// Update user role
router.patch('/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

module.exports = router;