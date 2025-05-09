const TimerLog = require("../models/TimerLogModel");

exports.addTimerLog = async (req, res) => {
  try {
    const { exercise, mode, duration } = req.body;
    const newLog = new TimerLog({
      user: req.user.id,
      exercise,
      mode,
      duration
    });
    await newLog.save();
    res.status(201).json({ message: "Log saved successfully", log: newLog });
  } catch (error) {
    res.status(500).json({ message: "Error saving log", error: error.message });
  }
};

exports.getTimerLogs = async (req, res) => {
  try {
    const logs = await TimerLog.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error: error.message });
  }
};
