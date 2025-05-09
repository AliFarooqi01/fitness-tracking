import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { showSuccess, showError } from '../../utils/messages';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${API_PATHS.AUTH.RESET_PASSWORD}/${token}`, { password });
      showSuccess("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Create New Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="New Password"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            placeholder="Confirm Password"
          />
          <button type="submit" className="btn-primary mt-4">
            Save New Password
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
