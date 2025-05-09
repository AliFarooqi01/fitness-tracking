import React from 'react';
import { motion } from 'framer-motion';


const DeleteFoodItemModal = ({ visible, onClose, onConfirm, title, message }) => {
    if (!visible) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black/30 flex justify-center items-start pt-28 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <div className="bg-white rounded-md p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-red-600">{title}</h2>
                <p className="mb-2">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>

        </motion.div>
    );
};

export default DeleteFoodItemModal;
