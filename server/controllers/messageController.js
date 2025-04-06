const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const { getIO } = require("../config/socket");
const createError = require("../utils/appError");
const Product = require("../models/productModel");

exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;
    if (!conversationId || !content) {
      return next(
        new createError("Conversation ID and content are required", 400)
      );
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return next(new createError("Conversation not found", 404));
    }

    if (!conversation.participants.includes(req.user.id)) {
      return next(new createError("Not authorized to send message", 403));
    }

    let message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      content,
    });

    // Populate sender information
    message = await Message.findById(message._id).populate(
      "sender",
      "name profileImage"
    );

    // Update conversation last message time
    conversation.lastMessage = Date.now();
    await conversation.save();

    // Emit to all participants
    const io = getIO();
    conversation.participants.forEach((participantId) => {
      io.to(participantId.toString()).emit("newMessage", {
        message,
        conversationId,
      });
    });

    res.status(201).json({
      status: "success",
      successMessage: "Message sent successfully",
      message,
    });
  } catch (error) {
    next(error);
  }
};

exports.startConversation = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return next(new createError("Product ID is required", 400));
    }

    // Get product and seller information
    const product = await Product.findById(productId);
    if (!product) {
      return next(new createError("Product not found", 404));
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, product.seller] },
      product: productId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, product.seller],
        product: productId,
      });
    }

    res.status(201).json({
      status: "success",
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    // Check if conversation exists and user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      return next(
        new createError("Not authorized to view this conversation", 403)
      );
    }

    // Get messages
    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json({
      status: "success",
      messages,
    });
  } catch (error) {
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    // Get all active conversations for the user
    const conversations = await Conversation.find({
      participants: req.user.id,
      status: "active",
    })
      .populate("participants", "name profileImage")
      .populate("product", "name image")
      .sort({ lastMessage: -1 });

    // The main issue was here - conversations.participants is an array of arrays
    // We need to map through each conversation to get the other user
    const conversationsWithOtherUser = conversations.map((conversation) => {
      const otherUser = conversation.participants.find(
        (participant) => participant._id.toString() !== req.user.id
      );

      return {
        ...conversation.toObject(),
        otherUser,
      };
    });

    res.status(200).json({
      status: "success",
      conversations: conversationsWithOtherUser,
    });
  } catch (error) {
    next(error);
  }
};
