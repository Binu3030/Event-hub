import Event from "../models/event.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user.id
    });

    res.status(201).json(event);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};