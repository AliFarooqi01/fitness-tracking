import React, { useState } from 'react'; 
import { SideMenu } from './SideMenu';
import { Menu } from 'lucide-react';
import Header from './Header';
import FeedbackTrigger from './FeedbackTrigger';
import useMediaQuery from '../../hooks/useMediaQuery';
import Footer from './Footer';


// In your DashboardLayout.jsx
const DashboardLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu 
        isOpen={isMenuOpen} 
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isMobile={isMobile}
      />
      
      <div className="flex-1 overflow-x-hidden">
        {/* Add a menu toggle button in your header */}
        <Header onMenuToggle={() => setIsMenuOpen(true)} />

        
        <main className="p-4 lg:p-6">
          {children}
        </main>
        <FeedbackTrigger />
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;



