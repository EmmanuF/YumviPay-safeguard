
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Download, ChevronDown, TrendingUp } from 'lucide-react';
import { hasCompletedOnboarding, isAuthenticated } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCountries } from '@/hooks/useCountries';

const Index = () => {
  const navigate = useNavigate();
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('NGN');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const { countries } = useCountries();

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
  
  // Calculate exchange rate (mock implementation)
  useEffect(() => {
    const calculateRate = () => {
      // Mock exchange rates (in a real app this would come from an API)
      const rates = {
        'USD-NGN': 1500,
        'USD-KES': 130,
        'USD-GHS': 13,
        'USD-ZAR': 18,
        'GBP-NGN': 1900,
        'EUR-NGN': 1650
      };
      
      const pair = `${sourceCurrency}-${targetCurrency}`;
      const rate = rates[pair] || 1500; // Default to NGN rate if pair not found
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency]);
  
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

  const sourceCurrencies = ['USD', 'GBP', 'EUR'];
  const targetCurrencies = ['NGN', 'KES', 'GHS', 'ZAR'];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation header */}
      <header className="py-4 px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.3 7.91998V13.07C19.3 16.15 17.54 17.47 14.9 17.47H6.10999C5.48999 17.47 4.91999 17.4 4.41999 17.27C4.15999 17.21 3.90999 17.12 3.67999 17.02C2.28999 16.4 1.59998 15.03 1.59998 13.07V7.91998C1.59998 4.83998 3.35999 3.52002 5.99999 3.52002H14.9C17.54 3.52002 19.3 4.83998 19.3 7.91998Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22.3011 10.9001V16.0601C22.3011 19.1401 20.5411 20.4601 17.9011 20.4601H9.11108C8.37108 20.4601 7.70108 20.3501 7.12108 20.1301C5.89108 19.6601 5.08108 18.6101 4.91108 17.0601C5.41108 17.1901 5.98108 17.2601 6.60108 17.2601H15.3911C17.9511 17.2601 19.7911 15.9401 19.7911 12.8601V7.70006C19.7911 6.00006 19.1711 4.81006 18.1611 4.25006C20.4411 4.37006 22.3011 5.70006 22.3011 10.9001Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Yumvi-Pay</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
            <a href="#rates" className="text-gray-600 hover:text-primary-600 transition-colors">Exchange Rates</a>
            <a href="#countries" className="text-gray-600 hover:text-primary-600 transition-colors">Countries</a>
            <a href="#help" className="text-gray-600 hover:text-primary-600 transition-colors">Help</a>
          </nav>
          
          <button className="hidden md:block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full font-medium transition-colors">
            Download App
          </button>
        </div>
      </header>
      
      <main className="flex-1 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left column - Hero content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              <motion.h1 
                variants={itemVariants} 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              >
                Send Money <span className="text-primary-500">With Love</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg text-gray-600 mb-8"
              >
                Transfer money to Africa quickly, safely, and hassle-free. We make sure more of your money goes to those you love.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex space-x-4">
                <Button
                  onClick={() => navigate('/onboarding')}
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
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="bg-primary-900 text-white p-6">
                <h3 className="text-center text-lg">Exchange Rate</h3>
                <p className="text-center text-3xl font-bold mb-0">1 USD = 1500 NGN</p>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-center mb-4">Send money to your loved ones</h3>
                <p className="text-center text-gray-600 text-sm mb-6">
                  We make sure more of your money goes to those you love, not to high service fees
                </p>
                
                {/* Amount sender sends */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <label className="text-sm text-gray-500 mb-1 block">You send</label>
                  <div className="flex">
                    <Input
                      type="text"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="border-0 text-xl font-medium bg-transparent flex-1 focus-visible:ring-0"
                    />
                    <div className="relative">
                      <button
                        className="flex items-center bg-primary-50 rounded-lg px-4 py-2"
                        onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                      >
                        <span className="font-medium">{sourceCurrency}</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </button>
                      
                      {showSourceDropdown && (
                        <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg z-10">
                          {sourceCurrencies.map((currency) => (
                            <button
                              key={currency}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                              onClick={() => {
                                setSourceCurrency(currency);
                                setShowSourceDropdown(false);
                              }}
                            >
                              {currency}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Amount recipient receives */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <label className="text-sm text-gray-500 mb-1 block">They get</label>
                  <div className="flex">
                    <div className="text-xl font-medium flex-1">{receiveAmount}</div>
                    <div className="relative">
                      <button
                        className="flex items-center bg-primary-50 rounded-lg px-4 py-2"
                        onClick={() => setShowTargetDropdown(!showTargetDropdown)}
                      >
                        <span className="font-medium">{targetCurrency}</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </button>
                      
                      {showTargetDropdown && (
                        <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg z-10">
                          {targetCurrencies.map((currency) => (
                            <button
                              key={currency}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                              onClick={() => {
                                setTargetCurrency(currency);
                                setShowTargetDropdown(false);
                              }}
                            >
                              {currency}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Exchange Rate:</span>
                    <span className="font-medium">1 {sourceCurrency} = 1500 {targetCurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer fees:</span>
                    <span className="font-medium">0.00 {sourceCurrency}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => navigate('/send')}
                  className="w-full bg-primary-500 hover:bg-primary-600 py-3 rounded-xl"
                  size="lg"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Features section */}
          <motion.div 
            id="features"
            className="mt-20 grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Exchange Rates</h3>
              <p className="text-gray-600">We offer competitive exchange rates that ensure your money goes further.</p>
            </div>
            
            <div className="glass-effect rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16.01V15.99" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12.01V7.99" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#4CD4A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Simple & Transparent</h3>
              <p className="text-gray-600">Know exactly how much your recipient will get before you send.</p>
            </div>
            
            <div className="glass-effect rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0001 14.8799C13.5501 14.8799 14.8301 13.6199 14.8301 12.0499C14.8301 10.4799 13.5601 9.21997 12.0001 9.21997C10.4401 9.21997 9.17017 10.4799 9.17017 12.0499C9.17017 13.6199 10.4501 14.8799 12.0001 14.8799Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.2802 14.8799C18.1402 15.4599 18.2702 16.0999 18.6602 16.5899L18.7402 16.6799C19.0602 16.9999 19.2402 17.4499 19.2402 17.9199C19.2402 18.3899 19.0602 18.8399 18.7402 19.1599C18.1102 19.7899 17.1202 19.7899 16.4902 19.1599L16.4102 19.0799C16.0302 18.6999 15.3902 18.5599 14.8002 18.6999C14.2302 18.8299 13.7802 19.2999 13.6602 19.8799V20.0199C13.6602 21.0299 12.8402 21.8499 11.8302 21.8499C10.8202 21.8499 9.99021 21.0299 9.99021 20.0199V19.9099C9.87021 19.3099 9.42021 18.8299 8.84021 18.6999C8.26021 18.5599 7.62021 18.6999 7.24021 19.0799L7.16021 19.1599C6.87021 19.4499 6.49021 19.5999 6.08021 19.5999C5.67021 19.5999 5.29021 19.4499 5.00021 19.1599C4.68021 18.8399 4.50021 18.3899 4.50021 17.9199C4.50021 17.4499 4.68021 16.9999 5.00021 16.6799L5.08021 16.5999C5.47021 16.2099 5.59021 15.5699 5.47021 14.9999C5.34021 14.4299 4.87021 13.9799 4.29021 13.8599H4.15021C3.14021 13.8599 2.32021 13.0399 2.32021 12.0299C2.32021 11.0199 3.14021 10.1999 4.15021 10.1999H4.26021C4.86021 10.0699 5.34021 9.61995 5.47021 9.03995C5.59021 8.45995 5.47021 7.81995 5.08021 7.43995L5.00021 7.35995C4.68021 7.03995 4.50021 6.58995 4.50021 6.11995C4.50021 5.64995 4.68021 5.19995 5.00021 4.87995C5.63021 4.24995 6.62021 4.24995 7.25021 4.87995L7.33021 4.95995C7.71021 5.34995 8.35021 5.46995 8.94021 5.34995H9.00021C9.57021 5.21995 10.0202 4.74995 10.1402 4.16995V4.02995C10.1402 3.01995 10.9602 2.19995 11.9702 2.19995C12.9802 2.19995 13.8002 3.01995 13.8002 4.02995V4.13995C13.9202 4.71995 14.3702 5.18995 14.9602 5.30995C15.5502 5.42995 16.1802 5.30995 16.5602 4.91995L16.6402 4.83995C16.9302 4.54995 17.3102 4.39995 17.7202 4.39995C18.1302 4.39995 18.5102 4.54995 18.8002 4.83995C19.1202 5.15995 19.3002 5.60995 19.3002 6.07995C19.3002 6.54995 19.1202 6.99995 18.8002 7.31995L18.7202 7.39995C18.3302 7.78995 18.2102 8.42995 18.3302 9.00995C18.4502 9.57995 18.9202 10.0299 19.5002 10.1499H19.6402C20.6502 10.1499 21.4702 10.9699 21.4702 11.9799C21.4702 12.9899 20.6502 13.8099 19.6402 13.8099H19.5302C18.9602 13.9499 18.4802 14.3999 18.2802 14.8799Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Fast KYC</h3>
              <p className="text-gray-600">Our integrated verification ensures safe and quick transactions.</p>
            </div>
          </motion.div>
          
          {/* QR code section */}
          <motion.div 
            className="mt-20 flex flex-col md:flex-row items-center gap-8 bg-primary-50 rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-4 rounded-xl">
              <svg width="120" height="120" viewBox="0 0 100 100">
                <path d="M0,0 h30v30h-30z M10,10 h10v10h-10z" fill="black" />
                <path d="M40,0 h30v30h-30z M50,10 h10v10h-10z" fill="black" />
                <path d="M0,40 h30v30h-30z M10,50 h10v10h-10z" fill="black" />
                <path d="M40,40 h10v10h-10z" fill="black" />
                <path d="M60,40 h10v10h-10z" fill="black" />
                <path d="M80,40 h20v20h-20z M85,45 h10v10h-10z" fill="black" />
                <path d="M40,60 h10v10h-10z" fill="black" />
                <path d="M60,60 h10v10h-10z" fill="black" />
                <path d="M80,70 h10v10h-10z" fill="black" />
                <path d="M0,80 h30v20h-30z" fill="black" />
                <path d="M40,80 h10v20h-10z" fill="black" />
                <path d="M60,80 h10v20h-10z" fill="black" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Scan this QR code with your phone</h3>
              <p className="text-gray-600 mb-4">Download our app to enjoy a better experience and exclusive features</p>
              <div className="flex space-x-3">
                <Button variant="outline" className="border-primary-200 text-primary-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M16.09 6.62C14.92 7.38 13.43 7.23 12.38 6.31C11.42 5.47 11.13 4.06 11.72 2.95C12.96 2.69 14.47 3.38 15.32 4.26C16.08 5.03 16.35 6.05 16.09 6.62Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.85 10.56C20.06 13.13 18.01 15.37 15.58 15.37H14.49V17.34C14.49 19.63 12.64 21.48 10.35 21.48C8.06 21.48 6.21 19.63 6.21 17.34V15.37H5.12C2.7 15.37 0.65 13.14 0.85 10.56C1.01 8.47 2.77 6.76 4.84 6.55C5.68 6.47 6.52 6.61 7.28 6.93C7.15 6.47 7.07 5.98 7.07 5.47C7.07 3.26 8.78 1.39 10.97 1.19C13.54 0.95 15.7 2.89 15.7 5.41C15.7 5.94 15.62 6.46 15.48 6.94C16.26 6.61 17.11 6.46 17.97 6.55C20.04 6.75 21.8 8.47 21.95 10.56H19.85Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22.97 13.03V14.05C22.97 14.61 22.52 15.07 21.95 15.07H20.87V13.03H22.97Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.14 13.03V14.05C1.14 14.61 1.6 15.07 2.16 15.07H3.24V13.03H1.14Z" stroke="#5B3CC4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  App Store
                </Button>
                <Button variant="outline" className="border-primary-200 text-primary-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M11.99 21.9999C14.43 21.9999 16.76 21.0999 18.52 19.4799C22.25 16.2199 22.25 10.9699 18.52 7.7199C16.76 6.0999 14.43 5.19995 11.99 5.19995C9.55 5.19995 7.22 6.0999 5.46 7.7199C1.73 10.9699 1.73 16.2199 5.46 19.4799C7.22 21.0999 9.54 21.9999 11.99 21.9999Z" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5.2V2" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 2H15" stroke="#5B3CC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Play Store
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
