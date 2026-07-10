import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    required: true
  },
  location: String,
  price: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

// auto set availableSeats = capacity
eventSchema.pre("save", function(next) {
  if (!this.availableSeats) {
    this.availableSeats = this.capacity;
  }
  next();
});

export default mongoose.model("Event", eventSchema);