import React from 'react';
import { motion } from 'framer-motion';


const DeleteFoodItemModal = ({ visible, onClose, onConfirm, foodItems, selected, setSelected }) => {
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
                <h2 className="text-xl font-bold mb-4 text-red-600">Delete Food Item</h2>
                <p className="mb-2">Select a food item to delete from this meal:</p>

                <select
                    className="border p-2 w-full rounded mb-4"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                >
                    {foodItems.map(item => (
                        <option key={item._id} value={item._id}>
                            {item.name} ({item.quantity})
                        </option>
                    ))}
                </select>

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
