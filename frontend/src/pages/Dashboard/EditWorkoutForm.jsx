import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import WorkoutForm from '../../components/layouts/WorkoutForm';

const EditWorkoutForm = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Workout Entry</h1>
        <WorkoutForm isEdit={true} />
      </div>
    </DashboardLayout>
  );
};

export default EditWorkoutForm;
