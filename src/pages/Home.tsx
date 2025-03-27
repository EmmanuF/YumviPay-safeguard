
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/home/Navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/features/Features';
import HowItWorks from '@/components/home/HowItWorks';
import CountryCoverage from '@/components/home/CountryCoverage';
import Testimonials from '@/components/home/Testimonials';
import AppDownload from '@/components/home/AppDownload';
import CTASection from '@/components/home/CTASection';
import PageTransition from '@/components/PageTransition';
import DebugTools from '@/components/home/DebugTools';

const Home = () => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const handleGetStarted = () => {
    navigate('/signup');
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Indigo header with cleaner styling */}
        <div className="relative overflow-hidden">
          {/* Indigo header base layer */}
          <div className="absolute top-0 left-0 right-0 z-20">
            {/* Top solid section */}
            <div className="h-20 bg-indigo-600"></div>
            
            {/* Additional bottom layer for smoother transition */}
            <div className="h-4 bg-indigo-500 transform origin-top-right"></div>
          </div>
          
          {/* Premium background section with hero */}
          <div className="relative bg-gradient-to-b from-muted to-white pt-16 z-10 min-h-[90vh] overflow-hidden">
            <div className="pt-6">
              <Navigation onGetStarted={handleGetStarted} />
              <Hero onGetStarted={handleGetStarted} />
            </div>
            
            {/* Curved separator */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
              <svg 
                className="absolute bottom-0 w-full h-auto" 
                viewBox="0 0 1440 110" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M0 110L48 101.7C96 93.3 192 76.7 288 64.2C384 51.7 480 43.3 576 53.2C672 63 768 91 864 96.8C960 102.7 1056 85.3 1152 73.7C1248 62 1344 56 1392 53L1440 50V110H1392C1344 110 1248 110 1152 110C1056 110 960 110 864 110C768 110 672 110 576 110C480 110 384 110 288 110C192 110 96 110 48 110H0Z" 
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Rest of the sections with neutral/light background */}
        <div className="bg-gradient-to-b from-white to-muted/50">
          <div className="container mx-auto px-4 pb-24">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-2 md:mt-6"
            >
              <Features />
              <HowItWorks />
              <CountryCoverage />
              <Testimonials />
              <AppDownload />
              <CTASection />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Add debug tools */}
      <DebugTools />
    </PageTransition>
  );
};

export default Home;
