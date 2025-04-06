const express = require("express");
const eventController = require("../controllers/eventController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(verifyToken, eventController.createEvent);

router.route("/my-events").get(verifyToken, eventController.getUserEvents);

router
  .route("/:id")
  .patch(verifyToken, eventController.updateEvent)
  .get(eventController.getEventById);

router.route("/:id/join").patch(verifyToken, eventController.joinEvent);

module.exports = router;
