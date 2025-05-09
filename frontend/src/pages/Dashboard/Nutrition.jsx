import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { Pencil, Trash2, Plus, Flame, Zap, Droplet, Carrot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '../../utils/messages';
import DeleteFoodItemModal from '../../components/modals/DeleteFoodItemModal';

const NutritionPage = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const res = await axios.get(API_PATHS.NUTRITION.GET_ALL_NUTRITION);
        setNutritionData(res.data);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
        showError("Failed to fetch nutrition data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNutrition();
  }, []);

  const groupedData = nutritionData.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {});

  const mealTypeThemes = {
    breakfast: { 
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100', 
      border: 'border-amber-200',
      icon: '🌅',
      color: 'text-amber-600'
    },
    lunch: { 
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100', 
      border: 'border-blue-200',
      icon: '🍽️',
      color: 'text-blue-600'
    },
    dinner: { 
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100', 
      border: 'border-purple-200',
      icon: '🌙',
      color: 'text-purple-600'
    },
    snack: { 
      bg: 'bg-gradient-to-br from-green-50 to-green-100', 
      border: 'border-green-200',
      icon: '🍎',
      color: 'text-green-600'
    }
  };

  const handleOpenDeleteModal = (meal) => {
    setSelectedMeal(meal);
    setSelectedFoodId(meal.foodItems[0]?._id || '');
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/v1/nutrition/${selectedMeal._id}/food/${selectedFoodId}`);
  
      // Update state properly: remove just one food item from that meal
      setNutritionData((prevData) =>
        prevData.map((meal) => {
          if (meal._id === selectedMeal._id) {
            const updatedItems = meal.foodItems.filter((item) => item._id !== selectedFoodId);
            return { ...meal, foodItems: updatedItems };
          }
          return meal;
        }).filter(meal => meal.foodItems.length > 0) // remove meal only if all items deleted
      );
  
      showSuccess("Food item deleted successfully!");
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      showError("Failed to delete food item");
    }
  };
  

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen bg-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#22d172] border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Nutrition Tracker</h1>
            <p className="text-gray-500 mt-2">Track your meals and macros effortlessly</p>
          </div>
          <Link to="/add-nutrition">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#22d172] hover:bg-[#1db863] text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              <span>Add Meal</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Content */}
        {Object.keys(groupedData).length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm"
          >
            <div className="w-40 h-40 bg-[#22d172]/10 rounded-full flex items-center justify-center mb-6">
              <Flame size={60} className="text-[#22d172]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">No meals logged yet</h3>
            <p className="text-gray-500 mb-6">Start tracking your nutrition journey today!</p>
            <Link to="/add-nutrition">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-[#22d172] hover:bg-[#1db863] text-white px-8 py-3 rounded-xl shadow-md"
              >
                Log Your First Meal
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-10">
            <AnimatePresence>
              {Object.entries(groupedData).map(([mealType, meals]) => (
                <motion.div
                  key={mealType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl ${mealTypeThemes[mealType].color}`}>
                      {mealTypeThemes[mealType].icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">
                      {mealType}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meals.map((meal) => {
                      const totals = meal.foodItems.reduce(
                        (acc, item) => ({
                          calories: acc.calories + Number(item.calories || 0),
                          protein: acc.protein + Number(item.protein || 0),
                          carbs: acc.carbs + Number(item.carbs || 0),
                          fats: acc.fats + Number(item.fats || 0)
                        }),
                        { calories: 0, protein: 0, carbs: 0, fats: 0 }
                      );

                      return (
                        <motion.div
                          key={meal._id}
                          whileHover={{ y: -5 }}
                          className={`${mealTypeThemes[mealType].bg} rounded-2xl border ${mealTypeThemes[mealType].border} overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <span className={`text-xs font-medium px-3 py-1 rounded-full ${mealTypeThemes[mealType].color} bg-opacity-20`}>
                                {mealType}
                              </span>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => navigate(`/edit-nutrition/${meal._id}`)}
                                  className="text-gray-400 hover:text-[#22d172] transition-colors"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteModal(meal)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4 mb-6">
                              {meal.foodItems.map((item) => (
                                <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                  <div>
                                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.quantity}</p>
                                  </div>
                                  <span className="text-sm font-bold text-[#22d172]">
                                    {item.calories} cal
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Macro Summary */}
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                <Flame size={16} className="text-red-400" />
                                <span className="text-sm font-bold text-gray-700">{totals.calories.toFixed(0)} cal</span>
                              </div>
                              <div className="flex gap-4">
                                <div className="flex items-center gap-1">
                                  <Droplet size={14} className="text-blue-400" />
                                  <span className="text-xs text-gray-600">{totals.protein.toFixed(1)}g</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Zap size={14} className="text-yellow-400" />
                                  <span className="text-xs text-gray-600">{totals.carbs.toFixed(1)}g</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Carrot size={14} className="text-orange-400" />
                                  <span className="text-xs text-gray-600">{totals.fats.toFixed(1)}g</span>
                                </div>
                              </div>
                            </div>

                            {/* Macro Progress Bars */}
                            <div className="space-y-2">
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(totals.protein / 50) * 100}%` }}
                                  transition={{ duration: 1 }}
                                  className="h-full bg-blue-400 rounded-full"
                                />
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(totals.carbs / 150) * 100}%` }}
                                  transition={{ duration: 1 }}
                                  className="h-full bg-yellow-400 rounded-full"
                                />
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(totals.fats / 70) * 100}%` }}
                                  transition={{ duration: 1 }}
                                  className="h-full bg-orange-400 rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Delete Modal */}
        <DeleteFoodItemModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          foodItems={selectedMeal?.foodItems || []}
          selected={selectedFoodId}
          setSelected={setSelectedFoodId}
        />
      </div>
    </DashboardLayout>
  );
};

export default NutritionPage;