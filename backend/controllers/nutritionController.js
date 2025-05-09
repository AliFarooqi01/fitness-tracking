const Nutrition = require('../models/NutritionModel');

// ➕ Create New Nutrition Meal (with multiple food items)
exports.addNutrition = async (req, res) => {
  try {
    const { mealType, foodItems } = req.body;

    const totalCalories = foodItems.reduce((sum, item) => sum + Number(item.calories || 0), 0);

    const newMeal = new Nutrition({
      user: req.user.id,
      mealType,
      foodItems,
      totalCalories,
    });

    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add nutrition data' });
  }
};

// 📥 Get All Nutrition Meals of Current User
exports.getNutritions = async (req, res) => {
  try {
    const data = await Nutrition.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get nutrition data' });
  }
};

// 🧾 Get a Single Nutrition Meal by ID (for Edit)
exports.getSingleNutrition = async (req, res) => {
  try {
    const meal = await Nutrition.findOne({ _id: req.params.id, user: req.user.id });
    if (!meal) return res.status(404).json({ message: 'Nutrition not found' });
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nutrition meal' });
  }
};

// 🖊️ Update Entire Meal (with modified foodItems[])
exports.updateNutrition = async (req, res) => {
  try {
    const { mealType, foodItems } = req.body;
    const totalCalories = foodItems.reduce((sum, item) => sum + Number(item.calories || 0), 0);

    const updated = await Nutrition.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { mealType, foodItems, totalCalories },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Meal not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update nutrition data' });
  }
};

exports.deleteSingleFoodItem = async (req, res) => {
  try {
    const { mealId, foodItemId } = req.params;

    const meal = await Nutrition.findOne({ _id: mealId, user: req.user.id });
    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    meal.foodItems = meal.foodItems.filter(item => item._id.toString() !== foodItemId);
    meal.totalCalories = meal.foodItems.reduce((sum, item) => sum + Number(item.calories || 0), 0);

    if (meal.foodItems.length === 0) {
      await Nutrition.findByIdAndDelete(mealId);
      return res.status(200).json({ message: "Meal deleted as all food items removed", updatedMeal: null });
    }

    await meal.save();
    res.status(200).json({ message: 'Food item deleted successfully', updatedMeal: meal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete food item' });
  }
};

