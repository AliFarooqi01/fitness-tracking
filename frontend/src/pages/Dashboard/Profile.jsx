import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { UserContext } from '../../context/UserContext';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { showSuccess, showError } from '../../utils/messages';
import { useNavigate } from 'react-router-dom';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import uploadImage from '../../utils/uploadImage';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Home, Save, Lock } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
      setProfileImageUrl(user.profileImageUrl || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      let uploadedImageUrl = profileImageUrl;

      if (profilePic) {
        const imgRes = await uploadImage(profilePic);
        uploadedImageUrl = imgRes.imageUrl;
      }

      const res = await axios.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        ...form,
        profileImageUrl: uploadedImageUrl,
      });

      updateUser(res.data.user);
      showSuccess("Profile updated successfully!");
    } catch (err) {
      showError("Failed to update profile.");
    }

    setIsLoading(false);
  };
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen bg-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#22d172] border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
       
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#22d172] to-[#3b82f6] p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User size={24} />
              <span>Edit Profile</span>
            </h1>
            <p className="text-white/90 mt-1">
              Update your personal information
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="mb-4"
              >
                <ProfilePhotoSelector 
                  image={profilePic || profileImageUrl} 
                  setImage={setProfilePic}
                  size="xl"
                />
              </motion.div>
              <p className="text-sm text-gray-500">
                Click to change profile photo
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={18} />
                  </div>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-gray-400" size={18} />
                  </div>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="text-gray-400" size={18} />
                  </div>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                    placeholder="123 Main St, City, Country"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6">
              <motion.button
                type="button"
                onClick={() => navigate("/forgot-password")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 text-gray-600 hover:text-[#3b82f6] transition-colors text-sm"
              >
                <Lock size={16} />
                <span>Forgot or Reset Password?</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg text-white ${isLoading ? 'bg-gray-400' : 'bg-[#22d172] hover:bg-[#1db863]'} transition-colors flex items-center gap-2`}
              >
                <Save size={18} />
                <span>{isLoading ? "Saving..." : "Save Changes"}</span>
              </motion.button>
            </div>
          </div>
        
      </div>
    </DashboardLayout>
  );
};

export default Profile;