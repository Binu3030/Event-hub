const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  price: Number,
  capacity: Number,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Event", eventSchema);