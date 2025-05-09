import React, { useState } from 'react';
import axios from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { showSuccess, showError } from '../../utils/messages';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, MessageSquare, Send, AlertCircle } from 'lucide-react';

const FeedbackForm = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    inquiry: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(API_PATHS.FEEDBACK.SUBMIT_FEEDBACK, form);
      showSuccess("Thank you for your feedback!");
      setForm({ name: '', email: '', inquiry: '', message: '' });
      onClose();
    } catch (err) {
      showError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden max-h-[90vh] flex flex-col"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#22d172] to-[#3b82f6] p-5 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare size={20} />
                  Share Your Feedback
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm opacity-90 mt-1">
                We'd love to hear your thoughts about our app
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-4 overflow-y-auto flex-1"
            >
              {/* Name Field */}
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <User size={16} className="text-gray-500" />
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail size={16} className="text-gray-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Subject Field */}
              <div className="space-y-1">
                <label htmlFor="inquiry" className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="inquiry"
                  name="inquiry"
                  value={form.inquiry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all bg-white"
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="General Feedback">General Feedback</option>
                  <option value="Account Help">Account Help</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message Field */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22d172] focus:border-transparent transition-all"
                  placeholder="Tell us what's on your mind..."
                  rows={4}
                />
              </div>

              {/* Footer */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#22d172] to-[#3b82f6] hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Feedback
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-3 flex items-start gap-1">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  Your feedback helps us improve the app. We read every submission.
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackForm;
