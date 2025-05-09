import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { showSuccess, showError } from '../../utils/messages';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      showSuccess("Password reset link sent to your email.");
    } catch (error) {
      showError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <button type="submit" className="btn-primary mt-4">
            Send Reset Link
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
