const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Event title is mandatory"],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, "Event description is mandatory"] 
  },
  category: { 
    type: String, 
    required: [true, "Domain category grouping is mandatory"] 
  },
  tags: [{ 
    type: String 
  }], // Array of strings used for similarity calculation vectors
  capacity: { 
    type: Number, 
    required: [true, "Total ticket capacity pool is mandatory"] 
  },
  availableSeats: { 
    type: Number, 
    required: [true, "Remaining available seat inventory is mandatory"] 
  },
  // System Waitlist Storage: Array used by the binary heap processing engine
  waitlist: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    priorityScore: { 
      type: Number 
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);