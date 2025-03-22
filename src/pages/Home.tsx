
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/home/Navigation';
import Hero from '@/components/home/Hero';
import { Features } from '@/components/home/features';
import HowItWorks from '@/components/home/HowItWorks';
import CountryCoverage from '@/components/home/CountryCoverage';
import Testimonials from '@/components/home/Testimonials';
import AppDownload from '@/components/home/AppDownload';
import CTASection from '@/components/home/CTASection';
import PageTransition from '@/components/PageTransition';
import MobileAppLayout from '@/components/MobileAppLayout';
import { initializeApp } from '@/utils/initializeApp';

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize the app when the Home component mounts
    const init = async () => {
      try {
        await initializeApp();
        console.log('App initialized successfully from Home page');
      } catch (error) {
        console.error('Failed to initialize app from Home page:', error);
      }
    };
    
    init();
  }, []);
  
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
    <MobileAppLayout>
      <PageTransition>
        <div className="min-h-screen">
          {/* Purple header with cleaner styling */}
          <div className="relative overflow-hidden">
            {/* Purple header base layer */}
            <div className="absolute top-0 left-0 right-0 z-20">
              {/* Top solid section */}
              <div className="h-20 bg-primary-600"></div>
              
              {/* Additional bottom layer for smoother transition */}
              <div className="h-4 bg-primary-400 transform origin-top-right"></div>
            </div>
            
            {/* Yellow background section */}
            <div className="bg-gradient-to-b from-[#FFDD33] to-[#FFF176]/80 pt-24 relative z-10">
              <div className="pt-8">
                <Navigation onGetStarted={handleGetStarted} />
                <Hero onGetStarted={handleGetStarted} />
              </div>
            </div>
          </div>
          
          {/* Rest of the sections with neutral/light/purple background */}
          <div className="bg-gradient-to-b from-primary-50 to-white">
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
      </PageTransition>
    </MobileAppLayout>
  );
};

export default Home;
