require("dotenv").config();
const express =  require("express");
const cors  = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const nutritionRoutes = require('./routes/nutrition');
const workoutRoutes = require('./routes/workout');
const nutritionixRoutes = require("./routes/nutritionixRoutes");
const timerLogRoutes = require("./routes/timerLog");
const feedbackRoutes = require('./routes/feedback');





const app = express();

// middleware to handle CORS

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET" , "POST" , "PUT" , "DELETE"],
        allowedHeaders: ["Content-Type" , "Authorization"],
    })
);


app.use(express.json());

connectDB();

app.use("/api/v1/auth" , authRoutes);
app.use('/api/v1/nutrition', nutritionRoutes);
app.use('/api/v1/workout', workoutRoutes);
app.use("/api/nutritionix", nutritionixRoutes);
app.use("/api/v1/timerlog", timerLogRoutes);
app.use('/api/v1/feedback', feedbackRoutes);


// Server uploads Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const PORT = process.env.PORT || 5000;
app.listen(PORT , () => console.log((`Server is running on port ${PORT}`)));