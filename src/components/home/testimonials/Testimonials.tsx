
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInterval } from '@/hooks/useInterval';
import { testimonials } from './testimonialData';
import TestimonialCarousel from './TestimonialCarousel';
import DesktopTestimonials from './DesktopTestimonials';
import { TestimonialsProps } from './types';

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials: customTestimonials }) => {
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const testimonialsData = customTestimonials || testimonials;

  // Pause autoplay when user interacts with carousel
  const pauseAutoplay = () => {
    setAutoplay(false);
    // Resume autoplay after 5 seconds of inactivity
    setTimeout(() => setAutoplay(true), 5000);
  };

  // Set up autoplay interval
  useInterval(() => {
    if (autoplay) {
      setCurrentSlide((prev) => (prev + 1) % testimonialsData.length);
    }
  }, 5000);

  return (
    <motion.div 
      className="py-20 bg-gradient-to-b from-secondary-50 to-secondary-100/70 rounded-3xl my-24 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Thousands of people trust Yumvi-Pay to send money to their loved ones every day
            </p>
          </motion.div>
        </div>
        
        {/* Mobile vs Desktop View */}
        {isMobile ? (
          <TestimonialCarousel 
            testimonials={testimonialsData}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            autoplay={autoplay}
            pauseAutoplay={pauseAutoplay}
          />
        ) : (
          <DesktopTestimonials testimonials={testimonialsData} />
        )}
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-primary-600 font-medium">Join thousands of satisfied customers using Yumvi-Pay today!</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Testimonials;
