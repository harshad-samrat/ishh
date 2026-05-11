const mongoose = require("mongoose");

const reelAnswerSchema = new mongoose.Schema({
  reelId: {
    type: Number,
    required: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ReelAnswer", reelAnswerSchema);
