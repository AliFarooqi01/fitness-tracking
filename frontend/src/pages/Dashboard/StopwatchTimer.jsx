import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { showSuccess, showError } from '../../utils/messages';
import { UserContext } from '../../context/UserContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Flag, Clock } from 'lucide-react';
import { Timer as StopwatchIcon } from 'lucide-react'; // ✅ Fix: using Timer icon as Stopwatch

const exercises = [
  { name: 'Push-ups', icon: '💪', color: 'bg-red-100 text-red-600' },
  { name: 'Planks', icon: '🧘‍♂️', color: 'bg-blue-100 text-blue-600' },
  { name: 'Running', icon: '🏃‍♂️', color: 'bg-green-100 text-green-600' },
  { name: 'Cycling', icon: '🚴‍♂️', color: 'bg-purple-100 text-purple-600' },
  { name: 'Yoga', icon: '🧘‍♀️', color: 'bg-amber-100 text-amber-600' }
];

const formatTime = (time) => {
  const pad = (num) => String(num).padStart(2, '0');
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return hours > 0 
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` 
    : `${pad(minutes)}:${pad(seconds)}`;
};

const StopwatchTimer = () => {
  const { user } = useContext(UserContext);

  const [mode, setMode] = useState('stopwatch');
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);

  const [stopwatchTime, setStopwatchTime] = useState(0);
  const stopwatchInterval = useRef(null);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [timerInput, setTimerInput] = useState(60);
  const [timerTime, setTimerTime] = useState(60);
  const timerInterval = useRef(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Play sound
  const playAlertSound = () => {
    const audio = new Audio('/sounds/alarm.mp3');
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  // Save log to backend
  const saveLog = async (duration) => {
    try {
      await axios.post(API_PATHS.TIMERLOG.ADD_TIMER_LOG, {
        exercise: selectedExercise.name,
        mode,
        duration,
      });
      showSuccess("Workout log saved successfully! 🔥");
    } catch (err) {
      showError("Error saving log!");
    }
  };
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true); // Start loading before fetching
        const res = await axios.get(API_PATHS.TIMERLOG.GET_TIMER_LOGS);
        setLogs(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch timer logs", err);
      } finally {
        setIsLoading(false); // End loading after data is fetched or on error
      }
    };
    fetchLogs();
  }, []);
  
  // Stopwatch
  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchInterval.current = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(stopwatchInterval.current);
    }
    return () => clearInterval(stopwatchInterval.current);
  }, [isStopwatchRunning]);

  // Timer
  useEffect(() => {
    if (isTimerRunning && timerTime > 0) {
      timerInterval.current = setInterval(() => {
        setTimerTime(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }

    if (timerTime === 0 && isTimerRunning) {
      playAlertSound();
      setIsTimerRunning(false);
      saveLog(timerInput);
      showSuccess(`${selectedExercise.name} timer completed!`);
    }

    return () => clearInterval(timerInterval.current);
  }, [isTimerRunning, timerTime]);

  const addLap = () => {
    setLaps([...laps, stopwatchTime]);
  };

  const resetStopwatch = () => {
    saveLog(stopwatchTime);
    setStopwatchTime(0);
    setIsStopwatchRunning(false);
    setLaps([]);
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
      <div className="min-h-screen bg-gray-50 p-6">
        
          {/* Header */}
          <div className="bg-gradient-to-r from-[#22d172] to-[#3b82f6] p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              {mode === 'stopwatch' ? <StopwatchIcon size={24} />: <Clock size={24} />}
              <span>{mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}</span>
            </h1>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Exercise Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exercise
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {exercises.map((exercise) => (
                  <motion.div
                    key={exercise.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedExercise(exercise)}
                      className={`w-full p-2 rounded-lg border-2 transition-all ${selectedExercise.name === exercise.name ? 'border-[#22d172]' : 'border-gray-200'} ${exercise.color}`}
                    >
                      <div className="text-xl">{exercise.icon}</div>
                      <div className="text-xs mt-1 truncate">{exercise.name}</div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-center gap-2 bg-gray-100 p-1 rounded-lg">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode('stopwatch')}
                className={`flex-1 py-2 rounded-md transition-colors ${mode === 'stopwatch' ? 'bg-white shadow-sm text-[#22d172]' : 'text-gray-600'}`}
              >
                <div className="flex items-center justify-center gap-2">
                <StopwatchIcon size={24} />
                  <span>Stopwatch</span>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode('timer')}
                className={`flex-1 py-2 rounded-md transition-colors ${mode === 'timer' ? 'bg-white shadow-sm text-[#22d172]' : 'text-gray-600'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock size={16} />
                  <span>Timer</span>
                </div>
              </motion.button>
            </div>

            {/* Display */}
            {mode === 'stopwatch' ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-mono font-bold text-gray-800 mb-2">
                    {formatTime(stopwatchTime)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedExercise.icon} {selectedExercise.name}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                    className={`p-3 rounded-full ${isStopwatchRunning ? 'bg-amber-500' : 'bg-[#22d172]'} text-white shadow-md`}
                  >
                    {isStopwatchRunning ? <Pause size={24} /> : <Play size={24} />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addLap}
                    disabled={!isStopwatchRunning}
                    className="p-3 rounded-full bg-blue-500 text-white shadow-md disabled:opacity-50"
                  >
                    <Flag size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetStopwatch}
                    className="p-3 rounded-full bg-red-500 text-white shadow-md"
                  >
                    <RotateCcw size={24} />
                  </motion.button>
                </div>

                {laps.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Laps</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {laps.map((lap, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">Lap {index + 1}</span>
                          <span className="font-mono">{formatTime(lap)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-mono font-bold text-gray-800 mb-2">
                    {formatTime(timerTime)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedExercise.icon} {selectedExercise.name}
                  </div>
                </div>

                {!isTimerRunning && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Set Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={timerInput}
                      onChange={(e) => {
                        setTimerInput(Number(e.target.value));
                        setTimerTime(Number(e.target.value));
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent text-center font-mono"
                    />
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {!isTimerRunning ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setTimerTime(timerInput);
                        setIsTimerRunning(true);
                      }}
                      className="px-6 py-3 bg-[#22d172] text-white rounded-lg shadow-md flex items-center gap-2"
                    >
                      <Play size={20} />
                      <span>Start</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsTimerRunning(false)}
                      className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow-md flex items-center gap-2"
                    >
                      <Pause size={20} />
                      <span>Pause</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerTime(timerInput);
                    }}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md flex items-center gap-2"
                  >
                    <RotateCcw size={20} />
                    <span>Reset</span>
                  </motion.button>
                </div>
              </div>
            )}
          </div>
      </div>
    </DashboardLayout>
  );
};

export default StopwatchTimer;