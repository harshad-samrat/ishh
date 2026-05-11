const mongoose = require("mongoose");

const slashsecret = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const SlashSecret = mongoose.model("SlashSecret", slashsecret);
module.exports = SlashSecret;