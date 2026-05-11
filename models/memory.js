const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  note: {
    type: String,
    default: "",
  },
  image: {
    data: Buffer, // Actual image data
    contentType: String, // e.g., "image/jpeg"
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Memory", memorySchema);
