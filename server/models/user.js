const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name field is mandatory"] 
  },
  email: { 
    type: String, 
    unique: true, 
    required: [true, "Email field is mandatory"],
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Password hash storage is mandatory"] 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  // Algorithmic Weight Map: Stores tags as keys and frequency weights as values
  // e.g., { "tech": 5, "music": 2 }
  interactedTags: { 
    type: Map, 
    of: Number, 
    default: {} 
  } 
}, { timestamps: true });

// Instance method to easily check admin privilege
UserSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

module.exports = mongoose.model('User', UserSchema);