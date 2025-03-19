import React from 'react';
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
        <div className="min-h-screen bg-background">
          {/* Updated dark header with neon accents */}
          <div className="relative overflow-hidden">
            {/* Dark header base layer */}
            <div className="absolute top-0 left-0 right-0 z-20">
              {/* Top solid section - Jet Black */}
              <div className="h-20 bg-primary-500"></div>
              
              {/* Additional bottom layer for smoother transition */}
              <div className="h-4 bg-primary-400 transform origin-top-right"></div>
            </div>
            
            {/* Updated hero background section to dark gray */}
            <div className="bg-[#1C1C1C] pt-24 relative z-10">
              <div className="pt-8">
                <Navigation onGetStarted={handleGetStarted} />
                <Hero onGetStarted={handleGetStarted} />
              </div>
            </div>
          </div>
          
          {/* Rest of the sections with dark theme background */}
          <div className="bg-gradient-to-b from-[#1C1C1C] to-background">
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
