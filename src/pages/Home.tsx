
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
import MobileAppLayout from '@/components/MobileAppLayout';
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
    <MobileAppLayout>
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
            
            {/* Light background section instead of yellow */}
            <div className="bg-gradient-to-b from-muted to-white pt-16 relative z-10 hero-bg">
              <div className="pt-6">
                <Navigation onGetStarted={handleGetStarted} />
                <Hero onGetStarted={handleGetStarted} />
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
      </PageTransition>
      
      {/* Add debug tools */}
      <DebugTools />
    </MobileAppLayout>
  );
};

export default Home;
