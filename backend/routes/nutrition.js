const express = require('express');
const router = express.Router();
const {
  addNutrition,
  getNutritions,
  getSingleNutrition,
  updateNutrition,
  deleteSingleFoodItem
} = require('../controllers/nutritionController');

const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/add', protect, addNutrition);
router.get('/get', protect, getNutritions);
router.get('/:id', protect, getSingleNutrition);
router.put('/:id', protect, updateNutrition);
router.delete('/:mealId/food/:foodItemId', protect, deleteSingleFoodItem);

module.exports = router;
