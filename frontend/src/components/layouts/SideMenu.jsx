import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Activity,
  Utensils,
  User,
  Clock,
  List,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SideMenu = ({ isOpen, toggleMenu, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Workout', path: '/workout', icon: Activity },
    { name: 'Nutrition', path: '/nutrition', icon: Utensils },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Stopwatch & Timer', path: '/stopwatch-timer', icon: Clock },
    { name: 'Timer Logs', path: '/timer-log', icon: List },
  ];

  // Auto-close on mobile when route changes
  useEffect(() => {
    if (isMobile && isOpen) {
      toggleMenu();
    }
  }, [location.pathname]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuWidth = collapsed ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{
          x: isMobile ? (isOpen ? 0 : -300) : 0,
          width: isMobile ? '18rem' : menuWidth
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed lg:relative z-30 ${menuWidth} min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 flex flex-col transition-all duration-300 shadow-xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold whitespace-nowrap"
            >
              <span className="text-[#22d172]">Fit</span>Track
            </motion.h1>
          )}

          <button
            onClick={isMobile ? toggleMenu : toggleCollapse}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            {isMobile ? (
              <ChevronLeft size={24} />
            ) : collapsed ? (
              <Menu size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                  ? 'bg-[#22d172]/90 text-white'
                  : 'hover:bg-gray-700/50'
                }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer/Logout */}
        <div className="mt-auto pt-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}

            className={`flex items-center w-full px-4 py-3 rounded-lg bg-red-600/90 hover:bg-red-700 transition-colors ${collapsed ? 'justify-center' : ''
              }`}
          >
            <LogOut size={20} />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3"
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
};