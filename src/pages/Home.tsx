
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/home/navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/features/Features';
import HowItWorks from '@/components/home/HowItWorks';
import CountryCoverage from '@/components/home/CountryCoverage';
import { Testimonials } from '@/components/home/testimonials';
import AppDownload from '@/components/home/AppDownload';
import CTASection from '@/components/home/CTASection';
import PageTransition from '@/components/PageTransition';
import DebugTools from '@/components/home/DebugTools';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Home = () => {
  const navigate = useNavigate();
  const featuresRef = useScrollAnimation();
  const howItWorksRef = useScrollAnimation();
  const countryCoverageRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();
  const appDownloadRef = useScrollAnimation({ threshold: 0.1 });
  const ctaSectionRef = useScrollAnimation({ threshold: 0.1 });
  
  // Add scroll animation to each section
  useEffect(() => {
    // Initialize scroll observer for elements with the animate-on-scroll class
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    
    // Get all elements with the animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
    // Get all staggered child animations
    const staggeredElements = document.querySelectorAll('.stagger-children');
    staggeredElements.forEach(el => observer.observe(el));
    
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
      staggeredElements.forEach(el => observer.unobserve(el));
    };
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
          
          {/* Hero background section with improved positioning */}
          <div className="pt-16 relative z-10 hero-bg">
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
              <div ref={featuresRef} className="animate-on-scroll">
                <Features />
              </div>
              
              <div ref={howItWorksRef} className="animate-on-scroll">
                <HowItWorks />
              </div>
              
              <div ref={countryCoverageRef} className="animate-on-scroll">
                <CountryCoverage />
              </div>
              
              <div ref={testimonialsRef} className="animate-on-scroll">
                <Testimonials />
              </div>
              
              <div ref={appDownloadRef} className="animate-on-scroll">
                <AppDownload />
              </div>
              
              <div ref={ctaSectionRef} className="animate-on-scroll">
                <CTASection />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Added a gradient transition to the footer */}
        <div className="h-16 bg-gradient-to-b from-muted/20 via-indigo-50/30 to-indigo-100/40"></div>
      </div>
      
      {/* Add debug tools */}
      <DebugTools />
    </PageTransition>
  );
};

export default Home;
