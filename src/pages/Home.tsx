
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
      <div className="min-h-screen bg-gradient-to-b from-secondary-100 to-secondary-50/80">
        <Navigation onGetStarted={handleGetStarted} />
        
        <div className="container mx-auto px-4 pb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-2 md:mt-6"
          >
            <Hero onGetStarted={handleGetStarted} />
            <Features />
            <HowItWorks />
            <CountryCoverage />
            <Testimonials />
            <AppDownload />
            <CTASection />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
