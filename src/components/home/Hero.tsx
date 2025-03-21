
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroContent } from './hero';
import { HeroCalculator } from './hero';

interface HeroProps {
  onGetStarted?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted(); // Use the provided callback if available
    } else {
      navigate('/onboarding'); // Direct navigation otherwise
    }
  };

  const handleSendMoney = () => {
    navigate('/send');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left column - Hero content */}
        <HeroContent onGetStarted={handleGetStarted} onSendMoney={handleSendMoney} />
        
        {/* Right column - Calculator with enhanced glass morphism */}
        <HeroCalculator />
      </div>
    </div>
  );
};

export default Hero;
