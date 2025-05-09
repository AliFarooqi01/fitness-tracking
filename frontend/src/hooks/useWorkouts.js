// 📁 src/hooks/useWorkouts.js
import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(API_PATHS.WORKOUT.GET_ALL_WORKOUT);
        setWorkouts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  return { workouts, loading };
};

export default useWorkouts;



