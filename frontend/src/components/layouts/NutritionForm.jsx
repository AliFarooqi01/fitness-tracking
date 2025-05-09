import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { showSuccess, showError } from '../../utils/messages';
import { motion } from 'framer-motion';
import { Coffee, Utensils, MoonStar, Apple, Plus, Save, Zap } from 'lucide-react';

const NutritionForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mealType, setMealType] = useState('breakfast');
  const [foodItems, setFoodItems] = useState([
    { name: '', quantity: '', calories: '', protein: '', carbs: '', fats: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast', icon: <Coffee size={18} />, color: 'bg-amber-100 text-amber-600' },
    { value: 'lunch', label: 'Lunch', icon: <Utensils size={18} />, color: 'bg-blue-100 text-blue-600' },
    { value: 'dinner', label: 'Dinner', icon: <MoonStar size={18} />, color: 'bg-purple-100 text-purple-600' },
    { value: 'snack', label: 'Snack', icon: <Apple size={18} />, color: 'bg-green-100 text-green-600' }
  ];

  // Load data in edit mode
  useEffect(() => {
    if (isEdit && id) {
      axios.get(`/api/v1/nutrition/${id}`)
        .then(res => {
          setMealType(res.data.mealType);
          setFoodItems(res.data.foodItems);
        })
        .catch(err => {
          console.error(err);
          showError("Failed to load nutrition data");
        });
    }
  }, [isEdit, id]);

  const handleMealChange = (value) => setMealType(value);

  const handleFoodChange = (index, e) => {
    const updated = [...foodItems];
    updated[index][e.target.name] = e.target.value;
    setFoodItems(updated);
  };

  const handleAddFoodItem = () => {
    setFoodItems([
      ...foodItems,
      { name: '', quantity: '', calories: '', protein: '', carbs: '', fats: '' },
    ]);
  };

  const handleRemoveFoodItem = (index) => {
    if (foodItems.length > 1) {
      setFoodItems(foodItems.filter((_, i) => i !== index));
    }
  };

  const handleFetchNutrition = async (index) => {
    const food = foodItems[index];
    if (!food.name || !food.quantity) {
      return showError("Enter food name and quantity first.");
    }

    try {
      const res = await axios.get(`${API_PATHS.NUTRITIONIX.GET_NUTRITION_DATA}?food=${food.name}&quantity=${food.quantity}`);
      const data = res.data;

      const updated = [...foodItems];
      updated[index] = {
        ...updated[index],
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats,
      };
      setFoodItems(updated);
      showSuccess("Nutrition data fetched successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to fetch nutrition data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      mealType,
      foodItems,
    };

    try {
      if (isEdit) {
        await axios.put(`/api/v1/nutrition/${id}`, payload);
        showSuccess("Nutrition updated successfully!");
      } else {
        await axios.post(API_PATHS.NUTRITION.ADD_NUTRITION, payload);
        showSuccess("Nutrition added successfully!");
      }
      navigate("/nutrition");
    } catch (err) {
      console.error(err);
      showError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCalories = foodItems.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const totalProtein = foodItems.reduce((sum, item) => sum + Number(item.protein || 0), 0);
  const totalCarbs = foodItems.reduce((sum, item) => sum + Number(item.carbs || 0), 0);
  const totalFats = foodItems.reduce((sum, item) => sum + Number(item.fats || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-[#22d172] to-[#3b82f6] p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {isEdit ? (
              <>
                <Save size={24} />
                <span>Edit Nutrition Entry</span>
              </>
            ) : (
              <>
                <Plus size={24} />
                <span>Add Nutrition Entry</span>
              </>
            )}
          </h1>
          <p className="text-white/90 mt-1">
            {isEdit ? 'Update your meal details' : 'Log your food intake'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Meal Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mealTypeOptions.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    id={option.value}
                    name="mealType"
                    value={option.value}
                    checked={mealType === option.value}
                    onChange={() => handleMealChange(option.value)}
                    className="hidden"
                  />
                  <label
                    htmlFor={option.value}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${mealType === option.value ? 'border-[#22d172]' : 'border-gray-200'} ${option.color}`}
                  >
                    <span className="mb-2">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Food Items */}
          {foodItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Food Item #{index + 1}</h3>
                {foodItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFoodItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Food Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Name *
                  </label>
                  <input
                    name="name"
                    value={item.name}
                    onChange={(e) => handleFoodChange(index, e)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                    placeholder="e.g. Grilled Chicken, Brown Rice"
                    required
                  />
                </div>

                {/* Quantity and Nutrition Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleFoodChange(index, e)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                      placeholder="e.g. 100g, 1 serving"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <motion.button
                      type="button"
                      onClick={() => handleFetchNutrition(index)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Zap size={16} />
                      <span>Fetch Nutrition Data</span>
                    </motion.button>
                  </div>
                </div>

                {/* Nutrition Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calories
                    </label>
                    <input
                      name="calories"
                      type="number"
                      min="0"
                      value={Math.round(item.calories)}
                      onChange={(e) => handleFoodChange(index, e)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                      placeholder="Calories"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protein (g)
                    </label>
                    <input
                      name="protein"
                      type="number"
                      min="0"
                      step="0.1"
                      value={Math.round(item.protein)}
                      onChange={(e) => handleFoodChange(index, e)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                      placeholder="Protein"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carbs (g)
                    </label>
                    <input
                      name="carbs"
                      type="number"
                      min="0"
                      step="0.1"
                      value={Math.round(item.carbs)}
                      onChange={(e) => handleFoodChange(index, e)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                      placeholder="Carbs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fats (g)
                    </label>
                    <input
                      name="fats"
                      type="number"
                      min="0"
                      step="0.1"
                      value={Math.round(item.fats)}
                      onChange={(e) => handleFoodChange(index, e)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                      placeholder="Fats"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Another Food Item */}
          <motion.button
            type="button"
            onClick={handleAddFoodItem}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full border-2 border-dashed border-gray-300 hover:border-[#22d172] rounded-xl p-4 text-gray-500 hover:text-[#22d172] transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span>Add Another Food Item</span>
          </motion.button>

          {/* Nutrition Summary */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-medium text-gray-800 mb-3">Meal Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-xs">
                <p className="text-sm text-gray-500">Total Calories</p>
                <p className="text-lg font-bold">{Math.round(totalCalories)} cal</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-xs">
                <p className="text-sm text-gray-500">Protein</p>
                <p className="text-lg font-bold">{totalProtein.toFixed(1)}g</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-xs">
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="text-lg font-bold">{totalCarbs.toFixed(1)}g</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-xs">
                <p className="text-sm text-gray-500">Fats</p>
                <p className="text-lg font-bold">{totalFats.toFixed(1)}g</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => navigate('/nutrition')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-lg text-white ${isSubmitting ? 'bg-gray-400' : 'bg-[#22d172] hover:bg-[#1db863]'} transition-colors flex items-center gap-2`}
            >
              {isSubmitting ? (
                'Processing...'
              ) : (
                <>
                  {isEdit ? <Save size={18} /> : <Plus size={18} />}
                  <span>{isEdit ? 'Update Entry' : 'Add Entry'}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NutritionForm;