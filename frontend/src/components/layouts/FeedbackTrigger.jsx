import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center justify-center rounded-full p-4 shadow-xl transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
              : 'bg-gradient-to-br from-[#22d172] to-[#3b82f6] text-white'
          }`}
          title={isOpen ? 'Close feedback' : 'Give feedback'}
          aria-label={isOpen ? 'Close feedback form' : 'Open feedback form'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? [-5, 5, -5] : 0
                }}
                transition={{ 
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                <MessageSquare size={24} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {isHovered && !isOpen && (
            <motion.span 
              className="absolute right-full mr-3 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              Give Feedback
            </motion.span>
          )}
        </button>
      </motion.div>

      <FeedbackForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FeedbackTrigger;