
import React from 'react';
import { Quote, Star, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TestimonialType } from './types';

interface TestimonialCardProps {
  testimonial: TestimonialType;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div 
      className="testimony-card bg-white rounded-xl p-8 shadow-lg border border-secondary-100/50 relative h-full"
      style={{ minHeight: '320px' }}
    >
      <Quote className="absolute top-6 right-6 text-primary-600 h-8 w-8 opacity-80" />
      
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
        <Avatar className="h-12 w-12 border-2 border-primary-100 mr-4 overflow-hidden">
          {testimonial.avatar ? (
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
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

export default TestimonialCard;
