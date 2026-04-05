const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  socketId: String,
  userId: String,
  username: String,
  avatar: Number,
  position: { x: Number, y: Number },
  connectedTo: [String],
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);