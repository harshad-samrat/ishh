const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  maturity: { type: Number, min: 0, max: 10 },
  honesty: { type: Number, min: 0, max: 10 },
  love: { type: Number, min: 0, max: 10 },
  care: { type: Number, min: 0, max: 10 },
  trustIssue: { type: Number, min: 0, max: 10 },
  understanding: { type: Number, min: 0, max: 10 },
  communication: { type: Number, min: 0, max: 10 },
  support: { type: Number, min: 0, max: 10 },
  respect: { type: Number, min: 0, max: 10 },
  overallRating: { type: Number, min: 0, max: 10 },

  importantThing: String,
  suggestions: String,
  otherThings: String,
  feelings: String,
  whatILike: String,
  improveInMe: String,
  whatIDontLike: String,
  oneLine: String,
  lifeAdvice: String,

  // Fun Questions
  cuteOrAnnoying: String,
  smartOrLucky: String,
  emotionalOrDramatic: String,
  heroOrClown: String,
  calmOrChaos: String,
  introvertOrAttention: String,
  matureOrBaccha: String,
  romanticOrCringe: String,
  riskyBestfriend: String,
  jealousOrChill: String,

  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
