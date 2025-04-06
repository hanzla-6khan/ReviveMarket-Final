const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/conversations", verifyToken, messageController.startConversation);
router.post("/messages", verifyToken, messageController.sendMessage);
router.get(
  "/conversations/:conversationId/messages",
  verifyToken,
  messageController.getMessages
);
router.get("/conversations", verifyToken, messageController.getConversations);

module.exports = router;
