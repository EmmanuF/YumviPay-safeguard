
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "John D.",
      location: "USA to Ghana",
      rating: 5,
      text: "Yumvi-Pay made sending money to my family in Ghana so simple! The rates are excellent and the transfer was completed within hours."
    },
    {
      id: 2,
      name: "Marie L.",
      location: "Canada to Kenya",
      rating: 5,
      text: "I've tried several transfer services, but Yumvi-Pay offers the best rates and fastest delivery to Kenya. Highly recommended!"
    },
    {
      id: 3,
      name: "Samuel K.",
      location: "UK to Nigeria",
      rating: 4,
      text: "Very easy to use, transparent fees, and excellent customer service. The mobile app makes everything so convenient."
    }
  ];

  return (
    <motion.div 
      className="py-16 bg-secondary-100/80 rounded-3xl my-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thousands of people trust Yumvi-Pay to send money to their loved ones every day
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              className="glass-effect rounded-xl p-6 relative"
              whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(110, 54, 229, 0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Quote className="absolute top-4 right-4 text-primary-200 h-8 w-8 opacity-50" />
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-secondary-600 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div className="mt-4 pt-4 border-t border-secondary-200">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonials;
