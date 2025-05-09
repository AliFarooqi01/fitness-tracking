const mongoose = require("mongoose");

const TimerLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exercise: { type: String, required: true },
  mode: { type: String, enum: ["stopwatch", "timer"], required: true },
  duration: { type: Number, required: true }, // in seconds
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TimerLog", TimerLogSchema);
