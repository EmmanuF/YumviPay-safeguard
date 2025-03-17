
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download, SendHorizonal, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExchangeRateCalculator from '@/components/ExchangeRateCalculator';

interface HeroProps {
  onGetStarted?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted(); // Use the provided callback if available
    } else {
      navigate('/onboarding'); // Direct navigation otherwise
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left column - Hero content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          <motion.div variants={itemVariants} className="relative mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">Transfer</span>
              <span className="relative inline-block">
                <span className="relative z-10">Without</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 z-0" viewBox="0 0 100 15" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,5 Q25,0 50,5 Q75,10 100,5 L100,15 L0,15 Z" fill="#4CD4A9" />
                </svg>
              </span>
              <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#FFDD33] to-[#FFC107]">Boundaries</span>
            </h1>
            
            <div className="absolute -top-5 -right-5 text-primary-100 rotate-12 opacity-30">
              <Coins size={64} />
            </div>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-600 mb-8"
          >
            Transfer money to Africa quickly, safely, and hassle-free. We make sure more of your money goes to those you love.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex space-x-4">
            <Button
              onClick={handleGetStarted}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-all duration-300 text-base"
              size="lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              className="border-primary-200 text-primary-700 hover:bg-primary-50"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download App
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-12 flex items-center">
            <div className="flex">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img 
                src="https://randomuser.me/api/portraits/men/86.jpg" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              />
              <img 
                src="https://randomuser.me/api/portraits/women/24.jpg" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white -ml-2"
              />
            </div>
            <div className="ml-3">
              <div className="text-sm text-gray-500">Trusted by</div>
              <div className="text-sm font-semibold">10K+ users globally</div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Right column - Calculator */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ExchangeRateCalculator />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
