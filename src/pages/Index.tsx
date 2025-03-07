
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/home/Navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import AppDownload from '@/components/home/AppDownload';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation header */}
      <Navigation />
      
      <main className="flex-1 bg-gradient-to-b from-primary-50 to-white">
        {/* Hero section with calculator */}
        <Hero />
        
        {/* Features section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Features />
          
          {/* QR code section */}
          <AppDownload />
        </div>
      </main>
    </div>
  );
};

export default Index;
