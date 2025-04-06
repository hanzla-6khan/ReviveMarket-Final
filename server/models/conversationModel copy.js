// models/conversationModel.js
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    lastMessage: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
