import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Home from "./pages/Dashboard/Home";
import NutritionPage from "./pages/Dashboard/Nutrition";
import AddNutritionForm from "./pages/Dashboard/AddNutritionForm";
import EditNutrition from "./pages/Dashboard/EditNutrition";
import WorkoutPage from "./pages/Dashboard/Workout";
import AddWorkoutForm from "./pages/Dashboard/AddWorkoutForm";
import EditWorkoutForm from "./pages/Dashboard/EditWorkoutForm";
import UserProvider from './context/UserContext';
import Profile from "./pages/Dashboard/Profile";
import StopwatchTimer from "./pages/Dashboard/StopwatchTimer";
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TimerLog from "./pages/Dashboard/TimerLog";
import Welcome from "./pages/Welcome"; // <- Welcome Page Added


const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Welcome Page */}
          <Route path="/" element={
            <PublicRoute>
              <Welcome />
            </PublicRoute>
          } />

          {/* Public Pages */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signUp" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Pages */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/nutrition" element={
            <PrivateRoute>
              <NutritionPage />
            </PrivateRoute>
          } />
          <Route path="/add-nutrition" element={
            <PrivateRoute>
              <AddNutritionForm />
            </PrivateRoute>
          } />
          <Route path="/edit-nutrition/:id" element={
            <PrivateRoute>
              <EditNutrition />
            </PrivateRoute>
          } />
          <Route path="/workout" element={
            <PrivateRoute>
              <WorkoutPage />
            </PrivateRoute>
          } />
          <Route path="/add-workout" element={
            <PrivateRoute>
              <AddWorkoutForm />
            </PrivateRoute>
          } />
          <Route path="/edit-workout/:id" element={
            <PrivateRoute>
              <EditWorkoutForm />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/timer-log" element={
            <PrivateRoute>
              <TimerLog />
            </PrivateRoute>
          } />
          <Route path="/stopwatch-timer" element={
            <PrivateRoute>
              <StopwatchTimer />
            </PrivateRoute>
          } />
         


          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <ToastContainer />
      </Router>
    </UserProvider>
  );
};

export default App;
