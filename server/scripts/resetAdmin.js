const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Update model path if capitalized (e.g., ../models/User)

async function resetAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/eventhub');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const updated = await User.findOneAndUpdate(
      { email: 'binu@gmail.com' },
      { $set: { password: hashedPassword, role: 'admin' } },
      { new: true }
    );

    console.log('SUCCESS: Admin updated:', updated.email, '| Role:', updated.role);
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

resetAdmin();