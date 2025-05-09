import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";

import userRoutes from "./routes/userRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import timerRoutes from "./routes/timerRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
const app = express();

// Allowed origins for CORS


// Middleware
app.use(
  cors({
    origin: "https://fitness-tracking-o7uw.vercel.app", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/timer", timerRoutes);
app.use("/api/feedback", feedbackRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Export as serverless function
export const handler = serverless(app);
