
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/home/Navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import CountryCoverage from '@/components/home/CountryCoverage';
import Testimonials from '@/components/home/Testimonials';
import AppDownload from '@/components/home/AppDownload';
import CTASection from '@/components/home/CTASection';
import PageTransition from '@/components/PageTransition';

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
        {/* First section with diagonal purple header and yellow background */}
        <div className="relative">
          {/* Diagonal purple header design - with increased z-index and height */}
          <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden z-10">
            <div className="absolute top-0 left-0 right-0 h-20 bg-primary-600"></div>
            <div className="absolute top-0 left-0 right-0 h-32">
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-primary-500 transform skew-y-6 origin-right"></div>
            </div>
          </div>
          
          {/* Yellow background section - with higher z-index and padding to account for header */}
          <div className="bg-gradient-to-b from-[#FFDD33] to-[#FFF176]/80 pt-24 relative z-20">
            <Navigation onGetStarted={handleGetStarted} />
            <Hero onGetStarted={handleGetStarted} />
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
  );
};

export default Home;
