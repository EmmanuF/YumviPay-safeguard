
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation, Features, Hero, AppDownload } from '@/components/home';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navigation onGetStarted={() => navigate('/onboarding')} />
      
      <main>
        <Hero onGetStarted={() => navigate('/onboarding')} />
        <Features />
        <AppDownload />
      </main>
      
      <footer className="py-6 px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Global Transfer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
