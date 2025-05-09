import React, { useState } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';


const Header = ({ onMenuToggle }) => {
    const { user } = useContext(UserContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left section - Logo and Menu toggle */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuToggle}


                            className="mr-4 p-1 rounded-md text-gray-700 hover:text-[#22d172] focus:outline-none lg:hidden"
                        >
                            <Menu size={24} />
                        </button>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center cursor-pointer"
                            onClick={() => navigate('/dashboard')}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#22d172] to-[#3b82f6] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">FT</span>
                            </div>
                            <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">
                                <span className="text-[#22d172]">Fit</span>Track
                            </span>
                        </motion.div>
                    </div>

                    {/* Center section - Search bar */}
                    <div className="flex-1 max-w-xl mx-4">
                        {isSearchOpen ? (
                            <motion.form
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: '100%' }}
                                exit={{ opacity: 0, width: 0 }}
                                onSubmit={handleSearch}
                                className="flex items-center bg-gray-100 rounded-full px-4 py-2"
                            >
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="mr-2 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={18} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search workouts, nutrition..."
                                    className="bg-transparent border-none focus:ring-0 w-full text-gray-700 placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="ml-2 text-[#22d172] hover:text-[#1db15d]"
                                >
                                    <Search size={18} />
                                </button>
                            </motion.form>
                        ) : (
                            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                                <Search size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search workouts, nutrition..."
                                    className="bg-transparent border-none focus:ring-0 w-full text-gray-700 placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchOpen(true)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right section - Navigation and profile */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="md:hidden p-2 rounded-full text-gray-500 hover:text-[#22d172] hover:bg-gray-100"
                        >
                            <Search size={20} />
                        </button>

                        <button className="p-2 rounded-full text-gray-500 hover:text-[#22d172] hover:bg-gray-100 relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="relative group">
                            <button className="flex items-center space-x-1 focus:outline-none">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#22d172] to-[#3b82f6] flex items-center justify-center text-white font-medium">
                                    <User size={18} />
                                </div>
                                <span className="hidden lg:inline-block text-sm font-medium text-gray-700">
                                    {user?.fullName?.split(' ')[0] || 'User'}
                                </span>

                            </button>

                            {/* Profile dropdown */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 hidden group-hover:block">
                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" >Your Profile</a>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        navigate("/login");
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Sign out
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;