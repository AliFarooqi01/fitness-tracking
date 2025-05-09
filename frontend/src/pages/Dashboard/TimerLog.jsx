import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { Clock, Search, Filter, Calendar, Activity } from 'lucide-react';
import { Timer as StopwatchIcon } from 'lucide-react'; 
import { motion } from 'framer-motion';

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else if (mins > 0) {
    return `${mins}m ${sec}s`;
  } else {
    return `${sec}s`;
  }
};

const getExerciseColor = (exercise) => {
  const colors = {
    'Push-ups': 'bg-red-100 text-red-600 border-red-300',
    'Planks': 'bg-blue-100 text-blue-600 border-blue-300',
    'Running': 'bg-green-100 text-green-600 border-green-300',
    'Cycling': 'bg-purple-100 text-purple-600 border-purple-300',
    'Yoga': 'bg-amber-100 text-amber-600 border-amber-300'
  };
  return colors[exercise] || 'bg-gray-100 text-gray-600 border-gray-300';
};

const TimerLog = () => {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(API_PATHS.TIMERLOG.GET_TIMER_LOGS);
        setLogs(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch timer logs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    let result = logs;
    if (search) {
      result = result.filter(log =>
        log.exercise.toLowerCase().includes(search.toLowerCase()))
    }
    if (modeFilter !== "all") {
      result = result.filter(log => log.mode === modeFilter);
    }
    setFiltered(result);
  }, [search, modeFilter, logs]);
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
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Activity className="text-[#22d172]" size={28} />
              Workout History
            </h1>
            <p className="text-gray-500 mt-1">Track your fitness progress over time</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">Total Workouts</p>
              <p className="text-lg font-semibold">{logs.length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">Stopwatches</p>
              <p className="text-lg font-semibold">{logs.filter(l => l.mode === 'stopwatch').length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">Timers</p>
              <p className="text-lg font-semibold">{logs.filter(l => l.mode === 'timer').length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">Avg. Duration</p>
              <p className="text-lg font-semibold">
                {logs.length > 0 
                  ? formatDuration(Math.round(logs.reduce((a, b) => a + b.duration, 0) / logs.length) )
                  : '0s'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent"
              />
            </div>
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="text-gray-400" size={18} />
              </div>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 appearance-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent bg-white"
              >
                <option value="all">All Modes</option>
                <option value="stopwatch">Stopwatch</option>
                <option value="timer">Timer</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22d172]"></div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100"
          >
            <div className="mx-auto max-w-md">
              <Clock className="mx-auto text-gray-300" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-700">No workout logs found</h3>
              <p className="mt-2 text-gray-500">
                {search || modeFilter !== 'all' 
                  ? "Try adjusting your search or filter criteria" 
                  : "Your completed workouts will appear here"}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {filtered.map((log, idx) => (
              <motion.div 
                key={log._id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${getExerciseColor(log.exercise).split(' ')[2]}`}
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${getExerciseColor(log.exercise)}`}>
                        {log.mode === 'stopwatch' ? (
                          <StopwatchIcon  size={20} className={getExerciseColor(log.exercise).split(' ')[1]} />
                        ) : (
                          <Clock size={20} className={getExerciseColor(log.exercise).split(' ')[1]} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{log.exercise}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="flex items-center text-sm text-gray-500">
                            {log.mode === 'stopwatch' ? (
                              <StopwatchIcon  className="mr-1.5" size={14} />
                            ) : (
                              <Clock className="mr-1.5" size={14} />
                            )}
                            {log.mode.charAt(0).toUpperCase() + log.mode.slice(1)}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <span className="font-medium mr-1.5">Duration:</span>
                            {formatDuration(log.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5" size={14} />
                      {new Date(log.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TimerLog;