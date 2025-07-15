const express = require("express");
const router = express.Router();
const Message = require("./Message");

router.get("/", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
  res.json(messages.reverse());
});

module.exports = router;
