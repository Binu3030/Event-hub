const Booking = require("../models/booking");

exports.createBooking = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
};

exports.getBookings = async (req, res) => {
  const bookings = await Booking.find().populate("user event");
  res.json(bookings);
};

exports.cancelBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking cancelled" });
};