
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { hasCompletedOnboarding, isAuthenticated } from '@/services/auth';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = await isAuthenticated();
      const onboardingCompleted = await hasCompletedOnboarding();
      
      if (authenticated) {
        navigate('/dashboard');
      } else if (onboardingCompleted) {
        // User has completed onboarding but is not logged in
        // Could show login page here
      }
    };
    
    checkAuthStatus();
  }, [navigate]);
  
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
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white">
      <div className="flex-1 flex flex-col justify-between px-4 py-8 max-w-md mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.3 7.91998V13.07C19.3 16.15 17.54 17.47 14.9 17.47H6.10999C5.48999 17.47 4.91999 17.4 4.41999 17.27C4.15999 17.21 3.90999 17.12 3.67999 17.02C2.28999 16.4 1.59998 15.03 1.59998 13.07V7.91998C1.59998 4.83998 3.35999 3.52002 5.99999 3.52002H14.9C17.54 3.52002 19.3 4.83998 19.3 7.91998Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22.3011 10.9001V16.0601C22.3011 19.1401 20.5411 20.4601 17.9011 20.4601H9.11108C8.37108 20.4601 7.70108 20.3501 7.12108 20.1301C5.89108 19.6601 5.08108 18.6101 4.91108 17.0601C5.41108 17.1901 5.98108 17.2601 6.60108 17.2601H15.3911C17.9511 17.2601 19.7911 15.9401 19.7911 12.8601V7.70006C19.7911 6.00006 19.1711 4.81006 18.1611 4.25006C20.4411 4.37006 22.3011 5.70006 22.3011 10.9001Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.4984 13.1399C12.0312 13.1399 13.2784 11.8927 13.2784 10.3599C13.2784 8.82703 12.0312 7.57983 10.4984 7.57983C8.96558 7.57983 7.71838 8.82703 7.71838 10.3599C7.71838 11.8927 8.96558 13.1399 10.4984 13.1399Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.78027 8.29999V12.42" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.2217 8.30029V12.4203" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Yumvi-Pay</h1>
            <p className="text-gray-600 text-balance">Send money to Africa quickly, safely, and hassle-free</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-8 w-full">
            <div className="glass-effect rounded-2xl p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16.01V15.99" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12.01V7.99" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Simple &amp; Transparent</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Know exactly how much your recipient will get before you send.</p>
            </div>
            
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.0001 14.8799C13.5501 14.8799 14.8301 13.6199 14.8301 12.0499C14.8301 10.4799 13.5601 9.21997 12.0001 9.21997C10.4401 9.21997 9.17017 10.4799 9.17017 12.0499C9.17017 13.6199 10.4501 14.8799 12.0001 14.8799Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.2802 14.8799C18.1402 15.4599 18.2702 16.0999 18.6602 16.5899L18.7402 16.6799C19.0602 16.9999 19.2402 17.4499 19.2402 17.9199C19.2402 18.3899 19.0602 18.8399 18.7402 19.1599C18.1102 19.7899 17.1202 19.7899 16.4902 19.1599L16.4102 19.0799C16.0302 18.6999 15.3902 18.5599 14.8002 18.6999C14.2302 18.8299 13.7802 19.2999 13.6602 19.8799V20.0199C13.6602 21.0299 12.8402 21.8499 11.8302 21.8499C10.8202 21.8499 9.99021 21.0299 9.99021 20.0199V19.9099C9.87021 19.3099 9.42021 18.8299 8.84021 18.6999C8.26021 18.5599 7.62021 18.6999 7.24021 19.0799L7.16021 19.1599C6.87021 19.4499 6.49021 19.5999 6.08021 19.5999C5.67021 19.5999 5.29021 19.4499 5.00021 19.1599C4.68021 18.8399 4.50021 18.3899 4.50021 17.9199C4.50021 17.4499 4.68021 16.9999 5.00021 16.6799L5.08021 16.5999C5.47021 16.2099 5.59021 15.5699 5.47021 14.9999C5.34021 14.4299 4.87021 13.9799 4.29021 13.8599H4.15021C3.14021 13.8599 2.32021 13.0399 2.32021 12.0299C2.32021 11.0199 3.14021 10.1999 4.15021 10.1999H4.26021C4.86021 10.0699 5.34021 9.61995 5.47021 9.03995C5.59021 8.45995 5.47021 7.81995 5.08021 7.43995L5.00021 7.35995C4.68021 7.03995 4.50021 6.58995 4.50021 6.11995C4.50021 5.64995 4.68021 5.19995 5.00021 4.87995C5.63021 4.24995 6.62021 4.24995 7.25021 4.87995L7.33021 4.95995C7.71021 5.34995 8.35021 5.46995 8.94021 5.34995H9.00021C9.57021 5.21995 10.0202 4.74995 10.1402 4.16995V4.02995C10.1402 3.01995 10.9602 2.19995 11.9702 2.19995C12.9802 2.19995 13.8002 3.01995 13.8002 4.02995V4.13995C13.9202 4.71995 14.3702 5.18995 14.9602 5.30995C15.5502 5.42995 16.1802 5.30995 16.5602 4.91995L16.6402 4.83995C16.9302 4.54995 17.3102 4.39995 17.7202 4.39995C18.1302 4.39995 18.5102 4.54995 18.8002 4.83995C19.1202 5.15995 19.3002 5.60995 19.3002 6.07995C19.3002 6.54995 19.1202 6.99995 18.8002 7.31995L18.7202 7.39995C18.3302 7.78995 18.2102 8.42995 18.3302 9.00995C18.4502 9.57995 18.9202 10.0299 19.5002 10.1499H19.6402C20.6502 10.1499 21.4702 10.9699 21.4702 11.9799C21.4702 12.9899 20.6502 13.8099 19.6402 13.8099H19.5302C18.9602 13.9499 18.4802 14.3999 18.2802 14.8799Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Secure KYC</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Integrated with Kado for secure and quick verification.</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="w-full"
        >
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 rounded-xl transition-all duration-300 flex items-center justify-center"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
