const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = "super_secret_university_grading_key_2026";

/**
 * POST /api/auth/register
 * Registers a new identity, hashes passwords, and saves it to MongoDB
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the identity identifier profile is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Secure Hashing: Run 10 salt rounds to secure passwords cleanly
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save profile with empty tag vectors initialized for your future algorithm
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'Attendee',
      interactedTags: {} 
    });

    res.status(201).json({ 
      message: "Identity profile initialized successfully.", 
      userId: newUser._id 
    });
  } catch (err) {
    res.status(500).json({ error: "Internal compilation failure during registration handling." });
  }
});

/**
 * POST /api/auth/login
 * Validates credentials and returns a secure access token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the identity match profile
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credential entries provided." });
    }

    // Compare incoming plain-text inputs with the hashed database password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credential entries provided." });
    }

    // Issue a token encoded with user details that expires in 5 hours
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '5h' }
    );

    res.json({
      token,
      id: user._id,
      name: user.name,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: "Internal structural processing failure during login query." });
  }
});

module.exports = router;