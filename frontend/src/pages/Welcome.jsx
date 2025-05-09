import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, HeartPulse, Apple, TrendingUp, ArrowRight } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Dumbbell className="text-[#22d172]" size={24} />,
      title: "Workout Tracking",
      description: "Log your exercises and track progress"
    },
    {
      icon: <HeartPulse className="text-[#22d172]" size={24} />,
      title: "Health Metrics",
      description: "Monitor your fitness journey"
    },
    {
      icon: <Apple className="text-[#22d172]" size={24} />,
      title: "Nutrition Plans",
      description: "Track meals and macros"
    },
    {
      icon: <TrendingUp className="text-[#22d172]" size={24} />,
      title: "Progress Analytics",
      description: "Visualize your improvements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-[#22d172]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="text-[#22d172]" size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Transform Your <span className="text-[#22d172]">Fitness</span> Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            The all-in-one platform to track workouts, nutrition, and health metrics. 
            Achieve your goals with personalized insights and analytics.
          </p>
        </motion.div>

        <motion.button
          onClick={() => navigate('/login')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#22d172] to-[#3b82f6] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <span className="font-semibold text-lg">Get Started Now</span>
          <ArrowRight size={20} />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16"
        >
          <div className="inline-flex items-center justify-center w-full">
            <hr className="w-64 h-px my-8 bg-gray-700 border-0" />
            <span className="absolute px-3 font-medium text-gray-400 -translate-x-1/2 bg-gray-900 left-1/2">
              WHY CHOOSE US
            </span>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800/50 py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-[#22d172]/30 transition-all"
              >
                <div className="w-12 h-12 bg-[#22d172]/10 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-[#22d172]/10 to-[#3b82f6]/10">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Transform Your Fitness?
          </motion.h2>
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-900 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            Join Now - It's Free
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;