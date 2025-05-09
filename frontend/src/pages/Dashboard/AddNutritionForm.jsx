import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import NutritionForm from '../../components/layouts/NutritionForm';

const AddNutritionForm = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Add Nutrition Entry</h1>
        <NutritionForm isEdit={false} />

      </div>
    </DashboardLayout>
  );
};

export default AddNutritionForm;
