// 📁 backend/routes/workout.js
const express = require('express');
const router = express.Router();
const {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  getSingleWorkout
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addWorkout);
router.get('/get', protect, getWorkouts);
router.get('/:id', protect, getSingleWorkout); // controller needed

router.put('/:id', protect, updateWorkout);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;