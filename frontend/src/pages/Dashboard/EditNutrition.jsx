import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import NutritionForm from '../../components/layouts/NutritionForm';

const EditNutrition = () => {
  const { id } = useParams(); // nutritionId from route param

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Nutrition Entry</h1>
        <NutritionForm isEdit={true} id={id} />
      </div>
    </DashboardLayout>
  );
};

export default EditNutrition;
