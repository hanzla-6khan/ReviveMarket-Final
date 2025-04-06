const Event = require("../models/eventModel");
const createError = require("../utils/appError");

// Create Event
exports.createEvent = async (req, res, next) => {
  try {
    // check for userType if user is not seller then return error
    if (req.user.userType !== "seller") {
      return next(new createError("You are not authorized", 401));
    }

    const event = await Event.create({
      ...req.body.eventData,
      organizer: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Update Event
exports.updateEvent = async (req, res, next) => {
  console.log(req.body);
  console.log(req.params.id);
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new createError("Event not found", 404));
    }

    if (req.user.userType !== "seller") {
      return next(new createError("You are not authorized", 401));
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// Get User Events
exports.getUserEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Events
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Get event by ID
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );
    if (!event) {
      return next(new createError("Event not found", 404));
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Join Event
exports.joinEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    // Check if event exists
    if (!event) {
      return next(new createError("Event not found", 404));
    }

    // Check if user is already attending the event
    if (event.attendees.includes(req.user._id)) {
      return next(new createError("You are already attending the event", 400));
    }

    // do not allow user to join the event if the event is already completed
    if (new Date(event.date) < new Date()) {
      return next(new createError("Event is already completed", 400));
    }

    // if the user is organizer then return error
    if (event.organizer.toString() === req.user._id.toString()) {
      return next(new createError("You are the organizer of this event", 400));
    }

    // Check if the event has a capacity and if it is full
    if (event.capacity && event.attendees.length >= event.capacity) {
      return next(new createError("Event is full", 400));
    }

    // Add user to attendees list
    event.attendees.push(req.user._id);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Successfully joined the event",
    });
  } catch (error) {
    next(error);
  }
};
