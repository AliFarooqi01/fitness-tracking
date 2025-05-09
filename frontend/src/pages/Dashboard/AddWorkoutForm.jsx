import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import WorkoutForm from '../../components/layouts/WorkoutForm';

const AddWorkoutForm = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Add Workout Entry</h1>
        <WorkoutForm />
      </div>
    </DashboardLayout>
  );
};

export default AddWorkoutForm;
