
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ArrowRight, Star } from 'lucide-react';
import ExchangeRateCalculator from '@/components/ExchangeRateCalculator';

const Home = () => {
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 to-primary-600 text-white">
      {/* Navigation */}
      <nav className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">YUMVI-PAY</h1>
          <span className="ml-2 text-sm">Africa</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">Our Story</a>
          <a href="#" className="hover:underline">Countries</a>
          <a href="#" className="hover:underline">Help</a>
        </div>
        
        <div className="flex items-center">
          <Button className="rounded-full bg-white text-primary-600 hover:bg-gray-100">
            Download app
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 py-12">
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-bold mb-6"
          >
            SEND MONEY WITH LOVE
          </motion.h2>
          
          <div className="mt-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl inline-block">
              <img 
                src="/lovable-uploads/f0109787-0119-45f0-bdb2-b68c1971f54c.png" 
                alt="QR Code for app download" 
                className="w-32 h-32 object-cover"
              />
              <p className="text-lg mt-2 text-white">
                Scan this QR code with your phone to download our app!
              </p>
              <div className="mt-4 flex items-center">
                <span className="mr-2">Excellent</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2">Trustpilot</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Calculator */}
        <div className="flex flex-col">
          <div className="bg-gray-900 text-white p-4 rounded-t-xl">
            <h3 className="text-2xl font-semibold">Exchange Rate</h3>
            <p className="text-xl">1 USD = 602.47 NGN</p>
          </div>
          
          <div className="bg-white rounded-b-xl shadow-xl p-6 text-gray-800">
            <h3 className="text-2xl font-semibold text-center mb-4">Send money to your loved ones</h3>
            <p className="text-center mb-8">
              We make sure more of your money goes to those you love, not to high service fees
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">You send</label>
                <div className="flex">
                  <Input 
                    type="number"
                    defaultValue="100"
                    className="rounded-l-lg flex-grow" 
                  />
                  <div className="flex items-center justify-between border border-l-0 rounded-r-lg px-4 bg-gray-50">
                    <div className="flex items-center">
                      <span className="mr-2">🇺🇸</span>
                      <span>US</span>
                    </div>
                    <ChevronRight className="ml-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">They get</label>
                <div className="flex">
                  <Input 
                    type="number"
                    defaultValue="60250"
                    className="rounded-l-lg flex-grow" 
                  />
                  <div className="flex items-center justify-between border border-l-0 rounded-r-lg px-4 bg-gray-50">
                    <div className="flex items-center">
                      <span className="mr-2">🇳🇬</span>
                      <span>NG</span>
                    </div>
                    <ChevronRight className="ml-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="py-2 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Exchange Rate:</span>
                  <span>1 USD = 602.47 NGN</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfer fees:</span>
                  <span>0.00 USD</span>
                </div>
              </div>
              
              <Button 
                onClick={handleContinue}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                size="lg"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
