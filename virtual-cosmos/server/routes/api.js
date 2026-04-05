const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/messages/:roomId', async (req, res) => {
  try {
    const msgs = await Message.find({ roomId: req.params.roomId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(msgs.reverse());
  } catch (e) {
    res.json([]);
  }
});

module.exports = router;