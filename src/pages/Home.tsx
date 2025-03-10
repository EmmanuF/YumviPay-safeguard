import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight, Star } from 'lucide-react';
import ExchangeRateCalculator from '@/components/ExchangeRateCalculator';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const handleContinue = () => {
    if (isLoggedIn) {
      navigate('/send');
    } else {
      navigate('/onboarding');
    }
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
          {isLoggedIn ? (
            <Button 
              className="rounded-full bg-white text-primary-600 hover:bg-gray-100"
              onClick={() => navigate('/profile')}
            >
              My Account
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <div className="space-x-2">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/signin')}
              >
                Sign In
              </Button>
              <Button 
                className="rounded-full bg-white text-primary-600 hover:bg-gray-100"
                onClick={() => navigate('/signup')}
              >
                Sign Up
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
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
          <ExchangeRateCalculator 
            onContinue={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
