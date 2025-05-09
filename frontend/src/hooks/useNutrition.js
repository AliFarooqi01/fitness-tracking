// 📁 src/hooks/useNutrition.js
import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

const useNutrition = () => {
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const res = await axios.get(API_PATHS.NUTRITION.GET_ALL_NUTRITION);
        setNutrition(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNutrition();
  }, []);

  return { nutrition, loading };
};

export default useNutrition;