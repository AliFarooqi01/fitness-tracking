import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showSuccess, showError } from '../../utils/messages';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { motion } from 'framer-motion';
import { Zap, Dumbbell, HeartPulse, StretchHorizontal, Plus, Save } from 'lucide-react';

const WorkoutForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    exercise: '',
    category: 'strength',
    sets: '',
    reps: '',
    weight: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: 'strength', label: 'Strength', icon: <Dumbbell size={18} />, color: 'bg-red-100 text-red-600' },
    { value: 'cardio', label: 'Cardio', icon: <HeartPulse size={18} />, color: 'bg-blue-100 text-blue-600' },
    { value: 'flexibility', label: 'Flexibility', icon: <StretchHorizontal size={18} />, color: 'bg-purple-100 text-purple-600' },
    { value: 'other', label: 'Other', icon: <Zap size={18} />, color: 'bg-green-100 text-green-600' }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Pre-fill data if in edit mode
  useEffect(() => {
    const fetchWorkout = async () => {
      if (isEdit && id) {
        try {
          const res = await axios.get(API_PATHS.WORKOUT.GET_SINGLE_WORKOUT(id));
          setForm(res.data);
        } catch (err) {
          console.error(err);
          showError('Failed to load workout');
        }
      }
    };
    fetchWorkout();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEdit) {
        await axios.put(API_PATHS.WORKOUT.UPDATE_WORKOUT(id), form);
        showSuccess('Workout updated successfully!');
      } else {
        await axios.post(API_PATHS.WORKOUT.ADD_WORKOUT, form);
        showSuccess('Workout added successfully!');
      }
      navigate('/workout');
    } catch (err) {
      console.error(err);
      showError(isEdit ? 'Error updating workout' : 'Error adding workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-[#22d172] to-[#3b82f6] p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {isEdit ? (
              <>
                <Save size={24} />
                <span>Edit Workout</span>
              </>
            ) : (
              <>
                <Plus size={24} />
                <span>Add New Workout</span>
              </>
            )}
          </h1>
          <p className="text-white/90 mt-1">
            {isEdit ? 'Update your workout details' : 'Log your exercise session'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Exercise Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercise Name *
            </label>
            <input
              name="exercise"
              value={form.exercise}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
              placeholder="e.g. Bench Press, Running, Yoga"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categoryOptions.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    id={option.value}
                    name="category"
                    value={option.value}
                    checked={form.category === option.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor={option.value}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${form.category === option.value ? 'border-[#22d172]' : 'border-gray-200'} ${option.color}`}
                  >
                    <span className="mb-2">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Workout Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sets
              </label>
              <input
                name="sets"
                type="number"
                min="1"
                value={form.sets}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                placeholder="3"
              />
            </div>

            {/* Reps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reps
              </label>
              <input
                name="reps"
                type="number"
                min="1"
                value={form.reps}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                placeholder="10"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                name="weight"
                type="number"
                min="0"
                step="0.1"
                value={form.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                placeholder="20.5"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
              placeholder="Any additional notes about your workout..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => navigate('/workout')}
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
                  <span>{isEdit ? 'Update Workout' : 'Add Workout'}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default WorkoutForm;