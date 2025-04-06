const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      default: 0, // 0 for unlimited
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      enum: ["Social", "Educational", "Business", "Other"],
      default: "Other",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meetLink: {
      type: String, // Link to virtual meeting if applicable
    },
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed", "cancelled"],
      default: "planned", // Default status when the event is created
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
