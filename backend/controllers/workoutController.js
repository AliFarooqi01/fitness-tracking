// 📁 backend/controllers/workoutController.js
const Workout = require('../models/WorkoutModel');

exports.addWorkout = async (req, res) => {
  try {
    const workout = new Workout({ ...req.body, user: req.user.id });
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const data = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getSingleWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id });
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
