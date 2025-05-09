import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { Pencil, Trash2, Plus, Check, Flame, Zap, Activity, Award, Calendar, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '../../utils/messages';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import Chart from 'react-apexcharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'calendar', 'progress'
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const navigate = useNavigate();

  // Fetch workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(API_PATHS.WORKOUT.GET_ALL_WORKOUT);
        setWorkouts(res.data);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        showError('Failed to load workouts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  // Category themes
  const categoryThemes = {
    strength: { 
      bg: 'bg-gradient-to-br from-red-50 to-red-100', 
      border: 'border-red-200',
      icon: '💪',
      color: 'text-red-600'
    },
    cardio: { 
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100', 
      border: 'border-blue-200',
      icon: '🏃‍♂️',
      color: 'text-blue-600'
    },
    flexibility: { 
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100', 
      border: 'border-purple-200',
      icon: '🧘‍♀️',
      color: 'text-purple-600'
    },
    other: { 
      bg: 'bg-gradient-to-br from-green-50 to-green-100', 
      border: 'border-green-200',
      icon: '🏋️',
      color: 'text-green-600'
    }
  };

  // Toggle workout completion
  const toggleComplete = (id) => {
    setCompletedWorkouts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate workout stats
  const workoutStats = workouts.reduce((acc, workout) => {
    acc.totalWorkouts += 1;
    acc.totalSets += workout.sets;
    acc.totalReps += workout.reps;
    return acc;
  }, { totalWorkouts: 0, totalSets: 0, totalReps: 0 });

  // NEW: Calculate PRs (Personal Records)
  const personalRecords = workouts.reduce((acc, workout) => {
    if (!acc[workout.exercise] || workout.weight > acc[workout.exercise].weight) {
      acc[workout.exercise] = {
        weight: workout.weight,
        date: workout.date,
        sets: workout.sets,
        reps: workout.reps
      };
    }
    return acc;
  }, {});

  // NEW: Prepare data for progress chart
  const prepareProgressData = () => {
    const exerciseMap = {};
    workouts.forEach(workout => {
      if (!exerciseMap[workout.exercise]) {
        exerciseMap[workout.exercise] = [];
      }
      exerciseMap[workout.exercise].push({
        date: new Date(workout.date).toLocaleDateString(),
        weight: workout.weight,
        sets: workout.sets,
        reps: workout.reps
      });
    });
    return exerciseMap;
  };

  const progressData = prepareProgressData();

  // NEW: Prepare calendar heatmap data
  const prepareCalendarData = () => {
    const dateMap = {};
    workouts.forEach(workout => {
      const date = new Date(workout.date).toISOString().split('T')[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    return Object.entries(dateMap).map(([date, count]) => ({ date, count }));
  };

  const calendarData = prepareCalendarData();

  // Chart options for progress
  const progressChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#22d172', '#3b82f6', '#f59e0b'],
    stroke: { width: 3, curve: 'smooth' },
    markers: { size: 5 },
    xaxis: {
      type: 'category',
      labels: { style: { colors: '#64748B' } }
    },
    yaxis: {
      labels: { style: { colors: '#64748B' } }
    },
    tooltip: {
      theme: 'light'
    },
    legend: {
      position: 'top',
      labels: { colors: '#64748B' }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(API_PATHS.WORKOUT.DELETE_WORKOUT(deleteId));
      showSuccess('Workout deleted successfully!');
      setWorkouts(prev => prev.filter(w => w._id !== deleteId));
    } catch (err) {
      console.error(err);
      showError('Failed to delete workout');
    } finally {
      setShowModal(false);
      setDeleteId(null);
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
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Workout Tracker</h1>
            <p className="text-gray-500 mt-2">Build strength, track progress</p>
          </div>
          <Link to="/add-workout">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#22d172] hover:bg-[#1db863] text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              <span>Add Workout</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Navigation Tabs - NEW */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 font-medium ${activeTab === 'list' ? 'text-[#22d172] border-b-2 border-[#22d172]' : 'text-gray-500'}`}
          >
            Workout List
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 font-medium ${activeTab === 'calendar' ? 'text-[#22d172] border-b-2 border-[#22d172]' : 'text-gray-500'}`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 font-medium ${activeTab === 'progress' ? 'text-[#22d172] border-b-2 border-[#22d172]' : 'text-gray-500'}`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab('pr')}
            className={`px-4 py-2 font-medium ${activeTab === 'pr' ? 'text-[#22d172] border-b-2 border-[#22d172]' : 'text-gray-500'}`}
          >
            Personal Records
          </button>
        </div>

        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Workouts</p>
                <p className="text-2xl font-bold">{workoutStats.totalWorkouts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <Flame className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sets</p>
                <p className="text-2xl font-bold">{workoutStats.totalSets}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Zap className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Reps</p>
                <p className="text-2xl font-bold">{workoutStats.totalReps}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'list' && (
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 space-y-6">
            {workouts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm"
              >
                <div className="w-40 h-40 bg-[#22d172]/10 rounded-full flex items-center justify-center mb-6">
                  <Activity size={60} className="text-[#22d172]" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">No workouts logged yet</h3>
                <p className="text-gray-500 mb-6">Start building your fitness journey today!</p>
                <Link to="/add-workout">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#22d172] hover:bg-[#1db863] text-white px-8 py-3 rounded-xl shadow-md"
                  >
                    Log Your First Workout
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <AnimatePresence>
                {workouts.map((workout) => (
                  <motion.div
                    key={workout._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className={`${categoryThemes[workout.category].bg} rounded-2xl border ${categoryThemes[workout.category].border} overflow-hidden shadow-md hover:shadow-lg transition-shadow relative`}
                  >
                    <button
                      onClick={() => toggleComplete(workout._id)}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${completedWorkouts[workout._id] ? 'bg-[#22d172] text-white' : 'bg-white border border-gray-300'}`}
                    >
                      <Check size={16} />
                    </button>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-2xl ${categoryThemes[workout.category].color}`}>
                              {categoryThemes[workout.category].icon}
                            </span>
                            <h2 className="text-xl font-bold text-gray-800 capitalize">
                              {workout.exercise}
                            </h2>
                          </div>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryThemes[workout.category].color} bg-opacity-20`}>
                            {workout.category}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/80 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Sets</p>
                          <p className="text-lg font-bold text-gray-800">{workout.sets}</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Reps</p>
                          <p className="text-lg font-bold text-gray-800">{workout.reps}</p>
                        </div>
                        <div className="bg-white/80 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="text-lg font-bold text-gray-800">{workout.weight || '-'} kg</p>
                        </div>
                      </div>

                      {workout.notes && (
                        <div className="bg-white/80 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {workout.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          {new Date(workout.date).toLocaleDateString()}
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/edit-workout/${workout._id}`)}
                            className="text-gray-400 hover:text-[#22d172] transition-colors"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(workout._id);
                              setShowModal(true);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}

        {/* NEW: Calendar View */}
        {activeTab === 'calendar' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-[#22d172]" size={20} />
              Workout Calendar
            </h2>
            <CalendarHeatmap
              startDate={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)}
              endDate={new Date()}
              values={calendarData}
              classForValue={(value) => {
                if (!value) return 'color-empty';
                return `color-scale-${Math.min(4, value.count)}`;
              }}
              showWeekdayLabels
            />
            <div className="flex justify-center mt-4 gap-4">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-[#ebedf0]"></span>
                <span className="text-xs">0 workouts</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-[#9be9a8]"></span>
                <span className="text-xs">1 workout</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-[#40c463]"></span>
                <span className="text-xs">2 workouts</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-[#30a14e]"></span>
                <span className="text-xs">3+ workouts</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* NEW: Progress Charts */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {Object.keys(progressData).length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                <p className="text-gray-500">No progress data available yet</p>
              </div>
            ) : (
              Object.entries(progressData).map(([exercise, data]) => (
                <div key={exercise} className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-lg font-bold mb-4">{exercise} Progress</h3>
                  <Chart
                    options={{
                      ...progressChartOptions,
                      xaxis: {
                        categories: data.map(entry => entry.date),
                        labels: { style: { colors: '#64748B' } }
                      }
                    }}
                    series={[
                      {
                        name: 'Weight (kg)',
                        data: data.map(entry => entry.weight)
                      },
                      {
                        name: 'Sets',
                        data: data.map(entry => entry.sets)
                      },
                      {
                        name: 'Reps',
                        data: data.map(entry => entry.reps)
                      }
                    ]}
                    type="line"
                    height={350}
                  />
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* NEW: Personal Records */}
        {activeTab === 'pr' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {Object.keys(personalRecords).length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                <p className="text-gray-500">No personal records yet</p>
              </div>
            ) : (
              Object.entries(personalRecords).map(([exercise, record]) => (
                <div key={exercise} className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{exercise}</h3>
                      <p className="text-sm text-gray-500">
                        Achieved on: {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-[#22d172]/10 p-2 rounded-full">
                      <Award className="text-[#22d172]" size={24} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Max Weight</p>
                      <p className="text-lg font-bold">{record.weight || '-'} kg</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Sets</p>
                      <p className="text-lg font-bold">{record.sets}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Reps</p>
                      <p className="text-lg font-bold">{record.reps}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
          title="Delete Workout?"
          message="Are you sure you want to delete this workout?"
        />
      </div>
    </DashboardLayout>
  );
};

export default WorkoutPage;