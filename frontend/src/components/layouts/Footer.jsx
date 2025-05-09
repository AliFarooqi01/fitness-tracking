import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Heart , Dumbbell } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Facebook size={20} />, url: "#", name: "Facebook" },
    { icon: <Instagram size={20} />, url: "#", name: "Instagram" },
    { icon: <Linkedin size={20} />, url: "#", name: "LinkedIn" }
  ];



  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex items-center justify-center gap-1">
          {/* App Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Dumbbell className="text-[#22d172]" size={24} />
              <span className="text-xl font-bold text-white">FitTrackPro</span>
            </div>
            <p className="mb-4">
              Your complete fitness companion. Track workouts, monitor progress, and achieve your health goals.
            </p>
            <div className="flex space-x-4 justify-center">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  aria-label={social.name}
                  whileHover={{ y: -3, color: "#22d172" }}
                  className="text-gray-400 hover:text-[#22d172] transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          
        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-700 pt-6 text-center text-sm"
        >
          <div className="flex items-center justify-center gap-1">
            <span>Made with</span>
            <Heart size={16} className="text-red-500" />
            <span>by Ali Farooqi</span>
          </div>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} FitTrackPro. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;