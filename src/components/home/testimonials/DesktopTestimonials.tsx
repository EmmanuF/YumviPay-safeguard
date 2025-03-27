
import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialType } from './types';
import TestimonialCard from './TestimonialCard';

interface DesktopTestimonialsProps {
  testimonials: TestimonialType[];
}

const DesktopTestimonials: React.FC<DesktopTestimonialsProps> = ({ testimonials }) => {
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
  );
};

export default DesktopTestimonials;
