const express = require("express");
const router = express.Router();
const axios = require("axios");

// ✅ Use environment variables
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY;

router.get("/", async (req, res) => {
  const { food, quantity = 1 } = req.query;

  try {
    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      {
        query: `${quantity} ${food}`,
      },
      {
        headers: {
          "x-app-id": NUTRITIONIX_APP_ID,
          "x-app-key": NUTRITIONIX_APP_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const foodData = response.data.foods[0];

    const nutritionData = {
      name: foodData.food_name,
      calories: foodData.nf_calories,
      protein: foodData.nf_protein,
      carbs: foodData.nf_total_carbohydrate,
      fats: foodData.nf_total_fat,
    };

    res.json(nutritionData);
  } catch (err) {
    console.error("Nutritionix fetch error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch nutrition data" });
  }
});

module.exports = router;
