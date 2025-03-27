
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInterval } from '@/hooks/useInterval';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const testimonials = [
    {
      id: 1,
      name: "John D.",
      location: "USA to Ghana",
      avatar: "/lovable-uploads/f0109787-0119-45f0-bdb2-b68c1971f54c.png",
      rating: 5,
      text: "Yumvi-Pay made sending money to my family in Ghana so simple! The rates are excellent and the transfer was completed within hours."
    },
    {
      id: 2,
      name: "Marie L.",
      location: "Canada to Cameroon",
      avatar: null,
      rating: 5,
      text: "I've tried several transfer services, but Yumvi-Pay offers the best rates and fastest delivery to Cameroon. Highly recommended!"
    },
    {
      id: 3,
      name: "Samuel K.",
      location: "UK to Nigeria",
      avatar: null,
      rating: 4,
      text: "Very easy to use, transparent fees, and excellent customer service. The mobile app makes everything so convenient."
    }
  ];

  // Pause autoplay when user interacts with carousel
  const pauseAutoplay = () => {
    setAutoplay(false);
    // Resume autoplay after 5 seconds of inactivity
    setTimeout(() => setAutoplay(true), 5000);
  };

  // Set up autoplay interval
  useInterval(() => {
    if (autoplay) {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }
  }, 5000);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

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
        
        {/* Mobile Carousel View */}
        {isMobile ? (
          <div className="px-4 mobile-optimized">
            <Carousel 
              className="w-full"
              onMouseEnter={pauseAutoplay}
              onTouchStart={pauseAutoplay}
              setApi={(api) => {
                if (api && currentSlide !== api.selectedScrollSnap()) {
                  api.scrollTo(currentSlide);
                }
              }}
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id}>
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <Button 
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={`w-2 h-2 p-0 rounded-full ${
                      currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                    onClick={() => {
                      setCurrentSlide(index);
                      pauseAutoplay();
                    }}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        ) : (
          /* Desktop Grid View */
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
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

// Extracted Testimonial Card component for reuse
const TestimonialCard = ({ testimonial }) => {
  return (
    <div 
      className="bg-white rounded-xl p-8 shadow-lg border border-secondary-100/50 relative h-full"
      style={{ minHeight: '320px' }}
    >
      <Quote className="absolute top-6 right-6 text-primary-400 h-8 w-8 opacity-70" /> {/* Improved contrast */}
      
      <div className="flex items-center mb-5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">"{testimonial.text}"</p>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center">
        <Avatar className="h-12 w-12 border-2 border-primary-100 mr-4">
          {testimonial.avatar ? (
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
          ) : (
            <AvatarFallback className="bg-primary-100 text-primary-700">
              <User className="h-6 w-6" />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
