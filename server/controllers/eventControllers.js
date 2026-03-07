const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  const event = await Event.create(req.body);
  res.json(event);
};

exports.getEvents = async (req, res) => {
  const events = await Event.find().populate("organizer");
  res.json(events);
};

exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json(event);
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
};