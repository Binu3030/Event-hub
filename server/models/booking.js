const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, "Attendee relational link is mandatory"] 
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: [true, "Target event node link is mandatory"] 
  },
  bookedAt: { 
    type: Date, 
    default: Date.now 
  },
  ticketCode: { 
    type: String, 
    unique: true, 
    required: [true, "Unique ticket verification string is mandatory"] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);