
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/home/navigation';
import Hero from '@/components/home/Hero';
import PageTransition from '@/components/PageTransition';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import SEO from '@/components/seo/SEO';
import { 
  LazyFeatures, 
  LazyHowItWorks,
  LazyCountryCoverage,
  LazyTestimonials,
  LazyAppDownload,
  LazyCTASection
} from '@/components/home/LazyLoadedComponents';

const Home = () => {
  const navigate = useNavigate();
  const featuresRef = useScrollAnimation();
  const howItWorksRef = useScrollAnimation();
  const countryCoverageRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();
  const appDownloadRef = useScrollAnimation({ threshold: 0.1 });
  const ctaSectionRef = useScrollAnimation({ threshold: 0.1 });
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
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
      <SEO 
        title="Send Money to Africa Fast & Secure | Yumvi-Pay"
        description="Send money to Africa with Yumvi-Pay. Low fees, fast transfers, and reliable service. Available for iOS and Android."
        keywords="money transfer, send money to Africa, mobile payments, remittance, Cameroon, mobile money, transfer app"
      />
      <div className="min-h-screen">
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="h-20 bg-indigo-600"></div>
            <div className="h-4 bg-indigo-500 transform origin-top-right"></div>
          </div>
          <div className="pt-16 relative z-10 hero-bg">
            <div className="pt-6">
              <Navigation onGetStarted={handleGetStarted} />
              <Hero onGetStarted={handleGetStarted} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-b from-white to-muted/50">
          <div className="container mx-auto px-4 pb-24">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-2 md:mt-6"
            >
              <div ref={featuresRef} className="animate-on-scroll">
                <LazyFeatures />
              </div>
              <div ref={howItWorksRef} className="animate-on-scroll">
                <LazyHowItWorks />
              </div>
              <div ref={countryCoverageRef} className="animate-on-scroll">
                <LazyCountryCoverage />
              </div>
              <div ref={testimonialsRef} className="animate-on-scroll">
                <LazyTestimonials />
              </div>
              <div ref={appDownloadRef} className="animate-on-scroll">
                <LazyAppDownload />
              </div>
              <div ref={ctaSectionRef} className="animate-on-scroll">
                <LazyCTASection />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-b from-muted/20 via-indigo-50/30 to-indigo-100/40"></div>
      </div>
    </PageTransition>
  );
};

export default Home;
